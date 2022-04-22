import _ from 'lodash';
import loadRss from './rssLoader.js';
import parseRSS from './parserRSS.js';
import { handlePostsData, handlePostsForUi } from './stateDataImporter.js';

export default (state) => {
  state.feedsList.forEach((feed) => {
    const { link } = feed;
    const { id } = feed;
    const postsInState = state.postsList.filter((post) => post.feedId === id);
    loadRss(link)
      .then((response) => parseRSS(response.data.contents))
      .then((parsedRss) => {
        const [, parsedPosts] = parsedRss;
        const downloadedPosts = handlePostsData(parsedPosts, feed);
        const newPosts = _.differenceBy(downloadedPosts, postsInState, 'link');
        const newPostForUi = handlePostsForUi(newPosts);
        state.uiState.posts.unshift(...newPostForUi);
        state.postsList.unshift(...newPosts);
        state.processState = 'postsRender';
      });
  });
};
