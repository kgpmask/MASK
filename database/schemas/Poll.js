const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	title: String,
	endTime: { type: Date, required: true },
	addOption: Boolean,
	records: [
		{
			value: { type: String, required: true },
			votes: [String]
			// contains userId of voters
		}
	]
});

PollSchema.set('collection', 'polls');

module.exports = mongoose.model('Poll', PollSchema);
