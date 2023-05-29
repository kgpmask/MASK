const express = require("express");
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require("../database/handler");


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
	const date = new Date();
	date.setDate(date.getDate() + 7);
	return res.renderFile(`govportal/add-poll.njk`, { date: date });
});

router.get('/member-management', async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	const hierarchy = [
		'Governor',
		'Team Heads',
		'Executives',
		'Research Associate',
		'Team Sub-Heads',
		'Associate',
		'Fresher',
		'Former Member'
	];

	const teamsData = require('../src/teams.json');
	const years = Object.keys(teamsData);
	const currentMembers = await dbh.getCurrentMembers();
	currentMembers.sort((a, b) => -(hierarchy.indexOf(a.position) < hierarchy.indexOf(b.position))).forEach(member => {
		member.teams = member.teams.map(team => team.name);
	});
	// dbh.removeTeam("22BT10011", "WebDev", 2022);
	return res.renderFile('/govportal/member-management.njk', {
		currentMembers,
		teams: Object.values(teamsData[years[years.length - 1]])
	});
});

router.get("/image-upload", (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/image-upload.njk`);
});

router.post('/add-post', async (req, res) => {
	await new Promise(r => r());
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!data.name || !data.link || !data.attr[0] && ['youtube', 'instagram'].includes(data.type)) {
		return res.send({ success: false, message: "Empty Data Provided" });
	}
	data.date = new Date().toISOString();
	try {
		response = await dbh.addPost(data);
		return res.send({ success: true, message: "Successfully Added Post", response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: "Something Went Wrong" });
	}
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
		data._id = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ((await dbh.getMonthlyPolls()).length + 1);
		console.log(data);
		response = await dbh.addPoll(data);
		return res.send({ success: true, message: "Successfully Added Poll", response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: "Something Went Wrong" });
	}
});

router.post('/member-management', async (req, res) => {
	const data = req.body.data;
	// console.log(data);
	let response;
	switch (data.functionType) {
		case 'removeTeam':
			response = await dbh.removeTeam(data.roll, data.team);
			break;
		case 'addTeam':
			response = await dbh.addTeam(data.roll, data.team);
			break;
		case 'export':
			console.log(data);
			response = await dbh.exportToNextYear();
			break;
	}
	return res.send(response);
});

module.exports = router;
