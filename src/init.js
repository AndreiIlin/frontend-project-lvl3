import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

const schema = yup.object().shape({
  urlInput: yup.string().url().matches(/.*\.rss$/),
});

export default () => {
  const elements = {
    form: document.querySelector('form'),
    urlInput: document.getElementById('rss-input'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const state = onChange({
    processState: 'filling',
    urlInput: '',
    feedList: [],
  }, render(elements));

  elements.urlInput.addEventListener('input', (e) => {
    state.urlInput = e.target.value;
    state.processState = 'filling';
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    if (state.feedList.includes(formData.get('url'))) {
      state.processState = 'error';
      return;
    }
    schema.validate(state)
      .then(() => state.feedList.push(formData.get('url')))
      .then(() => state.processState = 'success')
      .catch(() => state.processState = 'error');
  });
};
