const mongoose = require('mongoose');
const User = require('./User');

const userQuizDataSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	points: { type: Number, required: true },
	quizData : { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = { UserQuizData: mongoose.model('UserQuizData', userQuizDataSchema) };