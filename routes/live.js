const express = require("express");
const router = express.Router();

const checker = require('../src/checker.js');
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

const handlerContext = {}; // Store cross-request context here

router.get('/', async (req, res) => {
	if (!req.loggedIn) {
		if (!PARAMS.userless) req.session.returnTo = req.url;
		return res.renderFile('events/quiz_login.njk');
	}
	const quiz = await dbh.getLiveQuiz(PARAMS.dev);
	if (!quiz) return res.renderFile('events/quizzes_404.njk', { message: `The quiz hasn't started, yet!` });
	const QUIZ = quiz.questions;
	const user = await dbh.getUser(req.user._id);
	if (user.permissions?.includes('quizmaster')) {
		return res.renderFile('events/live_master.njk', {
			quiz: JSON.stringify(QUIZ),
			qAmt: QUIZ.length,
			id: 'live'
		});
	} else {
		return res.renderFile('events/live_participant.njk', {
			id: 'live',
			userId: req.user._id
		});
	}
});

router.get('/results', async (req, res) => {
	const quizId = new Date().toISOString().slice(0, 10);
	const RES = await dbh.getAllLiveResults(quizId);
	if (!RES) return res.notFound();
	const results = [];
	RES.forEach(_RES => {
		if (!results.find(res => res.id === _RES.userId)) {
			results.push({
				id: _RES.userId,
				name: _RES.username,
				points: 0
			});
		}
		results.find(res => res.id === _RES.userId).points += _RES.points;
	});
	results.sort((a, b) => -(a.points > b.points));
	let i = 1, j = 1;
	for (let result = 0; result < results.length; result++) {
		if (!result) results[result].rank = i;
		else {
			if (results[result].points === results[result - 1].points) j++;
			else {
				i += j;
				j = 1;
			}
			results[result].rank = i;
		}
		delete results[result].id;
	}
	return res.renderFile('events/results.njk', { results });
});

router.post('/', async (req, res) => {
	if (!req.loggedIn) {
		if (!PARAMS.userless) req.session.returnTo = req.url;
		return res.renderFile('events/quiz_login.njk');
	}
	if (!handlerContext.liveQuiz) handlerContext.liveQuiz = {};
	const LQ = handlerContext.liveQuiz;
	const quiz = await dbh.getLiveQuiz(PARAMS.dev);
	const QUIZ = quiz.questions;
	const user = await dbh.getUser(req.user._id);
	if (user.permissions?.includes('quizmaster')) {
		const quizTime = { '10': 20, '5': 15, '3': 12 }[QUIZ[req.body.currentQ].points];
		io.sockets.in('waiting-for-live-quiz').emit('question', {
			currentQ: req.body.currentQ,
			options: req.body.options,
			time: quizTime
		});
		setTimeout(() => {
			const type = QUIZ[req.body.currentQ].options.type;
			const solution = QUIZ[req.body.currentQ].solution;
			setTimeout(() => io.sockets.in('waiting-for-live-quiz').emit('answer', {
				answer: Array.isArray(solution) ? solution.join(' / ') : solution,
				type
			}), 2000); // Emit the actual event 3s after
		}, 1000 * (quizTime + 1)); // Extra second to account for lag
		LQ.currentQ = req.body.currentQ;
		LQ.endTime = Date.now() + 1000 * (quizTime + 1);
		res.send('Done');
	} else {
		const answer = req.body.submittedAnswer;
		if (answer === '') throw new Error('Missing answer');
		const currentQ = LQ.currentQ ?? - 1;
		const Q = QUIZ[currentQ];
		if (!Q) throw new Error('currentQ out of bounds');
		const time = Math.round((LQ.endTime - Date.now()) / 1000);
		if (time < 0) throw new Error('Too late!');
		const alreadySubmitted = await dbh.getLiveResult(user._id, quiz.title, currentQ);
		if (alreadySubmitted) throw new Error('Already attempted this question!');
		const { points, timeLeft } = await checker.checkLiveQuiz(answer, Q.solution, Q.options.type, Q.points, time);
		const result = points
			? points < Q.points ? 'partial' : 'correct'
			: 'incorrect';
		const functionArgs = [user._id, quiz.title, currentQ, points, answer, timeLeft, result];
		dbh.addLiveResult(...functionArgs).then(() => res.send('Submitted')).catch(e => console.log(e) && res.error(e));
	}
});


router.post('/end', async (req, res) => {
	if (!req.loggedIn) {
		if (!PARAMS.userless) req.session.returnTo = req.url;
		return res.renderFile('events/quiz_login.njk');
	}
	const user = await dbh.getUser(req.user._id);
	if (!user.permissions.find(perm => perm === 'quizmaster')) throw new Error('Access denied');
	io.sockets.in('waiting-for-live-quiz').emit('end-quiz');
	return res.send('Ended!');
});

module.exports = router;
