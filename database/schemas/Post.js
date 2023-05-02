const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
	name: { type: String, required: true },
	link: { type: String },
	type: { type: String, required: true },
	attr: { type: [String] },
	date: { type: Date, required: true },
	page: String,
	hype: Boolean,
	metadata: {
		type: {
			height: Number,
			width: Number
		}
	}
});

postSchema.set('collection', 'posts');

postModel = mongoose.model('posts', postSchema);

module.exports = postModel;
