import axios from 'axios';

export default (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${link}`)}`);
