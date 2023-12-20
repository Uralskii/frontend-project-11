/* eslint-disable no-param-reassign */
import axios from 'axios';
import { uniqueId } from 'lodash';

const updatePosts = (links, posts, state) => {
  const promise = links.map((link) => {
    const getData = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);

    return getData;
  });

  Promise.all(promise)
    .then((response) => {
      const newPosts = response.map((res) => {
        const rssContent = res.data.contents;
        const parse = new DOMParser();
        const html = parse.parseFromString(rssContent, 'text/html');
        const item = Array.from(html.querySelectorAll('item'));

        return item;
      });
      const allNewPosts = newPosts.flat();
      const title = allNewPosts.map((post) => {
        const desc = post.querySelector('title');
        const link = post.querySelector('link');
        const description = post.querySelector('description');

        const pos = {
          name: desc.textContent.trim(),
          link: link.nextSibling.data.trim(),
          desc: description.textContent.trim(),
          postId: uniqueId(),
        };

        return pos;
      });
      const namePosts = posts.map((post) => post.name);

      const has = title.filter((tit) => !namePosts.includes(tit.name));
      console.log(has);
      if (has.length > 0) {
        state.posts.push(...has);
        state.processUpdatePosts.status = 'newpost';
      }
    })
    .then(() => {
      state.processUpdatePosts.status = 'loaded';
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setTimeout(() => updatePosts(links, posts, state), 5000);
    });
};

export default updatePosts;
