import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import view from './view.js';
import resources from './locales/index';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    field: document.querySelector('#url-input'),
    validationField: document.querySelector('.feedback'),
    containerPosts: document.querySelector('.posts'),
    containerFeeds: document.querySelector('.feeds'),
  };

  const defaultLang = 'ru';

  const initialState = {
    form: {
      status: 'filling',
      valid: true,
      validationMessage: '',
      rssList: [],
    },
    posts: [],
    feeds: [],
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
      .then(() => {
        // watchedState.form.status = 'sending';
      })
      .catch((err) => {
        watchedState.form.validationMessage = err.message;
        watchedState.form.status = 'error';
      });

    axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
      .then((response) => {
        watchedState.form.status = 'loading';

        const rssContent = response.data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(rssContent, 'text/html');
        const titleFeed = doc.querySelector('title');
        const descrFeed = doc.querySelector('description');

        const feed = {
          name: titleFeed.textContent,
          desc: descrFeed.textContent.trim(),
        };

        watchedState.feeds.push(feed);
        watchedState.form.validationMessage = 'validationMessage.correctServerAnswer';

        const items = Array.from(doc.querySelectorAll('item'));
        // eslint-disable-next-line array-callback-return
        items.map((item) => {
          const title = item.querySelector('title');
          const link = item.querySelector('link');
          const description = item.querySelector('description');

          const post = {
            name: title.textContent.trim(),
            link: link.nextSibling.data.trim(),
            desc: description.textContent.trim(),
          };
          watchedState.posts.push(post);
        });
      })
      .then(() => {
        watchedState.form.status = 'loaded';
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
