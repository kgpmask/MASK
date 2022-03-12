const mongoose = require('mongoose');

const userQuizDataSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	points: { type: Number, required: true },
	quizData: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('UserQuizData', userQuizDataSchema);