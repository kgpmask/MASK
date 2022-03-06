const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	picture: String
});

module.exports = { User: mongoose.model('User', userInfoSchema) };