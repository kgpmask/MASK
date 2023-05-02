const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const PORT = 42069;

const pages = ['', 'home', 'art', 'videos', 'events', 'about', 'members', 'submissions'];

before(() => server.ready());

describe('Server', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`))
			.timeout(process.platform === 'win32' ? 5_000 : 1_500);
		// Pages should render in under 1.5s (or 5 seconds on Windows)
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));

	describe('Errors', () => {
		it('should handle uncaught GET errors', () => {
			return axios.get(`http://localhost:${PORT}/error`).then(() => Promise.resolve(false)).catch(res => {
				assert.equal(res.response.status, 500);
				assert(res.response.data.includes('<h1> Server error! This may or may not be due to invalid input. </h1>'));
			});
		});
		it('should handle uncaught POST errors', () => {
			return axios.post(`http://localhost:${PORT}/error`).then(() => Promise.resolve(false)).catch(res => {
				assert.equal(res.response.status, 500);
				assert(res.response.data === 'Error: Sensitive error');
				// We're fine with the error being broadcast, but NOT the error stack
				// This is because we internally throw context errors to let the user
				// (or the browser) know why their request went wrong if they mess up
			});
		});
	});
});

after(() => server.close());
