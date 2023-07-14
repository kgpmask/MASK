const router = require('express').Router();

router.get('/login', (req, res) => {
	if (req.loggedIn) return res.redirect('/');
	return res.renderFile('login.njk');
});

router.get('/logout', (req, res) => {
	if (!req.loggedIn) return res.loginRedirect(req, res);
	return req.logout(() => res.redirect('/'));
});

router.get('/logged-in', (req, res) => {
	const redirectRoute = req.cookies?.redirect?.path ?? '/';
	if (req.cookies.redirect) res.clearCookie('redirect');
	return res.redirect(redirectRoute);
});

module.exports = {
	route: '/',
	router
};
