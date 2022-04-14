import _ from 'lodash';

const parseFeed = (data, link) => {
  const feedName = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feedId = _.uniqueId();
  return {
    name: feedName,
    description: feedDescription,
    id: feedId,
    link,
  };
};

export const parsePost = (post, feedId) => {
  const postName = post.querySelector('title').textContent;
  const postDescription = post.querySelector('description').textContent;
  const postLink = post.querySelector('link').textContent;
  const postId = _.uniqueId();
  return {
    name: postName,
    description: postDescription,
    link: postLink,
    id: postId,
    feedId,
    status: 'new',
  };
};

export default (state, data, link, i18nextInstance) => {
  if (data.querySelector('parsererror')) {
    throw new Error(`${i18nextInstance.t('errors.haveNoValidRss')}`);
  }
  const parsedFeed = parseFeed(data, link);
  state.feedsList.unshift(parsedFeed);
  const posts = data.querySelectorAll('item');
  const parsedPosts = [...posts].map((post) => parsePost(post, parsedFeed.id));
  state.postsList.unshift(...parsedPosts);
};
