const mongoose = require('mongoose');
const Quiz = require('./Quiz');
const User = require('./User');

const eventSchema = new mongoose.Schema({
	quizId: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Quiz' }],
	eventName: String
});

const userEventDataSchema = new mongoose.Schema({
	UserQuizData: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'UserQuiz' }],
	userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
	eventId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Event', required: true }
});

module.exports = {
	Event: mongoose.model('Event', eventSchema),
	UserEventData: mongoose.model('UserEventData', userEventDataSchema)
};

// Note: keeping this in case it's used in the future; currently this code has no functionality
