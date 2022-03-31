import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import ru from './locales/ru.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  let schema;
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
      urlInput: yup.string().url(),
    });
  });
  const elements = {
    form: document.querySelector('form'),
    urlInput: document.getElementById('rss-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackMessage: document.querySelector('.feedback-message'),
  };
  const state = onChange({
    processState: 'filling',
    urlInput: '',
    feedList: [],
    feedbackMessage: '',
  }, () => {
    render(elements, state, i18nextInstance);
  });
  elements.urlInput.addEventListener('input', (e) => {
    state.urlInput = e.target.value;
    state.processState = 'filling';
  });
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    if (state.feedList.includes(formData.get('url'))) {
      state.processState = 'alreadyExistError';
      return;
    }
    schema.validate(state)
      .then(() => state.feedList.push(formData.get('url')))
      .then(() => {
        state.processState = 'success';
      })
      .catch((err) => {
        state.feedbackMessage = err.errors;
        state.processState = 'error';
      });
  });
};
