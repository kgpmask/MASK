//Import the mongoose module
const mongoose = require('mongoose');
const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const pass = require('./pass');
const dbhandle = require('./database_handler.js');
// mongoose.connect('mongodb+srv://mask:'+ pass +'@mask-site.hvgm0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', e =>{
// 	if(e) console.log(e.message);
// 	else console.log('Database Created');
// });

mongoose.connect(`mongodb://${MongoConfig.host}:${MongoConfig.port}/${MongoConfig.db}`, err => {
	if (err) console.log(err.message);
	else console.log("Database connected");
});

// async function add() {
// 	// const user1 = await User.create({ googleOAuth :"hdiashdf", name :"MASK"});
// 	// console.log('user added!', user1);
// 	const quiz1 = await Quiz.create({types : ['crossword']});
// 	console.log('quiz added!');
// 	const userQuizData1 = await UserQuiz.create({time: 4});
// 	console.log('user-quiz added!');
// 	const event1 = await Event.create({ eventName : "SummerQuiz", quizId : [quiz1._id]});
// 	console.log('event added!');
// 	const userEventData1 = await UserEventData.create({ userId : user1._id });
// 	console.log('user-event added!', userEventData1);
// }
// add();


//Get the default connection
// var db = mongoose.connection;
// db.close();
/*
Db1 = user info
	-> googleOAuth : Token : String
	-> userName : String : not unique
	-> userId : String : random, unique

Db2 = Quiz
	-> type
	-> maxScore
	-> maxTime
	-> dateTime
	-> quizId

Db3 = UserQuizData
	-> time
	-> score
	-> quizId

Db4 = UserEventData
	-> UserQuizData : array
	-> userId
	-> eventId

Db5 = Event
	-> Quiz : object array
	-> eventId
	-> eventName
*/