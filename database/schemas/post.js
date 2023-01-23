const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	name: { type: String, required: true },
	link: { type: String },
	type: { type: String, required: true },
	attr: { type: [String] },
	date: { type: String, required: true },
	page: String,
	hype: Boolean
});

postSchema.set("collection", 'posts');

module.exports = mongoose.model('Post', postSchema);
