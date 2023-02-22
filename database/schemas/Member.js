const mongoose = require('mongoose');
const { collection } = require('./User');

const memberSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String, required: true },
	imageLink: String,
	records: [{
		year: { type: Number, required: true },
		// Positions: Governor, Research Associate, Executive, Associate, Fresher
		position: String,
		// Team: x = member, xH = x Head, xS = x Sub-Head
		teams: { type: [String], required: true }
	}]
}, { collection: 'member' });

module.exports = new mongoose.model("Member", memberSchema);
