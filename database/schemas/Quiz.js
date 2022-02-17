const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
	types : [String], // can be converted to an object
	maxScore : Number,
	maxTime : Number,
	dateTime : Date,
	dateLimit : Date
});

const UserQuizDataSchema = new mongoose.Schema({
	time : Number,
	score : Number,
	quizId : {type: mongoose.SchemaTypes.ObjectId, ref: 'Quiz'}
});

// module.exports = mongoose.model('Quiz', quizSchema);
// module.exports = mongoose.model('UserQuiz', UserQuizDataSchema);

module.exports = {
	Quiz: mongoose.model('Quiz', quizSchema),
	UserQuiz: mongoose.model('UserQuiz', UserQuizDataSchema)
};
