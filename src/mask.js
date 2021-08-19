const express = require('express');
const fs = require('fs').promises;
const nunjucks = require('nunjucks');
const path = require('path');
const webpush = require('web-push');

const { PORT, DEBUG } = require('./config.js');
const appHandler = require('./handler.js');

global.app = express();

let vapid;

try {
	vapid = require('./vapid.json');
} catch (e) {
	console.log('Unable to find VAPID keys. Generating a new pair...');
	vapid = webpush.generateVAPIDKeys();
	console.log(`Generated VAPID keys [${Object.values(vapid).join(', ')}]`);
	fs.writeFile(path.join(__dirname, 'src/vapid.json'), JSON.stringify(vapid)).then(() => {
		console.log('Stored new VAPID keys.');
		if (process.argv[2] === 'workflow') process.exit();
	});
}

const env = nunjucks.configure('templates', {
	express: app,
	noCache: DEBUG
});

appHandler(app, env, vapid);

const server = app.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});

module.exports = server;