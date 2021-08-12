const assert = require('assert');
const VAPID = require('../src/vapid.json');

describe('VAPID', () => {
	it('should have a public key', () => {
		assert.equal(VAPID.hasOwnProperty('publicKey'), true);
	});
	it('should have a private key', () => {
		assert.equal(VAPID.hasOwnProperty('privateKey'), true);
	});
});