import axios from 'axios';

export default (link, i18nextInstance) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${link}`)}`)
  .catch(() => {
    throw new Error(i18nextInstance.t('errors.networkError'));
  });
