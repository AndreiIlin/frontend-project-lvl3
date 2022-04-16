import { feedPattern, renderFeedsAndPosts, postPattern } from './postsAndFeedsRender.js';

const changeMessageFromErrorToSuccess = (elements) => {
  elements.feedbackMessage.classList.remove('text-danger');
  elements.feedbackMessage.classList.add('text-success');
};

const changeMessageFromSuccessToError = (elements) => {
  elements.feedbackMessage.classList.remove('text-success');
  elements.feedbackMessage.classList.add('text-danger');
};

const makeErrorOnInput = (elements) => {
  if (elements.feedbackMessage.classList.contains('text-success')) {
    changeMessageFromSuccessToError(elements);
  }
  elements.input.classList.add('is-invalid');
  elements.submitButton.disabled = true;
};

export default (elements, state, i18nextInstance) => {
  switch (state.processState) {
    case 'filling':
      elements.input.classList.remove('is-invalid');
      elements.submitButton.disabled = false;
      break;
    case 'processing':
      elements.submitButton.disabled = true;
      elements.input.disabled = true;
      break;
    case 'error':
      makeErrorOnInput(elements);
      elements.input.disabled = false;
      elements.feedbackMessage.textContent = state.feedbackMessage;
      break;
    case 'success':
      elements.form.reset();
      elements.input.focus();
      elements.submitButton.disabled = false;
      elements.input.disabled = false;
      changeMessageFromErrorToSuccess(elements);
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
