const express = require('express');
const fs = require('fs').promises;
const nunjucks = require('nunjucks');
const path = require('path');
const tools = require('./tools.js');
const webpush = require('web-push');
const database = require("../database/database.js");
const { PORT, DEBUG } = require('./config.js');
const appHandler = require('./handler.js');

global.app = express();
app.use(express.json());

let vapid;

try {
	vapid = require('./vapid.json');
	if (process.argv[2] === 'workflow') process.exit();
} catch (e) {
	console.log('Unable to find VAPID keys. Generating a new pair...');
	vapid = webpush.generateVAPIDKeys();
	console.log(`Generated VAPID keys [${Object.values(vapid).join(', ')}]`);
	fs.writeFile(path.join(__dirname, 'vapid.json'), JSON.stringify(vapid)).then(() => {
		console.log('Stored new VAPID keys.');
		if (process.argv[2] === 'workflow') process.exit();
	});
}

const env = nunjucks.configure(path.join(__dirname, '../templates'), {
	express: app,
	noCache: DEBUG
});

appHandler(app, env, vapid);

const server = app.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});

module.exports = server;