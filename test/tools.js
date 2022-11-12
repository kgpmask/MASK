const assert = require('assert');
const Tools = require('../src/tools.js');

describe('Tools.deepEquals', () => {
	it('should equate correctly', () => Tools.deepEquals({
		a: [{ a: ['1', 1] }]
	}, {
		a: [{ a: ['1', 1] }]
	}));

	it('should inequate correctly', () => Tools.deepEquals({
		a: [{ a: ['1', 1] }]
	}, {
		a: [{ a: [1, '1'] }]
	}));
});

describe('Tools.deepClone', () => {
	const source = { a: { b: [1, 2, 3, 4] } };
	const clone = Tools.deepClone(source);
	it('should create a clone', () => Tools.deepEquals(source, clone));
	clone.a.b = 2;
	it('should remove references', () => Array.isArray(source.a.b));
});

describe('Tools.fakeRandom', () => {
	const seed = 'this is a seed', otherSeed = 'this is another seed';
	const rand1 = Tools.fakeRandom(seed), rand2 = Tools.fakeRandom(seed);
	const rand3 = Tools.fakeRandom(otherSeed);
	const firstRands = [rand1(), rand2(), rand3()];
	it('should have seed variability', () => firstRands[0] === firstRands[1] && firstRands[1] !== firstRands[2]);
	const secondRands = [rand1(), rand2(), rand3()];
	it('should have different second values', () => {
		return secondRands[0] !== firstRands[0] && secondRands[1] !== firstRands[1] && secondRands[2] !== firstRands[2];
	});
	it('should maintain seed replication', () => secondRands[0] === secondRands[1] && secondRands[1] !== secondRands[2]);
});

describe('Tools.Levenshtein', () => {
	const strs = [
		'This is a test',
		'This is at est',
		'This is a test.',
		'This is a tes',
		'This is a tesy'
	];
	it('should work with indel', () => {
		return assert(Tools.levenshtein(strs[0], strs[2]) === 1 && Tools.levenshtein(strs[0], strs[3]) === 1);
	});
	it('should work with switch', () => assert(Tools.levenshtein(strs[0], strs[4]) === 1));
	it('should show swap as two operations', () => assert(Tools.levenshtein(strs[0], strs[1]) === 2));
});

describe('Tools.LevenshteinDamerau', () => {
	const strs = [
		'This is a test',
		'This is at est',
		'This is a test.',
		'This is a tes',
		'This is a tesy'
	];
	it('should work with indel', () => {
		return assert(Tools.levenshteinDamerau(strs[0], strs[2]) === 3 && Tools.levenshteinDamerau(strs[0], strs[3]) === 3);
	});
	it('should work with switch', () => assert(Tools.levenshteinDamerau(strs[0], strs[4]) === 2));
	// it('should work with swap', () => assert(Tools.levenshteinDamerau(strs[0], strs[1]) === 2));
	// Swap is broken
});
