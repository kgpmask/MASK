const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const { LiveQuiz, LiveResult } = require('./schemas/LiveQuiz');
const Member = require('./schemas/Member');
const Newsletter = require('./schemas/Newsletter');
const Poll = require('./schemas/Poll');
const Post = require('./schemas/Post');
const Submission = require('./schemas/Submission');
const NewsletterCount = require('./schemas/NewsletterCount');

// Handle newly registered user or normal login
async function createNewUser (profile) {
	const user = await User.findById(profile.id);
	if (user) return user;
	const newUser = new User({
		_id: profile.id,
		name: profile.displayName,
		picture: profile.photos[0].value,
		permissions: []
	});
	return newUser.save();
}

// Get User
async function getUser (id) {
	return User.findById(id);
}

function getAllUsers (id) {
	return User.find().lean();
}

// Add new record to database
async function updateUserQuizRecord (stats) { // {userId, quizId, time, score}
	const user = await Quiz.UserInfo.findOne({ userId: stats.userId });
	const userName = (await getUser(stats.userId)).name;
	const record = user || new Quiz.UserInfo({ userId: stats.userId, userName, points: 0, quizData: [] });
	if (!record.quizData) record.quizData = [];
	const key = stats.quizId;
	if (!key) return record.save();
	if (record.quizData.find(elm => elm.quizId === key)) return record;
	else {
		record.quizData.push({
			quizId: key,
			points: stats.score,
			time: stats.time
		});
		record.points += stats.score;
	}
	return record.save();
}

// User statistics
async function getUserStats (userId) {
	const user = await Quiz.UserInfo.findOne({ userId });
	if (user) return user;
	else return updateUserQuizRecord({ userId });
}

function getQuizzes () {
	return Quiz.Questions.find().lean();
}

async function getLiveQuiz (query) {
	// TODO: Use IDs as a parameter properly
	const date = query || new Date().toISOString().slice(0, 10);
	// The first live quiz
	const quiz = await LiveQuiz.findOne({ title: date });
	if (quiz) return quiz.toObject();
}

async function getLiveResult (userId, quizId, currentQ) {
	const res = await LiveResult.findOne({ userId, quizId, question: currentQ });
	if (res) return res.toObject();
}

async function getAllLiveResults (quizId) {
	const res = await LiveResult.find({ quizId }).lean();
	return res;
}

async function addLiveResult (userId, quizId, currentQ, points, answer, timeLeft, result) {
	const user = await getUser(userId);
	const results = new LiveResult({
		userId,
		username: user.name,
		quizId,
		question: currentQ,
		points,
		answer,
		timeLeft,
		result
	});
	await results.save();
	return results.toObject();
}

// Fetch newsletter solutions
async function getNewsletter (date) {
	const newsletter = await Newsletter.findById(date);
	if (!Object.keys(newsletter ?? {})?.some(e => e)) throw new Error('No newsletters on this date');
	return newsletter;
}

// Fetching posts based on type (art/video/newsletter)
function getPosts (postType) {
	// TODO: Make this accept a number of posts as a cap filter
	return Post.find(postType ? { type: postType } : {}).sort({ date: -1 });
}
async function getPost (id) {
	return Post.findById(id);
}
async function deletePost (link) {
	const postDeleted = Post.findOneAndDelete({ 'link': link });
	return postDeleted;
}
async function editPost (data) {
	const updatedPost = Post.findOneAndUpdate({ '_id': data.id }, {
		'name': data.name,
		'link': data.link,
		'type': data.type,
		'attr': data.attr,
		'date': data.date
	}, {
		new: true
	});
	// console.log(updatedPost);
	return updatedPost;
}

async function addPost (data) {
	if (data.page === '') delete data.page;
	const post = new Post(data);
	await post.save();
	return post.toObject();
}

async function getPolls () {
	return Poll.find().lean().sort({ _id: -1 });
}

async function getPoll (id) {
	return Poll.findById(id);
}

async function addPoll (data) {
	const poll = new Poll(data);
	await poll.save();
	return poll.toObject();
}

async function deletePoll (id) {
	const postDeleted = Poll.findOneAndDelete({ '_id': id });
	return postDeleted;
}

async function deletePollOption (data) {
	const poll = await Poll.findById(data.pollId);
	const indexToDelete = poll.records.findIndex(record => record._id.toString() === data.optionId);
	if (indexToDelete !== -1) {
		poll.records.splice(indexToDelete, 1);
	}
	const updatedPoll = await poll.save();
	return updatedPoll;
}

async function editPoll (data) {
	const poll = await Poll.findById(data.id);
	console.log('hehe', poll);
	poll.title = data.title;
	poll.endTime = data.endTime;
	poll.addOption = data.addOption;
	for (let i = 0; i < poll.records.length; i++) {
		poll.records[i].value = data.records[i].value;
	}
	for (let i = poll.records.length; i < data.records.length; i++) {
		poll.records.push(data.records[i]);
	}
	const updatedPoll = await poll.save();
	return updatedPoll;
}


async function getActivePolls () {
	const polls = await Poll.find({ endTime: { '$gt': new Date() } });
	// console.log(polls);
	return polls;
}

async function getMonthlyPolls (month) {
	const date = new Date();
	const polls = await Poll.find(
		{
			'_id': {
				'$regex': `${date.getFullYear() + '-' + ('0' + (month ? month : date.getMonth() + 1)).slice(-2) + '-'}`,
				'$options': 'i'
			}
		}
	).lean();
	return polls;
}

async function updatePoll (ctx) {
	// ctx = { pollId, userId, userChoice }
	const poll = await Poll.findById(ctx.pollId);
	// Yeet vote if exists
	poll.records.forEach(record => {
		record.votes = record.votes.filter(id => id !== ctx.userId);
	});
	if (!poll.records.find(val => val.value === ctx.userChoice)) poll.records.push({
		value: ctx.userChoice,
		votes: []
	});
	poll.records.find(val => val.value === ctx.userChoice).votes.push(ctx.userId);
	await poll.save();
	return true;
}

async function getMembersbyYear (year) {
	const data = await Member.find({ 'records.year': ~~year }).sort('name').lean();
	const yearData = [];
	const teamsData = require('../src/teams.json');
	data.forEach(member => {
		const rec = member.records.find(rec => rec.year === year);
		let pos;
		yearData.push({
			name: member.name,
			roll: member.roll,
			image: '../assets/members/' + member.image,
			teams: rec.teams.map(teamID => {
				const team = {
					name: teamsData[year][teamID[0]].name,
					icon: teamsData[year][teamID[0]].icon
				};
				team.icon += teamID[1] === 'H' ? !(pos = 'H') || '-head' : teamID[1] === 'S' ? !(pos = 'S') || '-sub' : '';
				return team;
			}),
			position: pos ? rec.position === 'Governor' ? rec.position : pos === 'H' ? 'Team Heads' : 'Team Sub-Heads' : rec.position
		});
	});
	return yearData;
}

async function getCurrentMembers () {
	const yearData = [];
	const teamsData = require('../src/teams.json');
	const years = Object.keys(teamsData);
	const year = Number(years[years.length - 1]);
	const data = await Member.find({ 'records.year': year }).sort('name');
	data.forEach(member => {
		const rec = member.records.find(rec => rec.year === year);
		let pos;
		yearData.push({
			_id: member._id,
			name: member.name,
			roll: member.roll,
			image: '../assets/members/' + member.image,
			teams: rec.teams.map(teamID => {
				const team = {
					name: teamsData[year][teamID[0]].name,
					icon: teamsData[year][teamID[0]].icon
				};
				team.icon += teamID[1] === 'H' ? !(pos = 'H') || '-head' : teamID[1] === 'S' ? !(pos = 'S') || '-sub' : '';
				return team;
			}),
			position: pos ? rec.position === 'Governor' ? rec.position : pos === 'H' ? 'Team Heads' : 'Team Sub-Heads' : rec.position
		});
	});
	return yearData;
}

// remove a member from a team
async function removeTeam (rollNumber, teamToRemove) {
	// console.log(rollNumber.trim());
	const memberToUpdate = await Member.findOne({ 'roll': rollNumber.trim() });
	// console.log('membertoupdate' + memberToUpdate);
	// console.log(memberToUpdate.records);
	const yearIndex = memberToUpdate.records.length - 1;
	memberToUpdate.records[yearIndex].teams = memberToUpdate.records[yearIndex].teams.filter(function (team) {
		return team !== teamToRemove;
	});
	// console.log("NEWRmemberToUpdate.records);
	await Member.updateOne({ 'roll': memberToUpdate.roll }, { 'records': memberToUpdate.records });
}

// add a member to a team
async function addTeam (rollNumber, teamToAdd) {
	// console.log(rollNumber.trim());
	const memberToUpdate = await Member.findOne({ 'roll': rollNumber.trim() });
	// console.log(memberToUpdate.records);
	const yearIndex = memberToUpdate.records.length - 1;
	memberToUpdate.records[yearIndex].teams.push(teamToAdd);
	// console.log(memberToUpdate.records);
	await Member.updateOne({ 'roll': memberToUpdate.roll }, { 'records': memberToUpdate.records });
}

// export current year's data to the next year
async function exportToNextYear () {
	const members = await Member.find().exec();
	let newRecord;
	const teamsData = require('../src/teams.json');
	const years = Object.keys(teamsData);
	const thisYear = Number(years[years.length - 1]);

	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		if (member.records[member.records.length - 1].year !== thisYear) continue;
		const currentRecord = member.records[member.records.length - 1];
		switch (currentRecord.position) {
			case 'Fresher':
				newRecord = {
					'year': currentRecord.year + 1,
					'position': 'Associate',
					'teams': currentRecord.teams
				};
				member.records.push(newRecord);
				await Member.updateOne({ 'roll': member.roll }, { 'records': member.records });
				break;

			case 'Associate':
				console.log(member.records);
				newRecord = {
					'year': currentRecord.year + 1,
					'position': 'Executive',
					'teams': currentRecord.teams.map(function (team) {
						if (team.length === 1) {
							return team;
						} else {
							const newTeam = team[0] + 'H';
							return newTeam;
						}
					})
				};
				member.records.push(newRecord);
				await Member.updateOne({ 'roll': member.roll }, { 'records': member.records });
				break;
		}
	}
}

async function addSubmission (ctx) {
	const idPrefix = `${new Date().toISOString().slice(0, 8)}`;
	const _id = `${idPrefix}${(await Submission.find({ _id: { '$regex': '^' + idPrefix } })).length + 1}`;
	const submission = new Submission({
		...ctx,
		_id
	});
	return submission.save();
}

async function updateNewsletterCount (target) {
	const newsletterCount = await NewsletterCount.findById(target) || new NewsletterCount({
		_id: target,
		count: 0
	});
	newsletterCount.count = newsletterCount.count + 1;
	return await newsletterCount.save();
}

async function getNewsletterCount () {
	const newsletterCounts = await NewsletterCount.find();
	return newsletterCounts;
}

async function getSubmissions () {
	return await Submission.find().lean();
}

module.exports = {
	createNewUser,
	getUser,
	getAllUsers,
	updateUserQuizRecord,
	getQuizzes,
	getUserStats,
	getLiveQuiz,
	getLiveResult,
	getAllLiveResults,
	addLiveResult,
	getNewsletter,
	getPosts,
	getPost,
	deletePost,
	editPost,
	addPost,
	getPoll,
	getPolls,
	addPoll,
	deletePoll,
	deletePollOption,
	editPoll,
	getMembersbyYear,
	getActivePolls,
	getMonthlyPolls,
	updatePoll,
	removeTeam,
	getCurrentMembers,
	exportToNextYear,
	addTeam,
	addSubmission,
	updateNewsletterCount,
	getNewsletterCount
};
