export default (elements, state, i18nextInstance) => {
  switch (state.processState) {
    case 'filling':
      elements.urlInput.classList.remove('is-invalid');
      elements.submitButton.disabled = false;
      break;
    case 'error':
      if (elements.feedbackMessage.classList.contains('text-success')) {
        elements.feedbackMessage.classList.remove('text-success');
        elements.feedbackMessage.classList.add('text-danger');
      }
      elements.urlInput.classList.add('is-invalid');
      elements.submitButton.disabled = true;
      elements.feedbackMessage.textContent = state.feedbackMessage;
      break;
    case 'success':
      elements.form.reset();
      elements.urlInput.focus();
      elements.feedbackMessage.classList.remove('text-danger');
      elements.feedbackMessage.classList.add('text-success');
      elements.feedbackMessage.textContent = i18nextInstance.t('success');
      break;
    case 'alreadyExistError':
      if (elements.feedbackMessage.classList.contains('text-success')) {
        elements.feedbackMessage.classList.remove('text-success');
        elements.feedbackMessage.classList.add('text-danger');
      }
      elements.urlInput.classList.add('is-invalid');
      elements.submitButton.disabled = true;
      elements.feedbackMessage.textContent = i18nextInstance.t('errors.alreadyExistingRss');
      break;
    default:
      throw new Error(`unknown status: ${state.processState}`);
  }
};
