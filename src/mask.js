if (!global.PARAMS) global.PARAMS = Object.fromEntries(process.argv.slice(2).map(arg => [arg, true]));
require('./env.js').init();


const childProcess = require('child_process');
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
const DB = require("../database/database.js");
const { PORT } = require('./config.js');
const appHandler = require('./handler.js');
const MongoStore = require('connect-mongo');

global.app = express();
if (!PARAMS.userless) DB.init();

const env = nunjucks.configure(path.join(__dirname, '../templates'), {
	express: app,
	noCache: PARAMS.dev
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!PARAMS.userless) {
	app.use(session({
		secret: process.env.SESSION_SECRET,
		resave: false, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
	}));
	app.use(passport.authenticate('session'));

	app.use(csrf());
	app.use((req, res, next) => {
		res.locals.csrfToken = req.csrfToken();
		next();
	});
}

appHandler(app, env);

const server = app.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});

const sass = childProcess.exec(`npx sass assets${PARAMS.dev ? ' --watch' : ''} --no-source-map --style compressed`);

exports.close = () => {
	server.close();
	sass.kill();
};
