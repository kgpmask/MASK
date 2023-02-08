const axios = require('axios');
const { render } = require('nunjucks');
const fs = require('fs').promises;
const path = require('path');

const checker = require('./checker.js');
const dbh = PARAMS.userless ? {} : require('../database/handler');

const handlerContext = {}; // Store cross-request context here


function handler (app, nunjEnv) {
	// TODO: Group these according to some better metric

	app.get(['/', '/home'], async (req, res) => {
		const sample = [{
			name: 'How to get into MASK',
			link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			type: 'youtube',
			attr: ['Parth Mane'],
			date: new Date('Oct 25, 2009'),
			page: '_blank',
			hype: true
		}];
		const allPosts = PARAMS.userless ? sample : await dbh.getPosts();
		const posts = allPosts.splice(0, 7);
		posts.forEach(post => {
			const elapsed = Date.now() - post.date;
			if (!isNaN(elapsed) && elapsed < 7 * 24 * 60 * 60 * 1000) post.recent = true;
		});
		const art = allPosts.filter(post => post.type === 'art' && post.hype).splice(0, 5);
		const vids = allPosts.filter(post => post.type === 'youtube' && post.hype).splice(0, 5);
		return res.renderFile('home.njk', { posts, vids, art });
	});
	app.get('/about', (req, res) => {
		return res.renderFile('about.njk');
	});

	app.get('/art', async (req, res) => {
		const sample = [{
			name: 'Art - Tanjiro Kamado',
			link: '0025.webp',
			type: 'art',
			attr: [ 'Sanjeev Raj Ganji' ],
			date: new Date(1630261800000),
			hype: true
		}];
		const art = PARAMS.userless ? sample : await dbh.getPosts('art');
		return res.renderFile('art.njk', { art });
	});
	app.get('/videos', async (req, res) => {
		const sample = [{ name: 'How to get into MASK', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube' }];
		const vids = PARAMS.userless ? sample : await dbh.getPosts('youtube');
		vids.forEach(vid => vid.embed = `https://www.youtube.com/embed/${vid.link.split('?v=')[1]}?playsinline=1`);
		return res.renderFile('videos.njk', { vids });
	});

	app.get('/apply', (req, res) => {
		return res.renderFile('applications.njk');
	});
	app.get('/submissions', (req, res) => {
		return res.renderFile('submissions.njk');
	});

	app.get('/blog', (req, res) => {
		const url = req.url.replace('^.*?/blog', '');
		// TODO: Fix this!
		return res.redirect(`https://maskiitkgp.blogspot.com${url}.html`);
	});

	app.get('/login', (req, res) => {
		if (res.loggedIn) return res.redirect('/');
		res.renderFile('login.njk');
	});
	app.get('/logout', (req, res) => {
		if (!res.loggedIn) return res.redirect('/login');
		return req.logout(() => res.redirect('/'));
	});
	app.get('/profile', (req, res) => {
		if (!res.loggedIn) return res.redirect('/');
		dbh.getUserStats(req.user._id).then(user => {
			return res.renderFile('profile.njk', {
				name: req.user.name,
				picture: req.user.picture,
				points: user.points,
				quizzes: user.quizData.map(stamp => {
					const months = [
						'-', 'January', 'February', 'March', 'April', 'May', 'June',
						'July', 'August', 'September', 'October', 'November', 'December'
					];
					const [year, month, date] = stamp.quizId.split('-');
					return `${Tools.nth(~~date)} ${months[~~month]}`;
				})
			});
		});
	});

	app.get('/members/:yearName?', (req, res) => {
		const membersData = require('./members.json');
		const yearName = req.params.yearName || membersData[0].name;
		const yearIndex = membersData.findIndex(year => [year.name, year.baseYear].includes(yearName));
		if (yearIndex === -1) return res.notFound();
		const {
			name,
			baseYear,
			teams,
			members
		} = membersData[yearIndex];
		const ctx = { 'Governors': [], 'Former Members': [], 'Research Associate': [] };
		members.sort((a, b) => -(a.name < b.name)).forEach(member => {
			let target;
			if (member.gov) target = 'Governors';
			else if (member.inactive) target = 'Former Members';
			else if (member.RA) target = 'Research Associate';
			else target = `Batch of 20${member.roll.substr(0, 2)}`;
			if (!ctx[target]) ctx[target] = [];
			ctx[target].push({
				name: member.name,
				roll: member.roll,
				href: member.id.startsWith('X') ? 'blank.webp' : `${member.id}.webp`,
				teams: member.teams.map(teamID => {
					const team = teams[teamID.toLowerCase()];
					if (teamID === teamID.toUpperCase()) return { name: team.name, icon: team.icon + '-head' };
					return team;
				})
			});
		});
		const prev = membersData[yearIndex + 1]?.name, next = membersData[yearIndex - 1]?.name;
		const keys = [
			'Governors',
			'Research Associate',
			...Object.keys(ctx).filter(key => key.startsWith('Batch of ')).sort(),
			'Former Members'
		];
		const membersObj = Object.fromEntries(keys.map(key => [key, ctx[key]]));
		const membersTitle = name === membersData[0].name ? 'Our Members' : name;
		return res.renderFile('members.njk', { members: membersObj, membersTitle, prev, next });
	});

	app.get('/newsletters/:target?', (req, res) => {
		const months = [
			'-', 'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		return fs.readdir(path.join(__dirname, '../templates/newsletters')).then(letters => {
			const years = {};
			letters.sort();
			letters.forEach(letter => {
				const [year, month, num] = letter.slice(0, -4).split('-');
				if (!years[year]) years[year] = { title: year, months: {} };
				if (!years[year].months[~~month]) years[year].months[~~month] = { title: months[~~month], issues: [] };
				years[year].months[~~month].issues.push({
					title: ['-', 'First', 'Second', 'Special'][~~num],
					href: letter.slice(0, -4)
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
				const randLetter = letters.filter(letter => letter.slice(0, -4) !== referer).random().slice(0, -4);
				return res.redirect(`/newsletters/${randLetter}`);
			}
			const index = letters.indexOf(target + '.njk');
			if (index === -1) return res.notFound('newsletters_404.njk', { years: renderYears.reverse() });
			const filepath = ['newsletters', letters[index]];
			const adjs = [letters[index - 1]?.slice(0, -4), letters[index + 1]?.slice(0, -4), letters[index].slice(0, -4)];
			return res.renderFile(filepath, { adjs });
		}).catch(err => console.log(err) || res.notFound());
	});

	app.get('/success', (req, res) => {
		// TODO: Rename this to /quiz/success
		return res.renderFile('events/quiz_success.njk');
	});

	app.get('/prizes', (req, res) => {
		const prizes = require('./rewards.json');
		return res.renderFile('events/prizes.njk', { prizes });
	});

	app.get('/corsProxy', (req, res) => {
		const base64Url = req.query.base64Url;
		const url = atob(base64Url);
		return axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
			return res.send(response.data);
		});
	});
	app.get('/rebuild', (req, res) => {
		nunjEnv.loaders.forEach(loader => loader.cache = {});
		['./members.json', './posts.json', './rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
		return res.renderFile('rebuild.njk');
	});

	app.get((req, res) => {
		// Catch-all 404
		res.notFound();
	});

	function get (req, res) {
		const GET = req.url.match(/(?<=\?)[^/]+$/);
		if (GET) req.url = req.url.slice(0, -(GET[0].length + 1));
		const args = req.url.split('/');
		args.shift();
		switch (args[0]) {
			// case 'assets': {
			// 	args.shift();
			// 	const filepath = path.join(__dirname, '../assets', ...args);
			// 	fs.access(filepath).then(err => {
			// 		if (err) res.notFound();
			// 		else res.sendFile(filepath);
			// 	}).catch(() => res.notFound());
			// 	break;
			// }
			case 'quizzes': case 'events': {
				if (!res.loggedIn) {
					if (!PARAMS.userless) req.session.returnTo = req.url;
					return res.renderFile('login.njk');
				}
				dbh.getUserStats(req.user._id).then(user => {
					console.log(user.quizData);
					const quizzed = user.quizData.map(quiz => quiz.quizId) ?? [];
					dbh.getQuizzes().then(qzs => {
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
						if (!args[1]) {
							return res.renderFile('events.njk', {
								quizzed,
								years: renderYears.reverse(),
								locked
							});
						}
						const index = quizzes.indexOf(args[1]);
						if (index === -1) {
							return res.notFound('events/quizzes_404.njk', { years: renderYears.reverse(), quizzed, locked });
						} else if (quizzed.includes(args[1])) return res.renderFile('events/quiz_attempted.njk');
						const adjs = [quizzes[index - 1], quizzes[index + 1], quizzes[index]];
						const QUIZ = QUIZZES[args[1]];
						const quizDate = new Date(QUIZ.unlock).getTime();
						if (quizDate > Date.now()) return res.renderFile('events/quiz_countdown.njk', {
							timeLeft: quizDate - Date.now() + 1000
						});
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
							id: args[1]
						});
					}).catch(res.error);
				}).catch(res.error);
				break;
			}
			case 'live': {
				if (!res.loggedIn) {
					if (!PARAMS.userless) req.session.returnTo = req.url;
					return res.renderFile('events/quiz_login.njk');
				}
				dbh.getLiveQuiz().then(quiz => {
					if (!quiz) return res.renderFile('events/quizzes_404.njk', { message: `The quiz hasn't started, yet!` });
					const QUIZ = quiz.questions;
					dbh.getUser(req.user._id).then(user => {
						if (user.permissions?.includes('quizmaster')) {
							res.renderFile('events/live_master.njk', {
								quiz: JSON.stringify(QUIZ),
								qAmt: QUIZ.length,
								id: 'live'
							});
						} else {
							res.renderFile('events/live_participant.njk', {
								id: 'live',
								userId: req.user._id
							});
						}
					}).catch(res.error);
				}).catch(res.error);
				break;
			}
			case 'live-results': {
				const quizId = new Date().toISOString().slice(0, 10);
				dbh.getAllLiveResults(quizId).then(RES => {
					if (!RES) res.res.notFound();
					const results = [];
					RES.forEach(_RES => {
						if (!results.find(res => res.id === _RES.userId)) results.push({
							id: _RES.userId,
							name: _RES.username,
							points: 0
						});
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
				}).catch(res.error);
				break;
			}
		}
	}
	function post (req, res) {
		const args = req.url.split('/');
		args.shift();

		switch (args[0]) {
			case 'checker': {
				dbh.getNewsletter(args[1]).then(newsletter => {
					const { solutions } = newsletter;
					const response = checker.checkNewsletterPuzzle(args[2], req.body, solutions);
					switch (response) {
						case true: return res.send('correct');
						case false: return res.send('');
						default: return res.send(response);
					}
				}).catch(err => console.log(err));
				break;
			}
			case 'quizzes': {
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
				dbh.getQuizzes().then(qzs => {
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
					res.renderFile('events/quiz_success.njk', { score: points[0], totalScore: points[1] });
					dbh.updateUserQuizRecord({ userId: req.user._id, quizId, score: points[0], time: Date.now() });
				}).catch(res.error);
				break;
			}
			case 'live': {
				if (!handlerContext.liveQuiz) handlerContext.liveQuiz = {};
				const LQ = handlerContext.liveQuiz;
				if (!res.loggedIn) {
					if (!PARAMS.userless) req.session.returnTo = req.url;
					return res.renderFile('events/quiz_login.njk');
				}
				dbh.getLiveQuiz().then(quiz => {
					const QUIZ = quiz.questions;
					dbh.getUser(req.user._id).then(user => {
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
							const { answer } = req.body;
							if (answer === '') throw new Error('Missing answer');
							const currentQ = LQ.currentQ ?? - 1;
							const Q = QUIZ[currentQ];
							if (!Q) throw new Error('currentQ out of bounds');
							const timeLeft = Math.round((LQ.endTime - Date.now()) / 1000);
							if (timeLeft < 0) throw new Error('Too late!');
							dbh.getLiveResult(user._id, quiz.title, currentQ).then(alreadySubmitted => {
								if (alreadySubmitted) throw new Error('Already attempted this question!');
								checker.checkLiveQuiz(answer, Q.solution, Q.options.type, Q.points, timeLeft).then(({
									points, timeLeft
								}) => {
									const result = points
										? points < Q.points ? 'partial' : 'correct'
										: 'incorrect';
									const functionArgs = [user._id, quiz.title, currentQ, points, answer, timeLeft, result];
									dbh.addLiveResult(...functionArgs).catch(res.error);
									res.send('Submitted');
								}).catch(res.error);
							}).catch(res.error);
						}
					}).catch(res.error);
				}).catch(res.error);
				break;
			}
			case 'live-end': {
				dbh.getUser(req.user._id).then(user => {
					if (!user.permissions.find(perm => perm === 'quizmaster')) throw new Error('Access denied');
					io.sockets.in('waiting-for-live-quiz').emit('end-quiz');
					return res.send('Ended!');
				}).catch(res.error);
				break;
			}
			default:
				res.redirect(`/${args.join('/')}`);
				break;
		}
	}
}

module.exports = handler;
