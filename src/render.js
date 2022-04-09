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
    case 'error':
      makeErrorOnInput(elements);
      elements.feedbackMessage.textContent = state.feedbackMessage;
      break;
    case 'success':
      elements.form.reset();
      elements.input.focus();
      changeMessageFromErrorToSuccess(elements);
      elements.feedbackMessage.textContent = i18nextInstance.t('success');
      break;
    case 'postsRender':
      renderFeedsAndPosts(elements, state, 'posts', i18nextInstance, postPattern(state, i18nextInstance));
      break;
    case 'feedsRender':
      renderFeedsAndPosts(elements, state, 'feeds', i18nextInstance, feedPattern(state));
      break;
    default:
      throw new Error(`unknown state process: ${state.processState}`);
  }
};
