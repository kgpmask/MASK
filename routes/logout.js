const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	if (!req.loggedIn) return res.redirect('/login');
	return req.logout(() => res.redirect('/'));
});

module.exports = router;
