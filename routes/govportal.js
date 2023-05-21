const express = require('express');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/govportal.njk`);
});

router.get('/post-management', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/post-management.njk`);
});

router.post('/post-management', async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!Object.values(data).some(e => e)) {
		return res.send("Empty Data");
	}
	data.date = new Date().toISOString();
	try {
		response = await dbh.addPost(data);
	} catch (e) {
		console.log(e);
		response = false;
	}
	console.log(response);
	return res.renderFile(`govportal/post-management.njk`);
});

module.exports = router;
