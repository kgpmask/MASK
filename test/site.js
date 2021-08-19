const assert = require('assert');
const axios = require('axios');
const server = require('../src/mask.js');
const config = require('../src/config.js');

const pages = ['', 'home', 'art', 'youtube', 'events', 'about', 'members', 'submissions'];

describe('server', () => {
	it(`should serve basic pages [${pages.slice(1).join(', ')}]`, () => Promise.all(pages.map(page => {
		return new Promise((resolve, reject) => {
			axios.get(`http://localhost:${config.PORT}/${page}`).then(() => {
				resolve('OK');
			}).catch(reject);
		});
	})).then(() => {
		server.close();
		assert(true);
	}).catch(res => {
		server.close();
		assert.fail(res.request.path);
	}));
});