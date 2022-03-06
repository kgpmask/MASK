const GoogleStrategy = require('passport-google-oauth20');
const dbh = require('../database/database_handler');
// Configure the login strategy
passport.use(new GoogleStrategy({
	clientID: process.env['GOOGLE_CLIENT_ID'],
	clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
	callbackURL: '/oauth2/redirect/google',
	scope: ['profile'],
	state: true
}, function (accessToken, refreshToken, profile, cb) {
	dbh.createNewUser(profile).then(userResponse => {
		cb(null, userResponse);
	}).catch(userErr => {
		cb(userErr);
	});
}));

// Login
passport.serializeUser(function (user, cb) {
	cb(null, user._id);
});
// Logout
passport.deserializeUser(function (id, cb) {
	dbh.logoutUser(id).then(userRes => {
		cb(null, userRes);
	}).catch(userErr => {
		cb(userErr, false);
	});
});