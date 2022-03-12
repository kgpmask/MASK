const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');

// Handle newly registered user or normal login
exports.createNewUser = function createNewUser (profile) {
	return new Promise((resolve, reject) => {
		User.find({ userId: profile.id }).exec((err, existing_users) => {
			if (err) reject(err);
			if (existing_users.length) resolve(existing_users[0]);
			else {
				const new_user = new User({ userId: profile.id, name: profile.displayName, picture: profile.photos[0].value });
				new_user.save(err => err ? reject(err) : resolve(new_user));
			}
		});
	});
};

// Logout User
exports.logoutUser = function logoutUser (id) {
	return new Promise((resolve, reject) => User.findById(id).exec((err, user) => err ? reject(err) : resolve(user)));
};

// Add new record to database, uses put
exports.updateUserQuizRecord = function updateUserQuizRecord (stats) { // {userId, quizId, time, score}
	return new Promise((resolve, reject) => {
		Quiz.find({ userId: stats.userId }).exec((err, existing_users) => {
			if (err) reject(err);
			const record = existing_users[0] || new Quiz({ userId: stats.userId, points: 0, quizData: {} });
			if (!record.quizData) record.quizData = {};
			const key = stats.quizId;
			if (!key) return record.save(err => err ? reject(err) : resolve(record));
			if (record[key]) return resolve(record);
			record.points += stats.score;
			record.quizData[key] = { score: stats.score, time: stats.time };
			record.save(err => err ? reject(err) : resolve(record));
		});
	});
};

// User statistics
exports.getUser = function getUser (userId) {
	return new Promise((resolve, reject) => {
		Quiz.find({ userId }).exec((err, existing_users) => {
			if (err) reject(err);
			if (!existing_users.length) exports.updateUserQuizRecord({ userId }).then(u => resolve(u));
			else resolve(existing_users[0]);
		});
	});
};