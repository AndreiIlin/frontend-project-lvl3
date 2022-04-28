import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import ru from './locales/ru.js';
import parseRSS from './parserRSS.js';
import importDataToState from './stateDataImporter.js';
import loadRss from './rssLoader.js';
import updatePosts from './postsUpdater.js';

export default () => {
  const i18n = i18next.createInstance();

  const elements = {
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    readMoreButton: document.querySelector('.read-more'),
    form: document.querySelector('form'),
    input: document.getElementById('rss-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback-message'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = onChange({
    processState: 'filling',
    feedsList: [],
    postsList: [],
    uiState: {
      inputValue: '',
      posts: [],
      modalWindow: null,
      errorMessage: '',
    },
  }, (path, value) => render(elements, state, i18n, path, value));

  i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => {
    yup.setLocale({
      string: {
        url: i18n.t('errors.invalidUrl'),
      },
      mixed: {
        required: i18n.t('errors.emptyField'),
        notOneOf: i18n.t('errors.alreadyExistingRss'),
      },
    });
  });

  const startUpdate = () => {
    updatePosts(state);
    setTimeout(startUpdate, 5000);
  };

  startUpdate();

  elements.input.addEventListener('input', ({ target }) => {
    state.uiState.inputValue = target.value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.processState = 'processing';
    const formData = new FormData(elements.form);
    const link = formData.get('url').trim();
    const schema = yup.object().shape({
      inputValue: yup.string().required().url().notOneOf(state.feedsList.map((feed) => feed.link)),
    });
    schema.validate(state.uiState)
      .then(() => loadRss(link))
      .then((response) => {
        const parsedRss = parseRSS(response.data.contents);
        importDataToState(state, parsedRss, link);
        state.processState = 'finished';
      })
      .catch((err) => {
        state.uiState.errorMessage = err.errors ? err.errors : err.message;
      });
  });
};
