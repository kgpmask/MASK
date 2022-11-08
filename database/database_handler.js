const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const Questions = require('./schemas/Questions');
const { LiveQuiz, LiveResult } = require('./schemas/LiveQuiz');

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
	const user = await Quiz.findOne({ userId: stats.userId });
	const record = user || new Quiz({ userId: stats.userId, points: 0, quizData: {} });
	if (!record.quizData) record.quizData = {};
	const key = stats.quizId;
	if (!key) return record.save();
	if (record[key]) return record;
	record.points += stats.score;
	record.quizData[key] = { score: stats.score, time: stats.time };
	return record.save();
}

// User statistics
async function getUserStats (userId) {
	const user = await Quiz.findOne({ userId });
	if (user) return user;
	else return updateUserQuizRecord({ userId });
}

function getQuizzes () {
	return Questions.find().lean();
}

async function getLiveQuiz () {
	const date = new Date().toISOString().slice(0, 10);
	const quiz = await LiveQuiz.findOne({ title: date });
	if (quiz) return quiz.lean();
}

async function getLiveResult () {
	const date = new Date().toISOString().slice(0, 10);
	const results = await LiveResult.findOne({ title: date });
	return results;
}

async function updateLiveResult (currentQ, userId, points) {
	const date = new Date().toISOString().slice(0, 10);
	let results = await LiveResult.findOne({ title: date });
	if (!results) results = new LiveResult({
		title: date,
		result: []
	});
	if (!results.result[currentQ]) results.result[currentQ] = [];
	results.result[currentQ].push({ id: userId, points });
	results.save();
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
	updateLiveResult
};
