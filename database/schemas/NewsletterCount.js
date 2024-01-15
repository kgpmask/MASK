const mongoose = require('mongoose');

const NewsletterCountSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	count: { type: Number, required: true, default: 0 }
});

NewsletterCountSchema.set('collection', 'newsletter-count');

module.exports = mongoose.model('NewsletterCount', NewsletterCountSchema);
