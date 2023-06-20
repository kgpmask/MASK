const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
	if (req.loggedIn) return res.redirect('/');
	return res.renderFile('login.njk');
});

router.get('/logout', (req, res) => {
	if (!req.loggedIn) return res.redirect('/login');
	return req.logout(() => res.redirect('/'));
});

module.exports = router;
