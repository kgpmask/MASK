const express = require("express");
const router = express.Router();

router.use('/', (req, res) => {
	const url = req.url.replace(/^.*?\/blog/, '');
	// TODO: Fix this!
	return res.redirect(`https://maskiitkgp.blogspot.com${url}.html`);
});

module.exports = router;
