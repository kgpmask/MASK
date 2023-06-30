const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	member: Boolean,
	type: { type: String, required: true },
	link: { type: String, required: true },
	proof: String,
	social: String,
	date: { type: Date, default: new Date(), required: true }
});

submissionSchema.set('collection', 'submissions');

module.exports = mongoose.model('Submission', submissionSchema);
