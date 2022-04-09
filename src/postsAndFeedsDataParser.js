import { uniqueId } from 'lodash';

export default (state, data, link, i18nextInstance) => {
  if (data.querySelector('parsererror')) {
    throw new Error(`${i18nextInstance.t('errors.haveNoValidRss')}`);
  }
  const feedName = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feedId = uniqueId();
  state.feedsList.unshift({
    name: feedName,
    description: feedDescription,
    id: feedId,
    link,
  });
  const posts = data.querySelectorAll('item');
  posts.forEach((post) => {
    const postName = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    const postId = uniqueId();
    state.postsList.unshift({
      name: postName,
      description: postDescription,
      link: postLink,
      id: postId,
      feedId,
      status: 'new',
    });
  });
};
