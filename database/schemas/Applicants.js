const mongoose = require('mongoose');

const ApplicantListSchema = new mongoose.Schema({
	records: { type: [{
		_id: { type: String, required: true },
		name: String
	}], required: true }
});

ApplicantListSchema.set('collection', 'applicantsdata');

module.exports = mongoose.model('ApplicantList', ApplicantListSchema);
