/*
Update User Quiz Data:
	name: userQuizUpdate()
	inputs: UserQuizData
	outputs: void
	handler:
		inputs: time, score, user_id
		output: redirect to quiz page

View previous scores:
	- List events :
		input: user_id, auth_token
		output: [event_id, name]
		hyperlink: %%/event/%%?eventId=X
	- List attempted quizzes :
		input: user_id, auth_token, event_id
		output: [quizName, user_id->UserQuizData->quizId => score, time]
		hyperlink: leaderboard

Leaderboard:
- static - create after quiz ends

*/
const mongoose = require('mongoose');
const User = require('./schemas/User');
const {Quiz, UserQuiz} = require('./schemas/Quiz');
const {Event, UserEventData} = require('./schemas/Event');
const { handleError } = require('nunjucks/src/runtime');
const res = require('express/lib/response');
const { query } = require('express');

// Handle newly registered user
async function createNewUser (OAuthData, username) {
	let query = User.find({'email': OAuthData.email}, 'email');
	let user = {};
	query.exec(async function (err, existing_users) {
		if (err) return handleError(err);
		else if (existing_users.length > 0) {
			// Email is already in use
			console.log("Email already in use");
			user.id = null;
		}
		else {
			let new_user = new User({'name': username, 'email': OAuthData.email});
			new_user.save(function (err) {
				if (err) return handleError(err);
			});
			user.id = new_user.__id;
		}
	});
	return user;
}

// Declare a new event
async function addEvent (eventData) {
	let new_event = new Event({'eventName': eventData.eventName});
	new_event.save(function (err) {
		if (err) return handleError(err);
	});
	return new_event.__id;
}

// Add quiz to associated event
async function addQuiz (quizData) {
	let new_quiz = new Quiz({
		'type': quizData.type,
		'maxScore': quizData.maxScore,
		'maxTime': quizData.maxTime,
		'dateTime': quizData.dateTime
	});
	let query = Event.find({'eventName': quizData.eventName});
	let cur_event = "";
	query.exec(async function (err, events) {
		if (err) return handleError(err);
		else if (events.length === 0) {
			cur_event = await Event.findById(addEvent({'eventName': quizData.eventName}));
		}
		else {
			cur_event = events[0];
		}
	});
	cur_event.quizId.push(new_quiz.__id);
	return new_quiz.__id;
}

async function createUserEventData (ueData) {
	let data = "";
	let query = UserEventData.find({'userId': ueData.userId, 'eventId': ueData.eventId});
	query.exec(async function (err, matches) {
		if (err) return handleError(err);
		else if (matches.length == 0) {
			data = new UserEventData({'eventId': ueData.eventId, 'userId': ueData.userId});
			data.save(function (err) {
				if (err) return handleError(err);
			});
		}
		else {
			data = matches[1];
		}
	});
	return data.__id;
}

async function updateUserQuizData (ueqData) {
	let cur_eid = createUserEventData({'userId': ueqData.userId, 'eventId': ueqData.eventId});
	cur_edata = await UserEventData.findById(cur_eid);
	
}

function test1 () {
	let t_1 = createNewUser({'email': "2"}, "c");
	setTimeout(() => {
		console.log(t_1);
	}, 10e3);
	// console.log(t_1);
}

// test1();