import * as yup from 'yup';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/index';
import updatePosts from './utils/updatePosts.js';
import getRssData from './utils/getRssData.js';

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
      status: null,
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
    return schema.validate(link, { abortEarly: false });
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
        getRssData(url, watchedState, i18n);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.validationMessage = err.message;
        watchedState.form.status = 'validationError';
      });
  });

  updatePosts(watchedState.rssList, watchedState.posts, watchedState);

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
