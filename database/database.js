const mongoose = require('mongoose');
mongoose.connect(`mongodb://${MongoConfig.host}:${MongoConfig.port}/${MongoConfig.db}`, e => console.log(e || 'Connected to the DB!'));

/*

New structure:

Two collections:

User(s): { userId<String>, name<string>, picture<url(string)> }
UserQuizData(s): { userId<String>, points<Number>, quizData: { quizId<string>: { score<Number>, time<Time> } } }


Dunno what Events is for, yet
(It has two collections defined)

*/