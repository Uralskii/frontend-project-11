import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import view from './view.js';
import resources from './locales/index';
import parser from './parser.js';

export default () => {
  const elements = {
    body: document.querySelector('body'),
    form: document.querySelector('.rss-form'),
    formField: document.querySelector('#url-input'),
    validationElement: document.querySelector('.feedback'),
    submitButton: document.querySelector('button'),
    containerPosts: document.querySelector('.posts'),
    containerFeeds: document.querySelector('.feeds'),
    containerModalWindow: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modal-link'),
    modalButton: document.querySelector('.btn-modal'),
  };

  const defaultLang = 'ru';

  const initialState = {
    form: {
      status: null,
      valid: true,
      validationMessage: '',
    },
    processUpdatePosts: {
      status: 'filling',
    },
    modalWindowOpen: false,
    rssList: [],
    feeds: [],
    posts: [],
    touchedPost: {},
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      required: i18n.t('validationMessage.required'),
    },
    string: {
      url: i18n.t('validationMessage.invalidUrl'),
    },
  });

  const watchedState = view(elements, initialState, i18n);

  const validation = (link, rssList) => {
    const schema = yup.string().url().required().notOneOf(rssList, i18n.t('validationMessage.rssAdded'));
    const formatLink = link.trim();

    return schema.validate(formatLink, { abortEarly: false });
  };

  const updatePost = (links) => {
    const promise = links.map((link) => {
      const getData = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);

      return getData;
    });

    Promise.all(promise)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        setTimeout(() => updatePost(links), 5000);
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.status = 'filling';

    const formData = new FormData(e.target);
    const { url } = Object.fromEntries(formData);

    validation(url, watchedState.rssList)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.validationMessage = '';
        watchedState.rssList.push(url);
      })
      .then(() => {
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
          // eslint-disable-next-line consistent-return
          .then((response) => {
            const rssContent = response.data.contents;

            if (!rssContent.startsWith('<?xml')) {
              watchedState.form.validationMessage = i18n.t('validationMessage.errorServerAnswer');
              watchedState.form.status = 'invalidRss';
              return Promise.reject();
            }

            watchedState.form.status = 'loading';
            parser(rssContent, watchedState);
          })
          .then(() => {
            watchedState.form.validationMessage = 'validationMessage.correctServerAnswer';
            watchedState.form.status = 'loaded';
          })
          .catch(() => {
            watchedState.form.validationMessage = i18n.t('validationMessage.networkError');
            watchedState.form.status = 'networkError';
          });
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.validationMessage = err.message;
        watchedState.form.status = 'validationError';
      });
  });

  updatePost(watchedState.rssList);

  elements.containerPosts.addEventListener('click', ({ target }) => {
    const element = target;
    const idElement = element.dataset.id;

    const touchedElement = watchedState.posts.filter((post) => post.postId === idElement);
    const [post] = touchedElement;

    watchedState.touchedPost = post;

    if (element.type === 'button') {
      watchedState.modalWindowOpen = true;
    }
  });

  elements.modalButton.addEventListener('click', () => {
    watchedState.modalWindowOpen = false;
  });
};
