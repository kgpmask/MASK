const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	if (req.loggedIn) return res.redirect('/');
	res.renderFile('login.njk');
});

module.exports = router;
