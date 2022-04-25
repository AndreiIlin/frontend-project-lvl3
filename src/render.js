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

const getErrorText = (message, i18nextInstance) => {
  switch (message) {
    case 'not valid RSS':
      return i18nextInstance.t('errors.haveNoValidRss');
    case 'network problems':
      return i18nextInstance.t('errors.networkError');
    default:
      return message;
  }
};

export default (elements, state, i18nextInstance) => {
  switch (state.processState) {
    case 'filling':
      elements.input.classList.remove('is-invalid');
      break;
    case 'processing':
      elements.submitButton.disabled = true;
      elements.input.readOnly = true;
      break;
    case 'error':
      makeErrorOnInput(elements);
      elements.input.readOnly = false;
      elements.submitButton.disabled = false;
      elements.feedback.textContent = getErrorText(state.uiState.feedbackMessage, i18nextInstance);
      break;
    case 'postsRender':
      renderFeedsAndPosts(elements, state, 'posts', i18nextInstance, postPattern(state, elements, i18nextInstance));
      break;
    case 'postsAndFeedsRender':
      renderFeedsAndPosts(elements, state, 'feeds', i18nextInstance, feedPattern(state));
      renderFeedsAndPosts(elements, state, 'posts', i18nextInstance, postPattern(state, elements, i18nextInstance));
      elements.input.value = '';
      elements.input.readOnly = false;
      elements.input.focus();
      elements.submitButton.disabled = false;
      changeFeedbackClassToSuccess(elements);
      elements.feedback.textContent = i18nextInstance.t('success');
      break;
    case 'modalWindowRender':
      elements.modalTitle.textContent = state.uiState.modalWindow.name;
      elements.modalBody.textContent = state.uiState.modalWindow.description;
      elements.readMoreButton.href = state.uiState.modalWindow.link;
      break;
    default:
      throw new Error(`unknown state process: ${state.processState}`);
  }
};
