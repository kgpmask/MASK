const express = require('express');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/:yearName?', async (req, res) => {
	const sample = [
		{
			name: 'Ankan Saha',
			roll: '22EE10008',
			image: '../assets/members/22_ankan.webp',
			teams: [
				{
					name: 'Quiz',
					icon: 'quiz'
				},
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Fresher'
		}, {
			name: 'Jai Sachdev',
			roll: '22BT10011',
			image: '../assets/members/22_jai.webp',
			teams: [
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Fresher'
		}, {
			name: 'Karthikeya S M Yelisetty',
			roll: '21CS30060',
			image: '../assets/members/21_karthikeya.webp',
			teams: [
				{
					name: 'AMV & Music',
					icon: 'amv'
				},
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Former Member'
		}, {
			name: 'Nishkal Prakash',
			roll: '19CS91R05',
			image: '../assets/members/19_nishkal.webp',
			teams: [
				{
					name: 'Media & Newsletter',
					icon: 'newsletter'
				},
				{
					name: 'Quiz',
					icon: 'quiz'
				},
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Research Associate'
		}, {
			name: 'Parth Mane',
			roll: '19MF10022',
			image: '../assets/members/19_parth.webp',
			teams: [
				{
					name: 'AMV & Music',
					icon: 'amv'
				},
				{
					name: 'Media & Newsletter',
					icon: 'newsletter'
				},
				{
					name: 'Quiz',
					icon: 'quiz'
				},
				{
					name: 'WebDev',
					icon: 'webdev-head'
				}
			],
			position: 'Team Heads'
		}, {
			name: 'Saumyadip Nandy',
			roll: '20EC10072',
			image: '../assets/members/20_saumyadip.webp',
			teams: [
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Former Member'
		}, {
			name: 'Uday Srivastava',
			roll: '22ME30072',
			image: '../assets/members/22_uday.webp',
			teams: [
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Fresher'
		}, {
			name: 'Venkatsai Mokshith',
			roll: '21CS10050',
			image: '../assets/members/21_venkatsai.webp',
			teams: [
				{
					name: 'WebDev',
					icon: 'webdev'
				}
			],
			position: 'Associate'
		}, {
			name: 'Vidunram A R',
			roll: '21EE30033',
			image: '../assets/members/21_vidunram.webp',
			teams: [
				{
					name: 'Media & Newsletter',
					icon: 'newsletter'
				},
				{
					name: 'Quiz',
					icon: 'quiz'
				},
				{
					name: 'WebDev',
					icon: 'webdev-sub'
				}
			],
			position: 'Team Sub-Heads'
		}
	];
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
