const assert = require('assert');
const config = require('../src/config.js');

describe('Config', () => {
	it('should have DEBUG set to false', () => {
		assert.equal(config.DEBUG, false);
	});
});