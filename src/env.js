const fs = require('fs');
const path = require('path');

const aliases = {
	d: 'dev',
	l: 'local',
	p: 'prod',
	u: 'userless',
	m: 'mongoless',
	q: 'quiz'
};
const validParams = ['dev', 'local', 'prod', 'mongoless', 'userless', 'quiz'];
if (!global.PARAMS) {
	if (process.env['NODE_ENV'] === 'production') process.env.prod = true;
	const shorts = new Set();
	const entries = process.argv.slice(2).map(arg => {
		if (!validParams.includes(arg)) {
			arg.split('').forEach(a => shorts.add(a));
			return false;
		}
		return [arg, true];
	}).filter(entry => entry);
	shorts.forEach(a => entries.push([aliases[a] || a, true]));
	global.PARAMS = Object.fromEntries(entries);
}

exports.init = () => {
	if (PARAMS.dev && PARAMS.prod) {
		console.log('Production access is disabled with dev mode. Please use the testing DB instead.');
		process.exit(1);
	} else if (PARAMS.local && PARAMS.prod) {
		console.log('Production access conflicts with local mode. Please use only one of these flags.');
		process.exit(1);
	} else if (PARAMS.mongoless) PARAMS.userless = true; // mongoless is a superset!
	try {
		const file = fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf8');
		if (file) {
			const env = JSON.parse(file);
			for (const key in env) {
				if (process.env.hasOwnProperty(key)) continue; // don't override existing variables
				process.env[key] = env[key];
			}
		}
	} catch (e) {
		console.log(e.code === 'ENOENT' ? 'Unable to find credentials.json' : e);
	}
	if (!process.env.MONGO_TEST_URL && !process.env.MONGO_URL) {
		PARAMS.mongoless = PARAMS.userless = true;
		console.log('Operating in mongoless mode.');
	} else if (!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)) {
		PARAMS.userless = true;
		console.log('Operating in userless mode.');
	}
	if (!PARAMS.prod) process.env.MONGO_URL = process.env.MONGO_TEST_URL;
	if (PARAMS.local) process.env.MONGO_URL = 'mongodb://127.0.0.1/mask';
};
