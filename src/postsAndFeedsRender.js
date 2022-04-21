const findPostById = (post, state) => {
  const { id } = post;
  const p = state.uiState.posts.find((post) => post.id === id);
  // console.log(p);
  return p;
};

export const renderFeedsAndPosts = (elements, state, key, i18nextInstance, pattern) => {
  elements[key].innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const header = document.createElement('h2');
  header.classList.add('card-title', 'h4');
  header.textContent = i18nextInstance.t(`${key}`);
  cardBody.append(header);
  card.append(cardBody);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  list.append(...pattern);
  card.append(list);
  elements[key].append(card);
};

export const feedPattern = (state) => state.feedsList.map((feed) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  const header = document.createElement('h3');
  header.classList.add('h6', 'm-0');
  header.textContent = feed.name;
  const text = document.createElement('p');
  text.classList.add('m-0', 'small', 'text-black-50');
  text.textContent = feed.description;
  liEl.append(header, text);
  return liEl;
});

export const postPattern = (state, elements, i18nextInstance) => state.postsList.map((post) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
  liEl.dataset.id = post.id;
  const anchor = document.createElement('a');
  anchor.href = post.link;
  console.log(state.uiState.posts);
  anchor.className = findPostById(post, state).postStatus === 'new' ? 'fw-bold' : 'fw-normal link-secondary';
  anchor.textContent = post.name;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'modal-window-button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal-window');
  button.textContent = i18nextInstance.t('feedButton');
  button.addEventListener('click', () => {
    findPostById(post, state).postStatus = 'read';
    state.processState = 'postsRender';
    state.uiState.modalWindow.name = post.name;
    state.uiState.modalWindow.description = post.description;
    state.uiState.modalWindow.link = post.link;
    state.processState = 'modalWindowRender';
  });
  liEl.append(anchor, button);
  return liEl;
});
