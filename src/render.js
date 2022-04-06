import { feedPattern, feedsAndPostsRender, postPattern } from './postsAndFeedsRender.js';

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
  elements.urlInput.classList.add('is-invalid');
  elements.submitButton.disabled = true;
};
export default (elements, state, i18nextInstance) => {
  switch (state.processState) {
    case 'filling':
      elements.urlInput.classList.remove('is-invalid');
      elements.submitButton.disabled = false;
      break;
    case 'error':
      makeErrorOnInput(elements);
      elements.feedbackMessage.textContent = state.feedbackMessage;
      break;
    case 'success':
      elements.form.reset();
      elements.urlInput.focus();
      changeMessageFromErrorToSuccess(elements);
      elements.feedbackMessage.textContent = i18nextInstance.t('success');
      break;
    case 'alreadyExistError':
      makeErrorOnInput(elements);
      elements.feedbackMessage.textContent = i18nextInstance.t('errors.alreadyExistingRss');
      break;
    case 'haveNoValidRss':
      makeErrorOnInput(elements);
      elements.feedbackMessage.textContent = i18nextInstance.t('errors.haveNoValidRss');
      break;
    case 'postsAndFeedsRender':
      feedsAndPostsRender(elements, state, 'posts', i18nextInstance, postPattern(state));
      feedsAndPostsRender(elements, state, 'feeds', i18nextInstance, feedPattern(state));
      break;
    default:
      throw new Error(`unknown state process: ${state.processState}`);
  }
};
