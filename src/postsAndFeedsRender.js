export const feedsAndPostsRender = (elements, state, key, i18nextInstance, pattern) => {
  elements[key].innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `<h2 class="card-title h4">${i18nextInstance.t(`${key}`)}</h2>`;
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
  liEl.innerHTML = `<h3 class="h6 m-0">${feed.name}</h3>
<p class="m-0 small text-black-50">${feed.description}</p>`;
  return liEl;
});
export const postPattern = (state) => state.postsList.map((post) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex');
  liEl.dataset.id = post.id;
  liEl.innerHTML = `<a href="${post.link}" class="fw-bold">${post.name}</a>`;
  return liEl;
});
