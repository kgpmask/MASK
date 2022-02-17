const mongoose = require('mongoose');
const {Quiz, UserQuiz} = require('./Quiz');

const eventSchema = new mongoose.Schema({
	quizId : [{type: mongoose.SchemaTypes.ObjectId, ref: 'Quiz'}],
	eventName : String,
});

const userEventDataSchema = new mongoose.Schema({
	UserQuizData : [{type: mongoose.SchemaTypes.ObjectId, ref: 'UserQuiz'}],
	userId : {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
	eventId : {type: mongoose.SchemaTypes.ObjectId, ref: 'Event'}
});

module.exports = {
	Event: mongoose.model('Event', eventSchema),
	UserEventData: mongoose.model('UserEventData', userEventDataSchema),
};