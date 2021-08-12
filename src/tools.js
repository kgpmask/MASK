exports.deepClone = function (aObject) {
	if (!aObject) return aObject;
	let v, bObject = Array.isArray(aObject) ? [] : {};
	for (const k in aObject) {
		v = aObject[k];
		bObject[k] = (typeof v === "object") ? exports.deepClone(v) : v;
	}
	return bObject;
};

exports.toID = function (string) {
	return (string?.toString() || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
};


/*
* Prototypes
*/

Array.prototype.random = function (amount) {
	if (!amount || typeof amount !== 'number') return this[Math.floor(Math.random() * this.length)];
	let sample = Array.from(this), i = 0, out = [];
	while (sample.length && i++ < amount) {
		let term = sample[Math.floor(Math.random() * sample.length)];
		out.push(term);
		sample.remove(term);
	}
	return out;
};

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return Array.from(this);
};

/*
* Note;
* 
* Adding Array prototypes (or any prototypes for that matter)
* is something that should only be done if you're absolutely
* sure about what you're doing. In this case, the prototypes
* act as polyfills for what're almost certain to eventually
* be released as actual methods.
*
*/