const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const { LiveQuiz, LiveResult } = require('./schemas/LiveQuiz');
const Member = require('./schemas/Member');
const Newsletter = require('./schemas/Newsletter');
const Poll = require('./schemas/Poll');
const Post = require('./schemas/Post');

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
	if (!Object.keys(newsletter).every(e => e)) throw new Error('No newsletters on this date');
	return newsletter;
}

// Fetching posts based on type (art/video/newsletter)
function getPosts (postType) {
	// TODO: Make this accept a number of posts as a cap filter
	return Post.find(postType ? { type: postType } : {}).sort({ date: -1 });
}

async function getMembersbyYear (year) {
	const data = await Member.find({ 'records.year': year }).sort('name').lean();
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

async function getActivePolls () {
	const polls = await Poll.find({ endTime: { '$gt': new Date() } });
	// console.log(polls);
	return polls;
}

async function updatePoll (ctx) {
	// ctx = { pollId, userId, userChoice }
	const poll = await Poll.findById(ctx.pollId);
	// Yeet vote if exists
	poll.records.forEach(val => (ind = val.votes.findIndex(id => id === ctx.userId)) || val.votes.splice(ind, ind + 1 ? 1 : 0));
	if (!poll.records.find(val => val.value === ctx.userChoice)) poll.records.push({
		value: ctx.userChoice,
		votes: []
	});
	poll.records.find(val => val.value === ctx.userChoice).votes.push(ctx.userId);
	await poll.save();
	return true;
}

async function removeTeam (rollNumber, teamToRemove, year) {
	console.log(`roll number = ${rollNumber}`);
	const member = await Member.find({ "name": "Jai Sachdev" });
	console.log(member);
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
	getMembersbyYear,
	getActivePolls,
	updatePoll,
	removeTeam
};
