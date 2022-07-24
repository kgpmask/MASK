const mongoose = require('mongoose');

exports.init = () => {
	if (!process.env.MONGO_URL) return console.log('[!!!] Unable to connect to database: no URL supplied');
	mongoose.connect(process.env.MONGO_URL, { connectTimeoutMS: 5000 }).then(db => {
		const socket = db.connections[0];
		console.log(`Connected to the database at ${socket.host}:${socket.port}`);
		if (socket.host === '51.79.52.188' && socket.name === 'mask') {
			console.log('___________________________________________');
			console.log('| \x1b[31mYOU ARE CONNECTING TO THE PRODUCTION DB\x1b[0m |');
			console.log('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾');
			// So I like decoration. Sue me.
		}
	}).catch(e => console.log(`[!!!] Unable to connect to the database! ${e.message}`, e));
};

/*

New structure:

Two collections:

User(s): { userId<String>, name<string>, picture<url(string)> }
UserQuizData(s): { userId<String>, points<Number>, quizData: { quizId<string>: { score<Number>, time<Time> } } }

*/
