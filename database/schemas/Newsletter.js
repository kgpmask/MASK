const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	solutions: mongoose.Schema.Types.Mixed
});

NewsletterSchema.set('collection', 'newsletters');

module.exports = mongoose.model('Newsletter', NewsletterSchema);
