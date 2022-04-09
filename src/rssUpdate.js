import { uniqueId, differenceBy } from 'lodash';
import loadRss from './loadRss.js';
import parseRSS from './parserRSS.js';

const rssUpdate = (state) => {
  state.feedsList.forEach((feed) => {
    const { link } = feed;
    const { id } = feed;
    const oldPosts = state.postsList.filter((post) => post.feedId === id);
    console.log('old', oldPosts);
    loadRss(link)
      .then((response) => parseRSS(response.data.contents))
      .then((parsedData) => {
        const posts = parsedData.querySelectorAll('item');
        const postsData = [...posts].map((post) => {
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
          };
        });
        console.log('all', postsData);
        const newPosts = differenceBy(postsData, oldPosts, 'link');
        console.log('new', newPosts);
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
