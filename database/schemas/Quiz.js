const mongoose = require('mongoose');

const userQuizDataSchema = new mongoose.Schema({
	userId: { type: String, required: true, index: true, unique: true },
	points: { type: Number, required: true },
	quizData: { type: mongoose.Schema.Types.Mixed, required: true }
});

userQuizDataSchema.set('collection', 'quizdata');

module.exports = mongoose.model('UserQuizData', userQuizDataSchema);
