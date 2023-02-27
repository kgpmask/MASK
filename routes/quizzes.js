const express = require('express');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', async (req, res) => {
	// No specific event queried!
	if (PARAMS.mongoless) return res.redirect('/');
	const user = req.loggedIn ? await dbh.getUserStats(req.user._id) : {};
	const quizzed = user.quizData?.map(quiz => quiz.quizId) ?? [];
	const qzs = await dbh.getQuizzes();
	const QUIZZES = {};
	qzs.forEach(qz => QUIZZES[qz.unlock.slice(0, 10)] = qz); // TODO Mokshith: Add a quizId field
	const months = [
		'-', 'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const quizzes = Object.keys(QUIZZES);
	const years = {};
	quizzes.sort();
	quizzes.forEach(quiz => {
		const [year, month, date] = quiz.split('-');
		if (!years[year]) years[year] = { title: year, months: {} };
		if (!years[year].months[~~month]) years[year].months[~~month] = { title: months[~~month], issues: [] };
		years[year].months[~~month].issues.push({
			title: `${Tools.nth(~~date)} ${months[~~month]}`,
			href: quiz
		});
	});
	const renderYears = Object.values(years);
	renderYears.forEach(year => year.months = Object.values(year.months).reverse());
	const now = Date.now();
	const locked = Object.entries(QUIZZES).filter(
		([_, quiz]) => new Date(quiz.unlock).getTime() > now
	).map(k => k[0]);
	return res.renderFile('events.njk', {
		quizzed,
		years: renderYears.reverse(),
		locked
	});
});

router.get('/:arg', async (req, res) => {
	if (!req.loggedIn) {
		if (!PARAMS.userless) req.session.returnTo = req.url;
		return res.renderFile('login.njk');
	}
	const user = req.loggedIn ? await dbh.getUserStats(req.user._id) : {};
	const quizzed = user.quizData?.map(quiz => quiz.quizId) ?? [];
	const qzs = await dbh.getQuizzes();
	const QUIZZES = {};
	qzs.forEach(qz => QUIZZES[qz.unlock.slice(0, 10)] = qz); // TODO Mokshith: Add a quizId field
	const months = [
		'-', 'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const quizzes = Object.keys(QUIZZES);
	quizzes.sort();
	const index = quizzes.indexOf(req.params.arg);
	if (index === -1) {
		const years = {};
		quizzes.forEach(quiz => {
			const [year, month, date] = quiz.split('-');
			if (!years[year]) years[year] = { title: year, months: {} };
			if (!years[year].months[~~month]) years[year].months[~~month] = { title: months[~~month], issues: [] };
			years[year].months[~~month].issues.push({
				title: `${Tools.nth(~~date)} ${months[~~month]}`,
				href: quiz
			});
		});
		const renderYears = Object.values(years);
		renderYears.forEach(year => year.months = Object.values(year.months).reverse());
		const now = Date.now();
		const locked = Object.entries(QUIZZES).filter(
			([_, quiz]) => new Date(quiz.unlock).getTime() > now
		).map(k => k[0]);
		// TODO: Make this redirect to /${req.params[0]}-404
		return res.notFound('events/quizzes_404.njk', { years: renderYears.reverse(), quizzed, locked });
	} else if (!PARAMS.quiz && quizzed.includes(req.params.arg)) return res.renderFile('events/quiz_attempted.njk');
	const adjs = [quizzes[index - 1], quizzes[index + 1], quizzes[index]];
	const QUIZ = QUIZZES[req.params.arg];
	const quizDate = new Date(QUIZ.unlock).getTime();
	if (quizDate > Date.now()) {
		return res.renderFile('events/quiz_countdown.njk', {
			timeLeft: quizDate - Date.now() + 1000
		});
	}
	// Deterministically select questions 'randomly'
	const rand = Tools.fakeRandom(req.user._id);
	function shuffle (array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	const questions = [];
	QUIZ.random.forEach(randDef => {
		const keys = shuffle(Object.keys(randDef.from)).slice(0, randDef.amount);
		questions.push(...keys.map(key => randDef.from[key]).map(key => {
			const q = Tools.deepClone(QUIZ.questions[key]);
			delete q.solution;
			return q;
		}));
	});
	shuffle(questions);
	return res.renderFile('events/static_quiz.njk', {
		adjs,
		questions: JSON.stringify(questions),
		qAmt: questions.length,
		id: req.params.arg
	});
});

router.post('/', async (req, res) => {
	// TODO: Use a res.requireLogin(req) function
	if (!req.loggedIn) {
		if (!PARAMS.userless) req.session.returnTo = req.url;
		return res.renderFile('events/quiz_login.njk');
	}
	// Regenerate questions
	const rand = Tools.fakeRandom(req.user._id);
	function shuffle (array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	const quizId = req.body.quizId;
	const solutions = [];
	const qzs = await dbh.getQuizzes();
	const QUIZZES = {};
	qzs.forEach(qz => QUIZZES[qz.unlock.slice(0, 10)] = qz);
	if (!QUIZZES.hasOwnProperty(quizId)) return res.status(400).send('Invalid Quiz ID');
	const QUIZ = QUIZZES[quizId];
	QUIZ.random.forEach(randDef => {
		const keys = shuffle(Object.keys(randDef.from)).slice(0, randDef.amount);
		solutions.push(...keys.map(key => QUIZ.questions[randDef.from[key]].solution));
	});
	shuffle(solutions);
	const answers = Array.from({ length: solutions.length }).map((_, i) => ~~req.body[`answer-${i + 1}`]);
	const points = [answers.filter((ans, i) => ~~ans === ~~solutions[i]).length, solutions.length];
	dbh.updateUserQuizRecord({ userId: req.user._id, quizId, score: points[0], time: Date.now() });
	// Despite the above function being async, we don't need the result to continue, so no point in 'await' here
	return res.renderFile('events/quiz_success.njk', { score: points[0], totalScore: points[1] });
});

module.exports = router;
