const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const session = require('express-session');
const fs = require('fs').promises;
const nunjucks = require('nunjucks');
global.passport = require('passport');
const path = require('path');
global.Tools = require('./tools.js');
const webpush = require('web-push');
global.MongoConfig = require('./config.js').MongoConfig;
const database = require("../database/database.js");
const { PORT, DEBUG } = require('./config.js');
const appHandler = require('./handler.js');
const MongoStore = require('connect-mongo');

global.app = express();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: 'SaegusaMayumi',
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	store: MongoStore.create({ mongoUrl: `mongodb://${MongoConfig.host}:${MongoConfig.port}/${MongoConfig.db}` })
}));
app.use(csrf());
app.use(passport.authenticate('session'));
app.use(function (req, res, next) {
	const msgs = req.session.messages || [];
	res.locals.messages = msgs;
	res.locals.hasMessages = !!msgs.length;
	req.session.messages = [];
	next();
});
app.use(function (req, res, next) {
	res.locals.csrfToken = req.csrfToken();
	next();
});

appHandler(app, env, vapid);

const server = app.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});

module.exports = server;