/* eslint-disable no-param-reassign */
import axios from 'axios';
import parser from './parser';

const getRssData = (url, state, i18n) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    // eslint-disable-next-line consistent-return
    .then((response) => {
      const rssContent = response.data.contents;
      const parse = new DOMParser();
      const htm = parse.parseFromString(rssContent, 'text/html');
      const rssItem = htm.querySelector('rss');

      if (!rssItem) {
        state.form.validationMessage = i18n.t('validationMessage.errorServerAnswer');
        state.form.status = 'invalidRss';
        throw new Error(i18n.t('validationMessage.errorServerAnswer'));
      }

      state.form.status = 'loading';
      parser(rssContent, state);
    })
    .then(() => {
      state.form.validationMessage = 'validationMessage.correctServerAnswer';
      state.form.status = 'loaded';
    })
    .catch((err) => {
      if (err.message === 'Network Error') {
        state.form.validationMessage = i18n.t('validationMessage.networkError');
        state.form.status = 'networkError';
      } else {
        state.form.validationMessage = i18n.t('validationMessage.errorServerAnswer');
      }
    });
};

export default getRssData;
