import _ from 'lodash';

const handleFeedData = (parsedFeed, link) => ({
  ...parsedFeed,
  link,
  id: _.uniqueId(),
});

export const handlePostsData = (parsedPosts, feed) => parsedPosts.map((post) => ({
  ...post,
  id: _.uniqueId(),
  feedId: feed.id,
}));

export const handlePostsForUi = (posts) => posts.map((post) => ({
  id: post.id,
  postStatus: 'new',
}));

export default (state, data, link) => {
  const [parsedFeed, parsedPosts] = data;
  const feedToState = handleFeedData(parsedFeed, link);
  const postsToState = handlePostsData(parsedPosts, feedToState);
  const postsToUiState = handlePostsForUi(postsToState);
  state.postsList.unshift(...postsToState);
  state.feedsList.unshift(feedToState);
  state.uiState.posts.unshift(...postsToUiState);
};
