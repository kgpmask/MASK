const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const session = require('express-session');
const fs = require('fs').promises;
const passport = require('passport');
const path = require('path');

const login = require('./login.js');

module.exports = function setMiddleware (app) {
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

		app.use((req, res, next) => {
			if (!['/git-hook', '/error'].includes(req.url)) {
				csrf()(req, res, next);
				res.locals.csrfToken = req.csrfToken();
				res.cookie('csrfToken', res.locals.csrfToken);
			} else next();
			// git-hook ignores CSRF
		});

		login.init();
	}

	// Pre-routing
	if (!PARAMS.userless) {
		app.get('/login/federated/google', passport.authenticate('google'));
		app.get('/oauth2/redirect/google', passport.authenticate('google', {
			successReturnToOrRedirect: '/',
			failureRedirect: '/login'
		}));
	}

	app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

	app.use((req, res, next) => {
		res.renderFile = (files, ctx) => {
			if (!Array.isArray(files)) files = [files];
			return res.render(path.join(__dirname, '../templates', ...files), ctx);
		};
		res.error = err => {
			res.status(400).send(err?.message || err);
		};
		res.notFound = (custom404, ctx) => {
			res.status(404).renderFile(custom404 || '404.njk', ctx);
		};
		res.tryFile = (path, asset, ctx) => {
			fs.access(path).then(err => {
				if (err) res.notFound(false, ctx);
				else res[asset ? 'sendFile' : 'render'](path, ctx);
			}).catch(() => {
				res.notFound(false, ctx);
			});
		};

		next();
	});

	app.use((req, res, next) => {
		res.locals.userless = PARAMS.userless;
		res.locals.mongoless = PARAMS.mongoless;
		res.locals.quizFlag = PARAMS.quiz;
		req.loggedIn = res.locals.loggedIn = Boolean(req.user);
		next();
	});
};
