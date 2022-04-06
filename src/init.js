import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import render from './render.js';
import ru from './locales/ru.js';
import parseRSS from './parserRSS.js';
import getPostsAndFeeds from './postsAndFeeds.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  let schema;
  const elements = {
    form: document.querySelector('form'),
    urlInput: document.getElementById('rss-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackMessage: document.querySelector('.feedback-message'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };
  const state = onChange({
    processState: 'filling',
    inputValue: {
      url: '',
    },
    feedsList: [],
    postsList: [],
    feedbackMessage: '',
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
    });
  }).then(() => {
    schema = yup.object().shape({
      url: yup.string().url(),
    });
  });
  elements.urlInput.addEventListener('input', (e) => {
    state.inputValue.url = e.target.value;
    state.processState = 'filling';
  });
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const link = formData.get('url').trim();
    if (state.feedsList.find((feed) => feed.link === link)) {
      state.processState = 'alreadyExistError';
      return;
    }
    schema.validate(state.inputValue)
      .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`))
      .then((response) => parseRSS(response.data.contents))
      .then((parsedData) => getPostsAndFeeds(state, parsedData, link, i18nextInstance))
      .then(() => {
        state.processState = 'success';
      })
      .then(() => {
        state.processState = 'postsAndFeedsRender';
      })
      .catch((err) => {
        state.feedbackMessage = err.errors;
        state.processState = 'error';
      });
  });
};
