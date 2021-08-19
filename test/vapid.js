const assert = require('assert');
const VAPID = require('../src/vapid.json');

describe('VAPID', () => {
	it('should have a public key', () => {
		assert(VAPID.hasOwnProperty('publicKey'));
	});
	it('should have a private key', () => {
		assert(VAPID.hasOwnProperty('privateKey'));
	});
});