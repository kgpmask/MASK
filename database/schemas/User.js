const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String, required: true },
	picture: String,
	permission: { type: String, required: true }
});

module.exports = mongoose.model('User', userInfoSchema);
