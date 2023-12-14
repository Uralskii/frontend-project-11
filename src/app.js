import * as yup from 'yup';
import i18next from 'i18next';
// import axios from 'axios';
import view from './view.js';
import resources from './locales/index';

export default () => {
  const elements = {
    body: document.querySelector('body'),
    form: document.querySelector('.rss-form'),
    formField: document.querySelector('#url-input'),
    validationElement: document.querySelector('.feedback'),
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
    // postProcessVisit: {
    //   status: null,
    // },
    rssList: [],
    postsList: [],
    feedsList: [],
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
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.validationMessage = err.message;
        watchedState.form.status = 'validationError';
      });
  });

  // elements.containerPosts.addEventListener('click', (e) => {
  //   const element = e.target;

  //   if (element.type === 'button') {
  //     watchedState.postProcessVisit.status = 'watch';
  //   }
  // });
};

// axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
//   .then((response) => {
//     watchedState.form.status = 'loading';

//     const rssContent = response.data.contents;
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(rssContent, 'text/html');
//     const titleFeed = doc.querySelector('title');
//     const descrFeed = doc.querySelector('description');

//     const feed = {
//       name: titleFeed.textContent,
//       desc: descrFeed.textContent.trim(),
//     };

//     watchedState.feeds.push(feed);
//     watchedState.form.validationMessage = 'validationMessage.correctServerAnswer';

//     const items = Array.from(doc.querySelectorAll('item'));
//     // eslint-disable-next-line array-callback-return
//     items.map((item) => {
//       const title = item.querySelector('title');
//       const link = item.querySelector('link');
//       const description = item.querySelector('description');

//       const post = {
//         name: title.textContent.trim(),
//         link: link.nextSibling.data.trim(),
//         desc: description.textContent.trim(),
//       };
//       watchedState.posts.push(post);
//     });
//   })
//   .then(() => {
//     watchedState.form.status = 'loaded';
//   })
//   .catch((err) => {
//     console.log(err);
//   });
