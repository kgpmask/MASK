const express = require('express');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get(['/', '/:action'], (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`);
});

router.post('/post', async (req, res) => {
	// if (!req.loggedIn) return res.renderFile('/');
	const data = req.body.data;
	if (!Object.values(data).some(e => e)) {
		return res.send("Empty Data");
	}
	const response = await dbh.addPost(data);
	return res.send(response);
});

module.exports = router;
