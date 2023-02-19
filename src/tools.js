const childProcess = require('child_process');
const util = require('util');

exports.deepClone = function deepClone (aObject) {
	if (!aObject) return aObject;
	const bObject = Array.isArray(aObject) ? [] : {};
	for (const k in aObject) {
		const v = aObject[k];
		bObject[k] = typeof v === "object" ? exports.deepClone(v) : v;
	}
	return bObject;
};

function isPrimitive (obj) {
	return obj !== Object(obj);
}

exports.deepEquals = function deepEquals (obj1, obj2) {
	if (obj1 === obj2) return true;
	if (isPrimitive(obj1) || isPrimitive(obj2)) return obj1 === obj2;
	const keys = Object.keys(obj1);
	if (keys.length !== Object.keys(obj2).length) return false;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (!obj2.hasOwnProperty(key)) return false;
		if (!exports.deepEquals(obj1[key], obj2[key])) return false;
	}
	return true;
};

exports.toID = function toID (string) {
	return (string?.toString() || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
};

exports.nth = function nth (num) {
	const lastDigit = num % 10;
	switch (lastDigit) {
		case 1: return num + (num - lastDigit !== 10 ? 'st' : 'th');
		case 2: return num + (num - lastDigit !== 10 ? 'nd' : 'th');
		case 3: return num + (num - lastDigit !== 10 ? 'rd' : 'th');
		default: return num + 'th';
	}
};

function xmur3 (str) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = h << 13 | h >>> 19;
	} return () => {
		h = Math.imul(h ^ h >>> 16, 2246822507);
		h = Math.imul(h ^ h >>> 13, 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

exports.fakeRandom = function fakeRandom (seed) {
	let a = xmur3(seed)();
	return () => {
		let t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
};

exports.levenshtein = function levenshtein (str1, str2) {
	// needs some maintenance
	if (!str1.length) return t.length;
	if (!str2.length) return str1.length;
	const arr = [];
	for (let i = 0; i <= str2.length; i++) {
		arr[i] = [i];
		for (let j = 1; j <= str1.length; j++) {
			arr[i][j] = i === 0 ? j : Math.min(
				arr[i - 1][j] + 1,
				arr[i][j - 1] + 1,
				arr[i - 1][j - 1] + (str1[j - 1] === str2[i - 1] ? 0 : 1)
			);
		}
	}
	return arr[str2.length][str1.length];
};

exports.levenshteinDamerau = function levenshteinDamerau (str1, str2, weights) {
	let len1 = str1.length;
	let len2 = str2.length;
	let i, j;
	let dist;
	let ic, dc, rc;
	let last, old;

	const weighter = weights || {
		insert: c => 3,
		delete: c => 3,
		replace: (c, d) => 2 // is added twice
	};

	if (len1 === 0 || len2 === 0) {
		dist = 0;
		while (len1) dist += weighter.delete(str1[--len1]);
		while (len2) dist += weighter.insert(str2[--len2]);
		return dist;
	}

	const column = [];
	column[0] = 0;

	for (j = 1; j <= len2; ++j) column[j] = column[j - 1] + weighter.insert(str2[j - 1]);

	for (i = 1; i <= len1; ++i) {
		last = column[0];
		column[0] += weighter.delete(str1[i - 1]);
		for (j = 1; j <= len2; ++j) {
			old = column[j];
			if (str1[i - 1] === str2[j - 1]) column[j] = last;
			else {
				ic = column[j - 1] + weighter.insert(str2[j - 1]);
				dc = column[j] + weighter.delete(str1[i - 1]);
				rc = last + weighter.replace(str1[i - 1], str2[j - 1]);
				column[j] = ic < dc ? ic : dc < rc ? dc : rc;
			}
			last = old;
		}
	}

	dist = column[len2];
	return dist;
};

exports.shell = async function exec (command) {
	const { stdout, stderr } = await util.promisify(childProcess.exec)(command);
	if (stderr) throw stderr;
	return stdout.trim();
};

exports.updateCode = async function () {
	const shell = exports.shell;
	const gitPull = await shell('git pull');
	const npmInstall = await shell('npm install');
	return { gitPull, npmInstall };
};



/*************
* Prototypes *
*************/

Array.prototype.random = function (amount) {
	if (!amount || typeof amount !== 'number') return this[Math.floor(Math.random() * this.length)];
	const sample = Array.from(this), out = [];
	let i = 0;
	while (sample.length && i++ < amount) {
		const term = sample[Math.floor(Math.random() * sample.length)];
		out.push(term);
		sample.remove(term);
	}
	return out;
};

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return Array.from(this);
};

/*
* Note:
*
* Adding Array prototypes (or any prototypes for that matter)
* is something that should only be done if you're absolutely
* sure about what you're doing. In this case, the prototypes
* act as polyfills for what're almost certain to eventually
* be released as actual methods.
*
*/
