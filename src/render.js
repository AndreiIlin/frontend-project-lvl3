const errorRender = (elements, status) => {
  switch (status) {
    case 'filling':
      elements.urlInput.classList.remove('is-invalid');
      elements.submitButton.disabled = false;
      break;
    case 'error':
      elements.urlInput.classList.add('is-invalid');
      elements.submitButton.disabled = true;
      break;
    case 'success':
      elements.form.reset();
      elements.urlInput.focus();
      break;
    default:
      throw new Error(`unknown status: ${status}`);
  }
};

export default (elements) => (path, value) => {
  switch (path) {
    case 'processState':
      errorRender(elements, value);
      break;
    default:
      break;
  }
};
