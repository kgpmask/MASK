const express = require('express');
const { getMembersbyYear } = require('../database/handler');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get(['/', '/:action'], async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');

	if (req.params.action === 'member-management') {
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
		currentMembers
			.sort((a, b) => -(hierarchy.indexOf(a.position) < hierarchy.indexOf(b.position)))
			.forEach(member => {
				member.teams = member.teams.map(team => team.name);
			});
		console.log(currentMembers[currentMembers.length - 3]);
		res.renderFile(`govportal/member-management.njk`, {
			currentMembers,
			teams: Object.values(teamsData[years[years.length - 1]])
		});
	} else {
		res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`);
	}
});

module.exports = router;
