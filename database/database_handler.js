const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');

// Handle newly registered user or normal login
async function createNewUser (profile) {
	const user = await User.findById(profile.id);
	if (user) return user;
	const newUser = new User({ _id: profile.id, name: profile.displayName, picture: profile.photos[0].value });
	return newUser.save();
};

// Logout User
async function logoutUser (id) {
	return User.findById(id);
};

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
};

// User statistics
async function getUser (userId) {
	const user = await Quiz.findOne({ userId });
	if (user) return user;
	else return updateUserQuizRecord({ userId });
};


module.exports = { createNewUser, logoutUser, updateUserQuizRecord, getUser };
