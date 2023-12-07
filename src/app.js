import * as yup from 'yup';
import i18next from 'i18next';
// import axios from 'axios';
import view from './view.js';
import resources from './locales/index';

export default async () => {
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
    },
  };

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  yup.setLocale({
    string: {
      required: i18n.t('validation.required'),
      url: i18n.t('validation.correctUrl'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url().required().trim(),
  });

  const watchedState = view(elements, initialState, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = Object.fromEntries(formData);

    // axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
    //   .then((response) => {
    //     console.log(response.data.contents);
    //   });

    schema.validate(url, { abortEarly: false })
      .then(() => {
        watchedState.form.status = 'sending';
      })
      .catch((err) => {
        console.log(err);
        watchedState.form.errors = err.message;
        watchedState.form.status = 'error';
      });
  });
};
