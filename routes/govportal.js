const express = require('express');
const { getMembersbyYear } = require('../database/handler');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get(['/', '/:action'], async (req, res) => {
	// if (!req.loggedIn) return res.redirect('/login');

	if (req.params.action === 'member-management') {
		const teamsData = require('../src/teams.json');
		const years = Object.keys(teamsData);
		const currentMembers = await dbh.getMembersbyYear(Number(years[years.length - 1]));
		console.log(currentMembers[1].teams);
		res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`, { currentMembers });
	} else {
		res.renderFile(`govportal/${req.params.action ? req.params.action : 'govportal'}.njk`);
	}
});

module.exports = router;
