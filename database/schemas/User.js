const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
	// provider : {type: String, required: true},
	subject : {type: String, required: true},
	name : {type: String, required: true}, 
	email : {type: String, required: true, lowercase: true, trim: true}
});

module.exports = {User: mongoose.model('User', userInfoSchema)};