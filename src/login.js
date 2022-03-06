// https://github.com/jaredhanson/passport-google-oauth2
// https://github.com/passport/todos-express-google/blob/main/routes/auth.js
const GoogleStrategy = require('passport-google-oauth20');
const dbh = require('../database/database_handler');
// Configure the login strategy
// profile: id, displayName, name = {familyName, givenName}, emails = [{value, varified}], photos = [{value: json.picture}]
passport.use(new GoogleStrategy({
	clientID: process.env['GOOGLE_CLIENT_ID'],
	clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
	callbackURL: '/oauth2/redirect/google',
	scope: [ 'profile' ],
	state: true
},
function (accessToken, refreshToken, profile, cb) {
	console.log(accessToken, refreshToken, profile, cb, '^^^^^');
	dbh.createNewUser(profile).then((userResponse) => {
		cb(null, userResponse);
	}).catch((userErr) => {
		cb(userErr);
	});
}));

// Login
passport.serializeUser(function(user, cb) {
	cb(null, user._id);
});
// Logout
passport.deserializeUser(function(id, cb) {
	dbh.logoutUser(id).then((userRes) => {
		cb(null, userRes);
	}).catch((userErr) => {
		cb(userErr, false);
	});
});