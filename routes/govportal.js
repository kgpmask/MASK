const express = require("express");
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require("../database/handler");

// Todo: Add a middleware which throws an error when permissions are missing.
// Basically, an app.use checking for user perms

router.get('/', (req, res) => {
	return res.renderFile('govportal/govportal.njk');
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

router.get("/image-upload", (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/image-upload.njk`);
});

router.get("/add-post", (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	return res.renderFile(`govportal/add-post.njk`);
});

router.post("/add-post", async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/');
	const data = req.body.data;
	if (!Object.values(data).some((e) => e)) {
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

module.exports = router;
