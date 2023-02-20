const express = require("express");
const router = express.Router();

router.get('/:yearName?', (req, res) => {
	const membersData = require('../src/members.json');
	const yearName = req.params.yearName || membersData[0].name;
	const yearIndex = membersData.findIndex(year => [year.name, year.baseYear].includes(yearName));
	if (yearIndex === -1) return res.notFound();
	const {
		name,
		baseYear,
		teams,
		members
	} = membersData[yearIndex];
	const ctx = { 'Governors': [], 'Former Members': [], 'Research Associate': [] };
	members.sort((a, b) => -(a.name < b.name)).forEach(member => {
		let target;
		if (member.gov) target = 'Governors';
		else if (member.inactive) target = 'Former Members';
		else if (member.RA) target = 'Research Associate';
		else target = `Batch of 20${member.roll.substr(0, 2)}`;
		if (!ctx[target]) ctx[target] = [];
		ctx[target].push({
			name: member.name,
			roll: member.roll,
			href: member.id.startsWith('X') ? 'blank.webp' : `${member.id}.webp`,
			teams: member.teams.map(teamID => {
				const team = teams[teamID.toLowerCase()];
				if (teamID === teamID.toUpperCase()) return { name: team.name, icon: team.icon + '-head' };
				return team;
			})
		});
	});
	const prev = membersData[yearIndex + 1]?.name, next = membersData[yearIndex - 1]?.name;
	const keys = [
		'Governors',
		'Research Associate',
		...Object.keys(ctx).filter(key => key.startsWith('Batch of ')).sort(),
		'Former Members'
	];
	const membersObj = Object.fromEntries(keys.map(key => [key, ctx[key]]));
	const membersTitle = name === membersData[0].name ? 'Our Members' : name;
	return res.renderFile('members.njk', { members: membersObj, membersTitle, prev, next });
});

module.exports = router;
