import { feedPattern, renderFeedsAndPosts, postPattern } from './postsAndFeedsRender.js';

const changeFeedbackClassToSuccess = (elements) => {
  elements.feedbackMessage.classList.remove('text-danger');
  elements.feedbackMessage.classList.add('text-success');
};

const changeFeedbackClassToError = (elements) => {
  elements.feedbackMessage.classList.remove('text-success');
  elements.feedbackMessage.classList.add('text-danger');
};

const makeErrorOnInput = (elements) => {
  if (elements.feedbackMessage.classList.contains('text-success')) {
    changeFeedbackClassToError(elements);
  }
  elements.input.classList.add('is-invalid');
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
      elements.feedbackMessage.textContent = state.feedbackMessage;
      break;
    case 'success':
      elements.input.readOnly = false;
      elements.input.value = '';
      elements.input.focus();
      elements.submitButton.disabled = false;
      changeFeedbackClassToSuccess(elements);
      elements.feedbackMessage.textContent = i18nextInstance.t('success');
      break;
    case 'postsRender':
      renderFeedsAndPosts(elements, state, 'posts', i18nextInstance, postPattern(state, elements, i18nextInstance));
      break;
    case 'feedsRender':
      renderFeedsAndPosts(elements, state, 'feeds', i18nextInstance, feedPattern(state));
      break;
    case 'modalWindowRender':
      elements.modalTitle.textContent = state.modalWindow.name;
      elements.modalBody.textContent = state.modalWindow.description;
      elements.readMoreButton.href = state.modalWindow.link;
      break;
    default:
      throw new Error(`unknown state process: ${state.processState}`);
  }
};
