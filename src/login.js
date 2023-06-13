const passport = require('passport');

exports.init = () => {
	const GoogleStrategy = require('passport-google-oauth20');
	const dbh = require('../database/handler');

	const port = process.env.PORT ?? 6969;
	const fallbackUrl = process.env.NODE_ENV === 'production' ? 'https://kgpmask.club' : `http://localhost:${port}`;
	const callbackURL = process.env.SITE_URL || fallbackUrl;
	console.log(callbackURL);
	passport.use(new GoogleStrategy({
		clientID: process.env['GOOGLE_CLIENT_ID'],
		clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
		callbackURL: callbackURL + '/oauth2/redirect/google',
		scope: ['profile'],
		state: true
	}, (_, __, profile, cb) => dbh.createNewUser(profile).then(res => cb(null, res)).catch(err => cb(err))));

	passport.serializeUser((user, cb) => cb(null, user._id));
	passport.deserializeUser((id, cb) => dbh.getUser(id).then(res => cb(null, res)).catch(err => cb(err, false)));
};
