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
    rssList: [],
    feeds: [],
    posts: [],
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
          .then((response) => {
            console.log(response);
            const rssContent = response.data.contents;

            if (!rssContent.startsWith('<?xml')) {
              watchedState.form.validationMessage = i18n.t('validationMessage.errorServerAnswer');
              watchedState.form.status = 'invalidRss';
              return;
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
    console.log(watchedState);
  });

  updatePost(watchedState.rssList);

  // elements.containerPosts.addEventListener('click', (e) => {
  //   const element = e.target;

  //   if (element.type === 'button') {
  //     watchedState.postProcessVisit.status = 'watch';
  //   }
  // });
};
