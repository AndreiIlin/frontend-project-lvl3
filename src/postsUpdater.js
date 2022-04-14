import { differenceBy } from 'lodash';
import loadRss from './rssLoader.js';
import parseRSS from './parserRSS.js';
import { parsePost } from './postsAndFeedsDataParser.js';

export default (state, i18nextInstance) => {
  state.feedsList.forEach((feed) => {
    const { link } = feed;
    const { id } = feed;
    const existingPosts = state.postsList.filter((post) => post.feedId === id);
    loadRss(link, i18nextInstance)
      .then((response) => parseRSS(response.data.contents))
      .then((parsedData) => {
        const posts = parsedData.querySelectorAll('item');
        const parsedPosts = [...posts].map((post) => parsePost(post, id));
        const newPosts = differenceBy(parsedPosts, existingPosts, 'link');
        state.postsList.unshift(...newPosts);
      })
      .then(() => {
        state.processState = 'postsRender';
      });
  });
};
