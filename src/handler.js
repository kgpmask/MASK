const axios = require('axios');
const crypto = require('crypto');
const { TopologyDescription } = require('mongodb');
const fs = require('fs').promises;
const { restart } = require('nodemon');
const { render } = require('nunjucks');

const path = require('path');

const checker = require('./checker.js');
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

const handlerContext = {}; // Store cross-request context here


function handler (app, nunjEnv) {
	// Main pages

	// Set some common values
	const months = [
		'-',
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	app.get(['/', '/home'], async (req, res, next) => {
		try {
			const sample = [
				{
					name: 'How to get into MASK',
					link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
					type: 'youtube',
					attr: ['Parth Mane'],
					date: new Date('Oct 25, 2009'),
					page: '_blank',
					hype: true
				}, {
					name: 'Art - Tanjiro Kamado',
					link: '0025.webp',
					type: 'art',
					attr: ['Sanjeev Raj Ganji'],
					date: new Date(1630261800000),
					hype: true
				}, {
					name: 'Art - Saitama',
					link: '0019.webp',
					type: 'art',
					attr: ['Garima Mendhe'],
					date: new Date(1628879400000),
					hype: true
				}, {
					name: 'Art - Kirigakure Shinobi Massacre',
					link: '0012.webp',
					type: 'art',
					attr: ['Arpit Das'],
					date: new Date(1589308200000),
					hype: true
				}, {
					name: 'Art - Garou',
					link: '0008.webp',
					type: 'art',
					attr: ['Pritam Mallick'],
					date: new Date(1572220800000),
					hype: true
				}, {
					name: '「AMV」Phantasy Star Online 2 - Symphony',
					link: 'https://www.youtube.com/watch?v=GX7TAigwZPw',
					type: 'youtube',
					attr: ['Hrishabh Kumar Tundwar'],
					date: new Date(1673289000000),
					hype: true
				}, {
					name: '「AMV」The Garden of Words - A Thousand Years',
					link: 'https://www.youtube.com/watch?v=9W4eyQ7LP7g',
					type: 'youtube',
					attr: ['Hrishabh Kumar Tundwar'],
					date: new Date(1673289000000),
					hype: true
				}, {
					name: '「AMV」Assassination Classroom - Heathens',
					link: 'https://www.youtube.com/watch?v=unITcghHNVI',
					type: 'youtube',
					attr: ['Chiranjeet Mishra'],
					date: new Date(1673289000000),
					hype: true
				}
			];
			const allPosts = PARAMS.mongoless ? sample : await dbh.getPosts();
			const posts = PARAMS.mongoless ? allPosts.splice(0, 2) : allPosts.splice(0, 7);
			posts.forEach(post => {
				const elapsed = Date.now() - post.date;
				if (!isNaN(elapsed) && elapsed < 7 * 24 * 60 * 60 * 1000) post.recent = true;
			});
			const toBeDisplayed = PARAMS.mongoless ? 3 : 5;
			const art = allPosts.filter(post => post.type === 'art' && post.hype).splice(0, toBeDisplayed);
			const vids = allPosts.filter(post => post.type === 'youtube' && post.hype).splice(0, toBeDisplayed);
			return res.renderFile('home.njk', { posts, vids, art });

		} catch (error) {
			next(error);
		}
	});
	app.get('/art', async (req, res, next) => {
		try {
			const sample = [
				{
					name: 'Art - Tanjiro Kamado',
					link: '0025.webp',
					type: 'art',
					attr: ['Sanjeev Raj Ganji'],
					date: new Date(1630261800000),
					hype: true
				}
			];
			const art = PARAMS.mongoless ? sample : await dbh.getPosts('art');
			return res.renderFile('art.njk', { art });
		} catch (error) {
			next(error);
		}
	});
	app.get('/videos', async (req, res, next) => {
		try {
			const sample = [{ name: 'How to get into MASK', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube' }];
			const vids = PARAMS.mongoless ? sample : await dbh.getPosts('youtube');
			vids.forEach(vid => vid.embed = `https://www.youtube.com/embed/${vid.link.split('?v=')[1]}?playsinline=1`);
			return res.renderFile('videos.njk', { vids });

		} catch (error) {
			next(error);
		}
	});
	app.get('/about', (req, res, next) => {
		try {
			return res.renderFile('about.njk');
		} catch (error) {
			next(error);
		}
	});
	app.get('/members/:yearName?', async (req, res, next) => {
		try {
			const sample = [
				{
					name: 'Ankan Saha',
					roll: '22EE10008',
					image: '../assets/members/22_ankan.webp',
					teams: [
						{
							name: 'Quiz',
							icon: 'quiz'
						},
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Fresher'
				}, {
					name: 'Jai Sachdev',
					roll: '22BT10011',
					image: '../assets/members/22_jai.webp',
					teams: [
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Fresher'
				}, {
					name: 'Karthikeya S M Yelisetty',
					roll: '21CS30060',
					image: '../assets/members/21_karthikeya.webp',
					teams: [
						{
							name: 'AMV & Music',
							icon: 'amv'
						},
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Former Member'
				}, {
					name: 'Nishkal Prakash',
					roll: '19CS91R05',
					image: '../assets/members/19_nishkal.webp',
					teams: [
						{
							name: 'AMV & Music',
							icon: 'amv'
						},
						{
							name: 'Design & Arts',
							icon: 'design'
						},
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Research Associate'
				}, {
					name: 'Parth Mane',
					roll: '19MF10022',
					image: '../assets/members/19_parth.webp',
					teams: [
						{
							name: 'AMV & Music',
							icon: 'amv'
						},
						{
							name: 'Media & Newsletter',
							icon: 'newsletter'
						},
						{
							name: 'Quiz',
							icon: 'quiz'
						},
						{
							name: 'WebDev',
							icon: 'webdev-head'
						}
					],
					position: 'Team Heads'
				}, {
					name: 'Saumyadip Nandy',
					roll: '20EC10072',
					image: '../assets/members/20_saumyadip.webp',
					teams: [
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Former Member'
				}, {
					name: 'Uday Srivastava',
					roll: '22ME30072',
					image: '../assets/members/22_uday.webp',
					teams: [
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Fresher'
				}, {
					name: 'Venkatsai Mokshith',
					roll: '21CS10050',
					image: '../assets/members/21_venkatsai.webp',
					teams: [
						{
							name: 'WebDev',
							icon: 'webdev'
						}
					],
					position: 'Associate'
				}, {
					name: 'Vidunram A R',
					roll: '21EE30033',
					image: '../assets/members/21_vidunram.webp',
					teams: [
						{
							name: 'Media & Newsletter',
							icon: 'newsletter'
						},
						{
							name: 'Quiz',
							icon: 'quiz'
						},
						{
							name: 'WebDev',
							icon: 'webdev-sub'
						}
					],
					position: 'Team Sub-Heads'
				}
			];
			const yearName = parseInt(req.params.yearName) || 2022;
			const membersData = PARAMS.mongoless ? sample : await dbh.getMembersbyYear(yearName);
			const status = {
				'Governors': [],
				'Team Heads': [],
				'Team Sub-Heads': [],
				'Advisors': [],
				'Research Associate': [],
				'Executives': [],
				'Associates': [],
				'Freshers': [],
				'Former Members': []
			};
			membersData.forEach(member => {
				try {
					status[member.position].push(member);
				} catch {
					status[member.position + 's'].push(member);
				}
			});
			const membersObj = Object.entries(status);
			const membersTitle = 'Our Members';
			return res.renderFile('members.njk', {
				membersObj,
				membersTitle,
				prev: yearName - 1 >= 2020 && !PARAMS.mongoless ? `${yearName - 1}-${yearName % 100}` : undefined,
				next: yearName + 1 <= 2022 && !PARAMS.mongoless ? `${yearName + 1}-${yearName % 100 + 2}` : undefined
			});
		} catch (error) {
			next(error);
		}
	});
	// Links to external stuff
	app.get('/apply', (req, res) => {
		return res.renderFile('applications.njk');
	});
	app.get('/submissions', (req, res) => {
		return res.renderFile('submissions.njk');
	});
	app.use('/blog', (req, res) => {
		const url = req.url.replace(/^.*?\/blog/, '');
		// TODO: Fix this!
		return res.redirect(`https://maskiitkgp.blogspot.com${url}.html`);
	});
	// User stuff
	app.get('/login', (req, res, next) => {
		try {
			if (req.loggedIn) return res.redirect('/');
			res.renderFile('login.njk');
		} catch (error) {
			next(error);
		}
	});
	app.get('/logout', (req, res, next) => {
		try {
			if (!req.loggedIn) return res.redirect('/login');
			return req.logout(() => res.redirect('/'));
		} catch (error) {
			next(error);
		}
	});
	app.get('/profile', async (req, res, next) => {
		try {
			if (!req.loggedIn) return res.redirect('/');
			const user = await dbh.getUserStats(req.user._id);
			return res.renderFile('profile.njk', {
				name: req.user.name,
				picture: req.user.picture,
				points: user.points,
				quizzes: user.quizData.map(stamp => {
					const [year, month, date] = stamp.quizId.split('-');
					return `${Tools.nth(~~date)} ${months[~~month]}`;
				})
			});

		} catch (error) {
			next(error);
		}
	});
	// Newsletters, quizzes, and events
	app.get('/newsletters/:target?', (req, res, next) => {
		try {
			return fs.readdir(path.join(__dirname, '../templates/newsletters')).then(letters => {
				const years = {};
				letters.sort();
				letters.forEach(letter => {
					const [year, month, num] = letter.split('-');
					if (!years[year]) years[year] = { title: year, months: {} };
					if (!years[year].months[~~month]) years[year].months[~~month] = { title: months[~~month], issues: [] };
					years[year].months[~~month].issues.push({
						title: ['-', 'First', 'Second', 'Special'][~~num],
						href: letter
					});
				});
				const renderYears = Object.values(years);
				renderYears.forEach(year => year.months = Object.values(year.months).reverse());
				const target = req.params.target;
				if (!target) return res.renderFile('newsletters.njk', {
					years: renderYears.reverse()
				});
				if (target === 'random') {
					const referer = req.headers.referer?.split('/').pop();
					const randLetter = letters.filter(letter => letter !== referer).random();
					return res.redirect(`/newsletters/${randLetter}`);
				}
				const index = letters.indexOf(target);
				if (index === -1) return res.notFound('newsletters_404.njk', { years: renderYears.reverse() });
				const filepath = ['newsletters', letters[index], letters[index] + '.njk'];
				const adjs = [letters[index - 1], letters[index + 1], letters[index]];
				fs.readdir(path.join(__dirname, '../templates/newsletters', target)).then(files => {
					const pages = files.filter(file => file.includes('#'));
					return res.renderFile(filepath, { adjs, pages, target });
				});
			}).catch(err => {
				console.log(err);
				return res.notFound();
			});
		} catch (error) {
			next(error);
		}
	});
	app.post('/checker/:newsletter/:puzzleType', async (req, res, next) => {
		try {
			const { solutions } = await dbh.getNewsletter(req.params.newsletter);
			const response = checker.checkNewsletterPuzzle(req.params.puzzleType, req.body, solutions);
			switch (response) {
				case true: return res.send('correct');
				case false: return res.send('');
				default: return res.send(response);
			}
		} catch (error) {
			next(error);
		}
	});
	app.get(['/quizzes/:arg', '/events/:arg'], async (req, res, next) => {
		try {
			if (!req.loggedIn) {
				if (!PARAMS.userless) req.session.returnTo = req.url;
				return res.renderFile('login.njk');
			}
			const user = req.loggedIn ? await dbh.getUserStats(req.user._id) : {};
			const quizzed = user.quizData?.map(quiz => quiz.quizId) ?? [];
			const qzs = await dbh.getQuizzes();
			const QUIZZES = {};
			qzs.forEach(qz => QUIZZES[qz.unlock.slice(0, 10)] = qz); // TODO Mokshith: Add a quizId field
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
		} catch (error) {
			next(error);
		}
	});
	app.get(['/quizzes', '/events'], async (req, res, next) => {
		try {
			// No specific event queried!
			if (PARAMS.mongoless) return res.redirect('/');
			const user = req.loggedIn ? await dbh.getUserStats(req.user._id) : {};
			const quizzed = user.quizData?.map(quiz => quiz.quizId) ?? [];
			const qzs = await dbh.getQuizzes();
			const QUIZZES = {};
			qzs.forEach(qz => QUIZZES[qz.unlock.slice(0, 10)] = qz); // TODO Mokshith: Add a quizId field
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
		} catch (error) {
			next(error);
		}
	});
	app.post('/quizzes', async (req, res, next) => {
		try {
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
		} catch (error) {
			next(error);
		}
	});
	app.get('/success', (req, res, next) => {
		try {
			// TODO: Rename this to /quiz/success
			return res.renderFile('events/quiz_success.njk');
		} catch (error) {
			next(error);
		}
	});
	// Live master endpoint
	app.get('/live-master', async (req, res, next) => {
		try {
			if (PARAMS.dev) {
				// TODO: In the future, set a 'daily' script to run at midnight and update a process.env.LIVE_QUIZ parameter
				const quiz = await dbh.getLiveQuiz('2022-11-12');
				// if (!quiz) return res.renderFile('events/quizzes_404.njk', { message: `The quiz hasn't started, yet!` });
				const QUIZ = quiz.questions;
				return res.renderFile('events/live_master.njk', {
					quiz: JSON.stringify(QUIZ),
					qAmt: QUIZ.length,
					id: 'live',
					dev: PARAMS.dev
				});
			} else {
				return res.renderFile('events/quizzes_404.njk', { message: `STOP SNOOPING AROUND!` });
			}
		} catch (error) {
			next(error);
		}
	});
	app.post('/live-master', async (req, res, next) => {
		try {
			if (PARAMS.dev) {
				// LQ keeps track of which question is currently being asked
				if (!handlerContext.liveQuiz) handlerContext.liveQuiz = {};
				const LQ = handlerContext.liveQuiz;
				const quiz = await dbh.getLiveQuiz('2022-11-12');
				const QUIZ = quiz.questions;
				// console.log(req.body);
				const { currentQ, options } = req.body;
				const time = { '10': 20, '5': 15, '3': 12 }[QUIZ[currentQ].points];
				io.sockets.in('waiting-for-live-quiz').emit('question', { currentQ, options, time });
				setTimeout(() => {
					const type = QUIZ[currentQ].options.type;
					const solution = QUIZ[currentQ].solution;
					setTimeout(() => io.sockets.in('waiting-for-live-quiz').emit('answer', {
						answer: Array.isArray(solution) ? solution.join(' / ') : solution,
						type
					}), 2000); // Emit the actual event 3s after
				}, 1000 * (time + 1)); // Extra second to account for lag
				LQ.currentQ = req.body.currentQ;
				LQ.endTime = Date.now() + 1000 * (time + 1);
				res.send('Done');
			} else {
				return res.renderFile('events/quizzes_404.njk', { message: `STOP SNOOPING AROUND!` });
			}
		} catch (error) {
			next(error);
		}
	});
	app.get('/live', async (req, res, next) => {
		try {
			if (!req.loggedIn) {
				if (!PARAMS.userless) req.session.returnTo = req.url;
				return res.renderFile('events/quiz_login.njk');
			}
			const quiz = await dbh.getLiveQuiz(PARAMS.dev ? '2022-11-12' : false);
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
		} catch (error) {
			next(error);
		}
	});
	app.post('/live', async (req, res, next) => {
		try {
			if (!req.loggedIn) {
				if (!PARAMS.userless) req.session.returnTo = req.url;
				return res.renderFile('events/quiz_login.njk');
			}
			if (!handlerContext.liveQuiz) handlerContext.liveQuiz = {};
			const LQ = handlerContext.liveQuiz;
			const quiz = await dbh.getLiveQuiz(PARAMS.dev ? '2022-11-12' : false);
			const QUIZ = quiz.questions;
			const user = await dbh.getUser(req.user._id);
			if (user.permissions?.includes('quizmaster')) {
				const { currentQ, options } = req.body;
				const time = { '10': 20, '5': 15, '3': 12 }[QUIZ[currentQ].points];
				io.sockets.in('waiting-for-live-quiz').emit('question', { currentQ, options, time });
				setTimeout(() => {
					const type = QUIZ[currentQ].options.type;
					const solution = QUIZ[currentQ].solution;
					setTimeout(() => io.sockets.in('waiting-for-live-quiz').emit('answer', {
						answer: Array.isArray(solution) ? solution.join(' / ') : solution,
						type
					}), 2000); // Emit the actual event 3s after
				}, 1000 * (time + 1)); // Extra second to account for lag
				LQ.currentQ = req.body.currentQ;
				LQ.endTime = Date.now() + 1000 * (time + 1);
				res.send('Done');
			} else {
				const answer = req.body.submittedAnswer;
				if (answer === '') return res.error('Missing answer');
				const currentQ = LQ.currentQ ?? - 1;
				const Q = QUIZ[currentQ];
				if (!Q) return res.error('currentQ out of bounds');
				const time = Math.round((LQ.endTime - Date.now()) / 1000);
				if (time < 0) return res.error('Too late!');
				const alreadySubmitted = await dbh.getLiveResult(user._id, quiz.title, currentQ);
				if (alreadySubmitted) return res.error('Already attempted this question!');
				const { points, timeLeft } = await checker.checkLiveQuiz(answer, Q.solution, Q.options.type, Q.points, time);
				const result = points
					? points < Q.points ? 'partial' : 'correct'
					: 'incorrect';
				const functionArgs = [user._id, quiz.title, currentQ, points, answer, timeLeft, result];
				dbh.addLiveResult(...functionArgs).then(() => res.send('Submitted')).catch(e => console.log(e) && res.error(e));
			}
		} catch (error) {
			next(error);
		}
	});
	app.post('/live-end', async (req, res, next) => {
		try {
			if (!req.loggedIn) {
				if (!PARAMS.userless) req.session.returnTo = req.url;
				return res.renderFile('events/quiz_login.njk');
			}
			const user = await dbh.getUser(req.user._id);
			if (!user.permissions.find(perm => perm === 'quizmaster')) throw new Error('Access denied');
			io.sockets.in('waiting-for-live-quiz').emit('end-quiz');
			return res.send('Ended!');
		} catch (error) {
			next(error);
		}
	});
	app.get('/live-results', async (req, res, next) => {
		try {
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
		} catch (error) {
			next(error);
		}
	});
	app.get('/prizes', (req, res, next) => {
		try {
			const prizes = require('./rewards.json');
			return res.renderFile('events/prizes.njk', { prizes });
		} catch (error) {
			next(error);
		}
	});
	app.get('/fandom', (req, res, next) => {
		try {
			return res.error(`...uhh I don't think you're supposed to be here...`);
			// eslint-disable-next-line no-unreachable
			return res.renderFile('fandom_quiz.njk');
		} catch (error) {
			next(error);
		}
	});
	// Assorted other stuff
	app.get('/privacy', (req, res, next) => {
		try {
			res.renderFile('privacy.njk');
		} catch (error) {
			next(error);
		}
	});
	app.get('/terms', (req, res, next) => {
		try {
			res.renderFile('terms.njk');
		} catch (error) {
			next(error);
		}
	});
	app.get('/corsProxy', (req, res, next) => {
		try {
			const base64Url = req.query.base64Url;
			const url = atob(base64Url);
			return axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
				return res.send(response.data);
			});
		} catch (error) {
			next(error);
		}
	});
	app.get('/rebuild', (req, res, next) => {
		try {
			nunjEnv.loaders.forEach(loader => loader.cache = {});
			['./members.json', './posts.json', './rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
			return res.renderFile('rebuild.njk');
		} catch (error) {
			next(error);
		}
	});
	app.post('/git-hook', async (req, res, next) => {
		try {
			const secret = process.env.WEBHOOK_SECRET;
			if (!secret) return res.send('Disabled due to no webhook secret being configured');
			// Validate secret
			const sigHeader = 'X-Hub-Signature-256';
			const signature = Buffer.from(req.get(sigHeader) || '', 'utf8');
			const payload = JSON.stringify(req.body);
			const hmac = crypto.createHmac('sha256', secret);
			const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8');
			if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
				return res.error(new Error(`Request body digest (${digest}) did not match ${sigHeader} (${signature})`));
			}
			const branch = process.env.WEBHOOK_BRANCH;
			if (!branch) return res.send('No branch configured for webhooks');
			if (branch !== 'dev') return res.send('Automatic webhook updates are only enabled on the dev branch');
			await Tools.updateCode();
			res.send('Success!');
			return process.exit(0);
		} catch (error) {
			next(error);
		}
	});
	app.post((req, res) => {
		try {
			// If propagation hasn't stopped, switch to GET!
			return res.redirect(req.url);
		} catch (error) {
			next(error);
		}
	});
	app.use((req, res) => {
		try {
			// Catch-all 404
			res.notFound();
		} catch (error) {
			next(error);
		}
	});
	// Make POST errors show only the data, and GET errors show the page with the error message
	app.use((error, req, res, next) => {
		if (PARAMS.dev) {
			if (req.method === "POST") {
				console.error(error.stack);
			} else if (req.method === "GET") {
				res.status(500).send('404.njk', { message: 'Server error! This may or may not be due to invalid input.' });
			}
		}
	});
}
module.exports = handler;
