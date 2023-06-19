const express = require("express");
const router = express.Router();
const axios = require('axios');

const dbh = PARAMS.mongoless ? {} : require("../database/handler");

router.use((req, res, next) => {
	if (PARAMS.userless) return res.notFound('404.njk', {
		message: 'Sorry. This is currently not available in mongoless and userless mode.'
	});

	if (!req.loggedIn) return res.redirect('/login');
	// if (!req.user.permissions.find(perm => perm === 'governor')) return res.status(403).renderFile('404.njk', {
	// 	message: 'Access denied. You do not have the required permission.'
	// });

	next();
});

router.get('/', (req, res) => {
	return res.renderFile(`govportal/govportal.njk`);
});

router.get('/add-post', (req, res) => {
	return res.renderFile(`govportal/add-post.njk`);
});
router.get('/post-management', async (req, res) => {
	const posts = (await dbh.getPosts().limit(20)).map(post => post.toObject());
	return res.renderFile(`govportal/post-management.njk`, { posts });
});
router.get('/edit-post/:id', async (req, res) => {
	const id = req.params.id;
	const data = (await dbh.getPost(id)).toObject();
	return res.renderFile(`govportal/edit-post.njk`, { ...data, date: data.date.toISOString().slice(0, 10) });
});


router.get('/add-poll', (req, res) => {
	const date = new Date();
	date.setDate(date.getDate() + 7);
	return res.renderFile(`govportal/add-poll.njk`, { date: date.toISOString().slice(0, 10) });
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
	const currentMembers = await dbh.getCurrentMembers();
	currentMembers.sort((a, b) => -(hierarchy.indexOf(a.position) < hierarchy.indexOf(b.position))).forEach(member => {
		member.teams = member.teams.map(team => team.name);
	});
	return res.renderFile('/govportal/member-management.njk', {
		currentMembers,
		teams: Object.values(teamsData[years[years.length - 1]])
	});
});

router.post('/add-post', async (req, res) => {
	const data = req.body.data;
	if (!data.name || !data.link || !data.attr[0] && ['youtube', 'instagram'].includes(data.type)) {
		return res.send({ success: false, message: "Empty Data Provided" });
	}
	data.date = new Date().toISOString();
	try {
		response = await dbh.addPost(data);
		// console.log(response);
		return res.send({ success: true, message: "Successfully Added Post", response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: "Something Went Wrong" });
	}
});

router.post('/add-poll', async (req, res) => {
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
router.post('/post-management', async (req, res) => {
	const data = req.body.data;
	let response;
	try {
		response = await dbh.deletePost(data);
		// console.log(response)
		return res.send({ success: true, message: "Successfully deleted post", response: response });
	} catch (e) {
		return res.send({ success: false, message: "Something Went Wrong" });
	}
});

router.patch('/edit-post', async (req, res) => {
	const data = req.body.data;
	// console.log("update",data)
	try {
		response = await dbh.editPost(data);
		// console.log(response);
		return res.send({ success: true, message: "Successfully Edited Post", response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: "Something Went Wrong" });
	}
});

module.exports = router;
