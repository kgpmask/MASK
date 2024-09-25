const router = require('express').Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');
const sample = require('../src/samples/members');

router.get('/:yearName?', async (req, res) => {
	const yearName = ~~(req.params.yearName?.slice(0, 4) ?? Object.keys(require('../src/teams.json')).sort().pop());
	const membersData = PARAMS.mongoless ? sample : await dbh.getMembersbyYear(yearName);
	const status = {
		'Governors': [],
		'Team Heads': [],
		'Team Sub-Heads': [],
		'Advisors': [],
		'Research Associate': [],
		'Executives': [],
		'Associates': [],
		'Freshers': [],
		'Former Members': []
	};
	membersData.forEach(member => {
		try {
			status[member.position].push(member);
		} catch {
			status[member.position + 's'].push(member);
		}
	});
	const membersObj = Object.entries(status);
	const membersTitle = `Members: ${yearName}-${yearName % 100 + 1}`;
	return res.renderFile('members.njk', {
		membersObj,
		membersTitle,
		prev: yearName - 1 >= 2020 && !PARAMS.mongoless ? `${yearName - 1}-${yearName % 100}` : undefined,
		next: yearName + 1 <= 2024 && !PARAMS.mongoless ? `${yearName + 1}-${yearName % 100 + 2}` : undefined
	});
});

module.exports = {
	route: '/members',
	router
};
