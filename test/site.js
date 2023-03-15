const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const process = require('process');
const PORT = 42069;

const pages = ['', 'home', 'art', 'videos', 'events', 'about', 'members', 'submissions'];

before(() => server.ready());
describe('Server', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`))
			.timeout(process.platform === 'win32' ? 2_500 : 1_500);
		// Pages should render in under a second or 2.5 seconds in case of windows, cuz windows slow
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));
});

after(() => server.close());
