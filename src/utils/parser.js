import { uniqueId } from 'lodash';

export default (content, state) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(content, 'text/html');

  const titleFeed = html.querySelector('title');
  const descrFeed = html.querySelector('description');

  const feed = {
    name: titleFeed.textContent.trim(),
    desc: descrFeed.textContent.trim(),
    feedId: uniqueId(),
  };
  state.feeds.push(feed);

  const items = Array.from(html.querySelectorAll('item'));
  // eslint-disable-next-line array-callback-return
  items.map((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');

    const post = {
      name: title.textContent.trim(),
      link: link.nextSibling.data.trim(),
      desc: description.textContent.trim(),
      postId: uniqueId(),
      postFeedId: feed.feedId,
    };
    state.posts.push(post);
  });
};
