const express = require('express');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/govportal.njk`);
});

router.get('/add-post', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/add-post.njk`);
});

router.post('/add-post', async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!Object.values(data).some(e => e)) {
		return res.send("Empty Data");
	}
	data.date = new Date().toISOString();
	const response = await dbh.addPost(data);
	return res.send(response);
});

module.exports = router;
