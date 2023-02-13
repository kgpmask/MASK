const assert = require('assert');
const axios = require('axios');
const DB = require('../database/database.js');
const handler = require('../database/handler.js');

let db;

before(async function () {
	this.timeout(5_000);
	db = await DB.init();
});

describe('Database connection', () => {
	it('should be connected', () => assert(db.connection.readyState));
});

describe('User', () => {
	it('should find the MASK user', async () => {
		const query = await handler.getUser('112743836736901320473');
		// kgpmask@gmail.com ID
		return assert(query?.name === 'MASK Society');
	}).timeout(10_000);
});

after(() => DB.disconnect());
