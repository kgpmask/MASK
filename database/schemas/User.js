const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
	googleOAuth : {type: String, required: true},
	name : String 
});

module.exports = mongoose.model('User', userInfoSchema);