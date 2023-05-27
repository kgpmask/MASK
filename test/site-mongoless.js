const PORT = 42070;
process.env.PORT = PORT;
global.PARAMS = { mongoless: true, test: true, userless: true };

const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');

const pages = ['', 'home', 'art', 'videos', 'about', 'members', 'submissions', 'privacy', 'terms'];

describe('Server (Mongoless mode)', () => {

	before(async () => {
		await server.ready();
	});

	it('should have the right PARAMS object', () => assert.deepEqual(PARAMS, { mongoless: true, test: true, userless: true }));

	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`))
			.timeout(process.platform === 'win32' ? 5_000 : 3_000);
		// Pages should render in under 1.5s (or 5 seconds on Windows)
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));

	after(() => server.close());

});
