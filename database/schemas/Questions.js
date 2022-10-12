const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	// not sure if Part wants to apply RegEx over here to check date
	unlock: { type: String, required: true },
	questions: { type: [{
		q: {
			type: [{
				val: { type: String, required: true },
				type: { type: String, enum: ["title", "text", "image"], required: true }
			}],
			required: true
		},
		options: {
			type: [{
				val: { type: String, required: true },
				type: { type: String, enum: ["text", "image"], required: true }
			}],
			required: true
		},
		// PS: Change this if Phantom asks for not-so-MCQ questions ;-;
		solution: { type: Number, required: true, min: 1, max: 4 }
	}], required: true },
	random: {
		type: [{
			amount: { type: Number, required: true },
			from: { type: [Number], required: true }
		}]
	}
});

questionsSchema.set('collection', 'quizquestions');

module.exports = mongoose.model('Questions', questionsSchema);
