import * as yup from 'yup';
import i18next from 'i18next';
// import axios from 'axios';
import view from './view.js';
import resources from './locales/index';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    field: document.querySelector('#url-input'),
    errorField: document.querySelector('.feedback'),
  };

  const defaultLang = 'ru';

  const initialState = {
    form: {
      status: 'filling',
      valid: true,
      errors: [],
      rssList: [],
    },
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  yup.setLocale({
    string: {
      required: i18n.t('validationMessage.required'),
      url: i18n.t('validationMessage.invalidUrl'),
    },
  });

  const watchedState = view(elements, initialState, i18n);

  const schema = yup.string().url().required().notOneOf(watchedState.form.rssList, i18n.t('validationMessage.rssAdded'));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { url } = Object.fromEntries(formData);

    watchedState.form.rssList.push(url);

    schema.validate(url, { abortEarly: false })
      .then((response) => {
        console.log(response);
        watchedState.form.status = 'sending';
      })
      .catch((err) => {
        console.log(err);
        watchedState.form.errors = err.message;
        watchedState.form.status = 'error';
      });
    // axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
    //   .then((response) => {
    //     const rssContent = response.data.contents;
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(rssContent, 'text/html');
    //     console.log(doc);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    elements.form.reset();
  });
};
