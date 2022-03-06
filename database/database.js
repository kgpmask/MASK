const mongoose = require('mongoose');
const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const dbhandle = require('./database_handler.js');

mongoose.connect(`mongodb://${MongoConfig.host}:${MongoConfig.port}/${MongoConfig.db}`, err => {
	if (err) console.log(err.message);
	else console.log("Database connected");
});


/*

New structure:

Two (three?) collections:

User(s): { userId<String>, name<string>, picture<url(string)> }
UserQuizData(s): { userId<String>, points<Number>, quizData: { quizId<string>: { score<Number>, time<Time> } } }


Dunno what Events is for, yet
(It has two collections defined)

*/