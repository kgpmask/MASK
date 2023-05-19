const express = require('express');
const router = express.Router();
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

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

	res.renderFile('/govportal/member-management.njk', { currentMembers, teams: Object.values(teamsData[years[years.length - 1]]) });
});

router.get('/', (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');
	res.renderFile('/govportal/govportal.njk');
});

router.get('/image-upload', (req, res) => {
	res.renderFile('/govportal/image-upload.njk');
});

module.exports = router;
