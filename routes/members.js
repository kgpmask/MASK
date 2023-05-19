const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/:yearName?', async (req, res) => {
	const sample = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/samples/members.json"), 'utf8'));

	const yearName = parseInt(req.params.yearName) || 2022;
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
	const membersTitle = 'Our Members';
	return res.renderFile('members.njk', {
		membersObj,
		membersTitle,
		prev: yearName - 1 >= 2020 && !PARAMS.mongoless ? `${yearName - 1}-${yearName % 100}` : undefined,
		next: yearName + 1 <= 2022 && !PARAMS.mongoless ? `${yearName + 1}-${yearName % 100 + 2}` : undefined
	});
});

module.exports = router;
