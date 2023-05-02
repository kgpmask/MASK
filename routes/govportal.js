const express = require('express');
const router = express.Router();

router.get(['/', '/:action'], (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`);
});

module.exports = router;
