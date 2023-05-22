const express = require('express');
const { removeTeam } = require('../database/handler');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', (req, res) => {
	return res.renderFile('govportal/govportal.njk');
});

router.get('/member-management', async (req, res) => {
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
	const currentMembers = await dbh.getMembersbyYear(Number(years[years.length - 1]));

	currentMembers.sort((a, b) => -(hierarchy.indexOf(a.position) < hierarchy.indexOf(b.position))).forEach(member => {
		member.teams = member.teams.map(team => team.name);
	});

	dbh.removeTeam("18IE10025", "WebDev");
	res.renderFile('/govportal/member-management.njk', {
		currentMembers,
		teams: Object.values(teamsData[years[years.length - 1]])
	});
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
	try {
		response = await dbh.addPost(data);
	} catch (e) {
		response = false;
	}
	return res.send(response);
});


module.exports = router;
