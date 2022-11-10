const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	title: { type: String, required: true, default: () => {
		return new Date().toISOString().slice(0, 10);
	} },
	questions: { type: [{
		q: {
			type: [{
				val: { type: String, required: true },
				type: { type: String, enum: ["title", "text", "image", "video", "mp3"], required: true }
			}],
			required: true
		},
		options: {
			type: {
				type: String,
				required: true,
				enum: ['text', 'mcq', 'number']
			},
			value: {
				type: [{
					val: { type: String, required: true },
					type: { type: String, enum: ["text", "image"], required: true }
				}]
			}
		},
		solution: { type: [String, Number], required: true }
	}], required: true }
}, { _id: false });

const resultSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	username: { type: String, required: true },
	quizId: { type: String, required: true },
	question: { type: Number, required: true },
	points: { type: Number, required: true },
	answer: { type: String, required: true },
	result: { type: String, required: true, enum: ['correct', 'partial', 'incorrect'] }
});

questionsSchema.set('collection', 'livequizzes');
resultSchema.set('collection', 'livequizresults');

module.exports = {
	LiveQuiz: mongoose.model('LiveQuiz', questionsSchema),
	LiveResult: mongoose.model('LiveResult', resultSchema)
};
