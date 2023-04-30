const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const PORT = 42069;

const pages = ['', 'home', 'art', 'videos', 'about', 'members', 'submissions'];
const oldPARAMS = Object.assign({}, PARAMS);

before(async () => {
	await server.ready();
	PARAMS.mongoless = true;
});

describe('Server (Mongoless mode)', () => {
	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`))
			.timeout(process.platform === 'win32' ? 5_000 : 3_000);
		// Pages should render in under 1.5s (or 5 seconds on Windows)
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));
});

after(async () => {
	await server.close();
	PARAMS = oldPARAMS;
});
