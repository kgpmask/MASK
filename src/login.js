const GoogleStrategy = require('passport-google-oauth20');
const dbh = require('../database/database_handler');

passport.use(new GoogleStrategy({
	clientID: process.env['GOOGLE_CLIENT_ID'],
	clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
	callbackURL: (process.env['NODE_ENV'] === 'production' ? 'https://mask-kgp.club' : `http://localhost:${require('./config.js').PORT}`) + '/oauth2/redirect/google',
	scope: ['profile'],
	state: true
}, (_, __, profile, cb) => dbh.createNewUser(profile).then(res => cb(null, res)).catch(err => cb(err))));

passport.serializeUser((user, cb) => cb(null, user._id));
passport.deserializeUser((id, cb) => dbh.logoutUser(id).then(res => cb(null, res)).catch(err => cb(err, false)));