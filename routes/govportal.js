const express = require('express');
const router = express.Router();

router.get(['/', '/:action'], (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`);
});

router.post('/post', (req, res) => {
	// if (!req.loggedIn) return res.renderFile('/');
	console.log(req.body);
});

module.exports = router;
