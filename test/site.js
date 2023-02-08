const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask');
const { PORT } = require('../src/config');
const { disconnectFromDB } = require('../database/handler');

const pages = ['', 'home', 'art', 'videos', 'events', 'about', 'members', 'submissions', '404'];

before(() => {
	server.ready();
});

describe('Server', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`)).timeout(1_000);
		// Pages should render in under a second
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));
});

after(() => {
	disconnectFromDB();
	server.close();
});
