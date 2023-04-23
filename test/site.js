const PORT = 42069;
process.env.PORT = PORT;

const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');

const pages = ['', 'home', 'art', 'videos', 'events', 'about', 'members', 'submissions'];

describe('Server', () => {

	let DB;

	before(async function () {
		this.timeout(10_000);
		DB = await server.ready();
	});

	describe('Database', () => {
		it('should be connected', () => assert(DB.connection.readyState));

		it('should find the MASK user', async () => {
			const handler = require('../database/handler.js');
			const query = await handler.getUser('112743836736901320473');
			// kgpmask@gmail.com ID
			return assert(query?.name === 'MASK Society');
		}).timeout(10_000);
	});

	it('should have the right PARAMS object', () => assert.deepEqual(PARAMS, { test: true }));

	pages.forEach(page => {
		it(`should serve page (${page || '/'})`, () => axios.get(`http://localhost:${PORT}/${page}`))
			.timeout(process.platform === 'win32' ? 5_000 : 3_000);
		// Pages should render in under 3s (or 5 seconds on Windows)
	});

	it('should display 404s for pages that don\'t exist', () => axios.get(`http://localhost:${PORT}/hashire-sori-yo`)
		.then(() => Promise.resolve(false))
		.catch(res => assert.equal(res.response.status, 404)));

	after(() => server.close());

});
