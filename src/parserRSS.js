const parseFeed = (data) => {
  const feedName = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  return {
    name: feedName,
    description: feedDescription,
  };
};

export const parsePost = (data) => {
  const postName = data.querySelector('title').textContent;
  const postDescription = data.querySelector('description').textContent;
  const postLink = data.querySelector('link').textContent;
  return {
    name: postName,
    description: postDescription,
    link: postLink,
  };
};

export default (data, state) => {
  const parser = new DOMParser();
  const parsedXml = parser.parseFromString(data, 'application/xml');
  if (parsedXml.querySelector('parsererror')) {
    throw new Error('not valid RSS');
  }
  const parsedFeed = parseFeed(parsedXml);
  const posts = parsedXml.querySelectorAll('item');
  const parsedPosts = [...posts].map((post) => parsePost(post));
  state.processState = 'downloadSuccess';
  return [parsedFeed, parsedPosts];
};
