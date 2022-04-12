import { uniqueId, differenceBy } from 'lodash';
import loadRss from './loadRss.js';
import parseRSS from './parserRSS.js';

const rssUpdate = (state, i18nextInstance) => {
  state.feedsList.forEach((feed) => {
    const { link } = feed;
    const { id } = feed;
    const existingPosts = state.postsList.filter((post) => post.feedId === id);
    loadRss(link, i18nextInstance)
      .then((response) => parseRSS(response.data.contents))
      .then((parsedData) => {
        const posts = parsedData.querySelectorAll('item');
        const parsedPosts = [...posts].map((post) => {
          const postName = post.querySelector('title').textContent;
          const postDescription = post.querySelector('description').textContent;
          const postLink = post.querySelector('link').textContent;
          const postId = uniqueId();
          return {
            name: postName,
            description: postDescription,
            link: postLink,
            id: postId,
            feedId: id,
            status: 'new',
          };
        });
        const newPosts = differenceBy(parsedPosts, existingPosts, 'link');
        newPosts.forEach((newPost) => {
          state.postsList.unshift(newPost);
        });
      })
      .then(() => {
        state.processState = 'postsRender';
      });
  });
};
export default rssUpdate;
