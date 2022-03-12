const mongoose = require('mongoose');
const Quiz = require('./Quiz');
const User = require('./User');

const eventSchema = new mongoose.Schema({
	quizId : [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Quiz' }],
	eventName : String,
});

const userEventDataSchema = new mongoose.Schema({
	UserQuizData : [{ type: mongoose.SchemaTypes.ObjectId, ref: 'UserQuiz' }],
	userId : { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
	eventId : { type: mongoose.SchemaTypes.ObjectId, ref: 'Event', required: true }
});

module.exports = {
	Event: mongoose.model('Event', eventSchema),
	UserEventData: mongoose.model('UserEventData', userEventDataSchema),
};

// これ。。。何？
// 何の用だ？
// 目的は。。。何？
// 全てはパゴルのせいだ
// (Ignore me messing around with my Japanese keyboard)
// -PartMan