import { feedPattern, renderFeedsAndPosts, postPattern } from './postsAndFeedsRender.js';

const changeFeedbackClassToSuccess = (elements) => {
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
};

const changeFeedbackClassToError = (elements) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
};

const makeErrorOnInput = (elements) => {
  if (elements.feedback.classList.contains('text-success')) {
    changeFeedbackClassToError(elements);
  }
  elements.input.classList.add('is-invalid');
};

const getErrorText = (message, i18n) => {
  switch (message) {
    case 'not valid RSS':
      return i18n.t('errors.haveNoValidRss');
    case 'network problems':
      return i18n.t('errors.networkError');
    default:
      return message;
  }
};

const processStateHandle = (state, elements, i18n) => {
  switch (state) {
    case 'processing':
      elements.submitButton.disabled = true;
      elements.input.readOnly = true;
      break;
    case 'finished':
      elements.input.value = '';
      elements.input.readOnly = false;
      elements.input.focus();
      elements.submitButton.disabled = false;
      changeFeedbackClassToSuccess(elements);
      elements.feedback.textContent = i18n.t('success');
      break;
    default:
      throw new Error(`unknown state: ${state}`);
  }
};

export default (elements, state, i18n, path, value) => {
  switch (path) {
    case 'processState':
      processStateHandle(value, elements, i18n);
      break;
    case 'feedsList':
      renderFeedsAndPosts(elements, 'feeds', i18n, feedPattern(state));
      break;
    case 'uiState.inputValue':
      elements.input.classList.remove('is-invalid');
      break;
    case 'uiState.posts':
      renderFeedsAndPosts(elements, 'posts', i18n, postPattern(state, elements, i18n, path, value));
      break;
    case 'uiState.modalWindow':
      elements.modalTitle.textContent = value.name;
      elements.modalBody.textContent = value.description;
      elements.readMoreButton.href = value.link;
      break;
    case 'uiState.errorMessage':
      makeErrorOnInput(elements);
      elements.input.readOnly = false;
      elements.submitButton.disabled = false;
      elements.feedback.textContent = getErrorText(value, i18n);
      break;
    default:
      break;
  }
};
