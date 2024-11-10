const mongoose = require('mongoose');

const skribblSchema = new mongoose.Schema({
	_id: {
		type: String, // Changed from ObjectId to String to match handler implementation
		required: true
	},
	name: {
		type: String,
		required: true,
		match: /^[a-zA-Z0-9\s'":]+$/,
		trim: true // Added trim for consistency
	},
	// Additional fields that might be useful
	addedAt: {
		type: Date,
		default: Date.now
	}
});

const Skribbl = mongoose.model('Skribbl', skribblSchema);
