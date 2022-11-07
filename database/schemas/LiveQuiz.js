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
			},
			required: true
		},
		solution: { type: [String, Number], required: true }
	}], required: true }
});

questionsSchema.set('collection', 'livequizzes');

module.exports = mongoose.model('Questions', questionsSchema);
