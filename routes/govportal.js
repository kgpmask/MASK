const express = require('express');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

// Todo: Add a middleware which throws an error when permissions are missing.
// Basically, an app.use checking for user perms

router.get('/', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/govportal.njk`);
});

router.get('/add-post', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/add-post.njk`);
});

router.get('/add-poll', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	const now = new Date();
	date = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
	return res.renderFile(`govportal/add-poll.njk`, { date: date });
});

router.post('/add-post', async (req, res) => {
	await new Promise(r => r());
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!Object.values(data).some(e => e)) {
		return res.send("Empty Data");
	}
	data.date = new Date().toISOString();
	try {
		response = await dbh.addPost(data);
	} catch (e) {
		response = false;
	}
	return res.send(response);
});

router.post('/add-poll', async (req, res) => {
	await new Promise(r => r());
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!data.title || !data.records.length) return res.send({ success: false, message: "Empty Data Provided" });
	data.endTime = new Date(data.endTime).toISOString();
	const now = new Date();
	if (!(now < new Date(data.endTime))) return res.send({ success: false, message: "Invalid End Date" });
	try {
		data._id = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + (dbh.getMonthlyPolls().length + 1);
		console.log(data);
		response = await dbh.addPoll(data);
		return res.send({ success: true, message: "Successfully Added Poll", response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: "Something Went Wrong" });
	}
});

module.exports = router;
