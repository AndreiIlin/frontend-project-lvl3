import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import ru from './locales/ru.js';
import parseRSS from './parserRSS.js';
import getPostsAndFeedsData from './postsAndFeedsDataParser.js';
import loadRss from './rssLoader.js';
import updatePosts from './postsUpdater.js';

export default () => {
  const i18nextInstance = i18next.createInstance();

  const elements = {
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    readMoreButton: document.querySelector('.read-more'),
    form: document.querySelector('form'),
    input: document.getElementById('rss-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackMessage: document.querySelector('.feedback-message'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = onChange({
    processState: 'filling',
    inputValue: '',
    feedsList: [],
    postsList: [],
    feedbackMessage: '',
    modalWindow: {
      name: '',
      description: '',
      link: '',
    },
  }, () => {
    render(elements, state, i18nextInstance);
  });

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => {
    yup.setLocale({
      string: {
        url: i18nextInstance.t('errors.invalidUrl'),
      },
      mixed: {
        required: i18nextInstance.t('errors.emptyField'),
        notOneOf: i18nextInstance.t('errors.alreadyExistingRss'),
      },
    });
  });

  let timerId;
  const startUpdate = () => {
    updatePosts(state, i18nextInstance);
    timerId = setTimeout(startUpdate, 5000);
  };

  elements.input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    state.processState = 'filling';
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const link = formData.get('url').trim();
    state.processState = 'processing';
    console.log(link);
    const schema = yup.object().shape({
      inputValue: yup.string().required().url().notOneOf(state.feedsList.map((feed) => feed.link)),
    });
    schema.validate(state)
      .then(() => loadRss(link, i18nextInstance))
      .then((response) => parseRSS(response.data.contents))
      .then((parsedData) => getPostsAndFeedsData(state, parsedData, link, i18nextInstance))
      .then(() => {
        state.processState = 'success';
        state.processState = 'postsRender';
        state.processState = 'feedsRender';
      })
      .then(() => {
        clearTimeout(timerId);
        startUpdate();
      })
      .catch((err) => {
        state.feedbackMessage = err.errors ? err.errors : err.message;
        state.processState = 'error';
      });
  });
};
