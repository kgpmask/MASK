const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const config = require('../src/config.js');

const pages = ['', 'home', 'art', 'youtube', 'events', 'about', 'members', 'submissions'];

describe('server', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${config.PORT}/${page}`));
	});
});

after(() => server.close());