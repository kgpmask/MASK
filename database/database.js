const mongoose = require('mongoose');

exports.init = async () => {
	if (!process.env.MONGO_URL) return console.log('[!!!] Unable to connect to database: no URL supplied');
	try {
		const db = await mongoose.connect(process.env.MONGO_URL, { connectTimeoutMS: 5000 });
		const socket = db.connections[0];
		if (!PARAMS.test) console.log(`Connected to the database at ${socket.host}:${socket.port}`);
		if (socket.host === '51.79.52.188' && socket.name === 'mask') {
			if (PARAMS.test) {
				console.log('HOLY SHIT WHY ARE YOU CONNECTING TO PROD IN A TEST SUITE AAAAAA');
				console.log('*defenestrates to prevent damage*');
				process.exit(1);
			}
			console.log('___________________________________________');
			console.log('| \x1b[31mYOU ARE CONNECTING TO THE PRODUCTION DB\x1b[0m |');
			console.log('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾');
			// So I like decoration. Sue me.
		}
		return db;
	} catch (e) {
		console.log(`[!!!] Unable to connect to the database! ${e.message}`, e);
	}
};

exports.disconnect = () => {
	mongoose.disconnect();
	// I have ABSOLUTELY NO IDEA why mongoose refuses to close, so I murder it! (--exit flag in mocha)
};

/*

Two collections:

User(s): { userId<String>, name<string>, picture<url(string)> }
UserQuizData(s): { userId<String>, points<Number>, quizData: { quizId<string>: { score<Number>, time<Time> } } }

*/
