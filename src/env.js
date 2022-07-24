const fs = require('fs');
const path = require('path');

exports.init = () => {
	if (PARAMS.dev && PARAMS.prod) {
		console.log('Production access is disabled with dev mode. Please use the testing DB instead.');
		process.exit(1);
	}
	try {
		const file = fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf8');
		if (file) {
			const env = JSON.parse(file);
			for (const key in env) {
				if (process.env.hasOwnProperty(key)) continue; // don't override existing variables
				process.env[key] = env[key];
			}
		}
		if (!PARAMS.prod) [process.env.MONGO_URL, process.env.MONGO_TEST_URL] = [process.env.MONGO_TEST_URL, process.env.MONGO_URL];
		if (PARAMS.local) process.env.MONGO_URL = 'mongodb://127.0.0.1/mask';
	} catch (e) {
		console.log('[!] Unable to load credentials.json');
	}
};
