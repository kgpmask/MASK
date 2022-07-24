global.PARAMS = { userless: true };

const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const config = require('../src/config.js');

const pages = ['', 'home', 'art', 'videos', 'events', 'about', 'members', 'submissions', '404'];

describe('server', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${config.PORT}/${page}`));
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${config.PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));
});

after(() => server.close());