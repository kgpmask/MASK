const mongoose = require('mongoose');
const User = require('./User');

const userQuizDataSchema = new mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User.User'},
	userPoints: [Number],
	quizData : mongoose.Schema.Types.Mixed	// {quizId(String) : {score: Number, time: Number}}
});

// module.exports = mongoose.model('Quiz', quizSchema);
// module.exports = mongoose.model('UserQuiz', UserQuizDataSchema);

module.exports = { UserQuizData: mongoose.model('UserQuizData', userQuizDataSchema) };

/*
A | { points: 15, time: ISO1 }
B | { points:  9, time: ISO2 }
C | 8
D | 1
*/