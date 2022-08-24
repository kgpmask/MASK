const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const login = require('./login.js');
const dbh = PARAMS.userless ? {} : require('../database/database_handler.js');

if (!PARAMS.userless) login.init();

function handler (app, env) {

	// Pre-routing
	if (!PARAMS.userless) {
		app.get('/login/federated/google', passport.authenticate('google'));
		app.get('/oauth2/redirect/google', passport.authenticate('google', {
			successReturnToOrRedirect: '/',
			failureRedirect: '/login'
		}));
	}

	app.use((req, res, next) => {
		res.renderFile = (files, ctx) => {
			if (!Array.isArray(files)) files = [files];
			return res.render(path.join(__dirname, '../templates', ...files), ctx);
		};
		next();
	});

	app.use((req, res, next) => {
		res.locals.userless = PARAMS.userless;
		next();
	});

	function get (req, res) {
		function notFound (custom404, ctx) {
			res.status(404).renderFile(custom404 || '404.njk', ctx);
		}
		function tryFile (path, asset, ctx) {
			fs.access(path).then(err => {
				if (err) notFound(false, ctx);
				else res[asset ? 'sendFile' : 'render'](path, ctx);
			}).catch(() => {
				notFound(false, ctx);
			});
		}
		const loggedIn = res.locals.loggedIn = Boolean(req.user);
		const GET = req.url.match(/(?<=\?)[^/]+$/);
		if (GET) req.url = req.url.slice(0, -(GET[0].length + 1));
		const args = req.url.split('/');
		args.shift();
		switch (args[0]) {
			case '': case 'home': {
				const posts = require('./posts.json').filter(post => post.type !== 'video' || post.show === '').slice(0, 7);
				posts.forEach(post => {
					const elapsed = Date.now() - Date.parse(post.date.replace(/(?<=^\d{1,2})[a-z]{2}/, '').replace(/,/, ''));
					if (!isNaN(elapsed) && elapsed < 7 * 24 * 60 * 60 * 1000) post.recent = true;
				});
				const vids = require('./posts.json').filter(post => {
					return post.type === 'video' && post.hype && post.link.includes('www.youtube.com');
				}).shuffle().slice(0, 5);
				const art = require('./posts.json').filter(post => post.type === 'art' && post.hype).slice(0, 5);
				res.renderFile('home.njk', { posts, vids, art });
				break;
			}
			case 'art': {
				const art = require('./posts.json').filter(post => post.type === 'art');
				res.renderFile('art.njk', { art });
				break;
			}
			case 'assets': {
				args.shift();
				const filepath = path.join(__dirname, '../assets', ...args);
				fs.access(filepath).then(err => {
					if (err) notFound();
					else res.sendFile(filepath);
				}).catch(() => notFound());
				break;
			}
			case 'blog': {
				args.shift();
				const url = `https://maskiitkgp.blogspot.com/${args.join('/')}.html`;
				res.redirect(url);
				break;
			}
			case 'login': {
				if (loggedIn) return res.redirect('/');
				res.renderFile('login.njk');
				break;
			}
			case 'logout': {
				if (!loggedIn) return res.redirect('/login');
				req.logout();
				res.redirect('/');
				break;
			}
			case 'members': {
				const membersData = require('./members.json');
				if (!args[1]) args[1] = membersData[0].name;
				const yearIndex = membersData.indexOf(year => [year.name, year.baseYear].includes(args[1]));
				if (yearIndex === -1) return notFound();
				const {
					name,
					baseYear,
					teams,
					members
				} = membersData[yearIndex];
				const ctx = { 'Governors': [], 'Former Members': [] };
				members.forEach(member => {
					let target;
					if (member.gov) target = 'Governors';
					else if (member.inactive) target = 'Former Members';
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
				const prev = yearIndex !== 0, next = yearIndex !== membersData.length - 1;
				const keys = ['Governors', ...Object.keys(ctx).filter(key => key.startsWith('Batch of ')).sort(), 'Former Members'];

				res.renderFile('members.njk', {
					members: Object.fromEntries(keys.map(key => [key, ctx[key]])),
					membersTitle: name === membersData[0].name ? 'Our Members' : name,
					prev,
					next
				});
				break;
			}
			case 'newsletters': {
				const months = [
					'-', 'January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'
				];
				fs.readdir(path.join(__dirname, '../templates/newsletters')).then(letters => {
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
					if (!args[1]) return res.renderFile('newsletters.njk', {
						years: renderYears.reverse()
					});
					if (args[1] === 'random') {
						const referer = req.headers.referer?.split('/').pop();
						const randLetter = letters.filter(letter => letter.slice(0, -4) !== referer).random().slice(0, -4);
						return res.redirect(`/newsletters/${randLetter}`);
					}
					const index = letters.indexOf(args[1] + '.njk');
					if (index === -1) return notFound('newsletters_404.njk', { years: renderYears.reverse() });
					const filepath = ['newsletters', letters[index]];
					const adjs = [letters[index - 1]?.slice(0, -4), letters[index + 1]?.slice(0, -4), letters[index].slice(0, -4)];
					return res.renderFile(filepath, { adjs });
				}).catch(err => console.log(err) || notFound());
				break;
			}
			case 'profile': {
				if (!loggedIn) return res.redirect('/');
				dbh.getUser(req.user._id).then(user => {
					return res.renderFile('profile.njk', {
						name: req.user.name,
						picture: req.user.picture,
						points: user.points,
						quizzes: Object.keys(user.quizData || {}).map(stamp => {
							const months = [
								'-', 'January', 'February', 'March', 'April', 'May', 'June',
								'July', 'August', 'September', 'October', 'November', 'December'
							];
							const [year, month, date] = stamp.split('-');
							return `${Tools.nth(~~date)} ${months[~~month]}`;
						})
					});
				});
				break;
			}
			case 'quizzes': case 'events': {
				if (!loggedIn) {
					if (!PARAMS.userless) req.session.returnTo = req.url;
					return res.renderFile('quiz_login.njk');
				}
				dbh.getUser(req.user._id).then(user => {
					const quizzed = Object.keys(user.quizData || {});
					const QUIZZES = require('./quiz.json');
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
					if (!args[1]) {
						const now = Date.now();
						return res.renderFile('events.njk', {
							quizzed,
							years: renderYears.reverse(),
							locked: Object.entries(QUIZZES).filter(([_, quiz]) => new Date(quiz.unlock).getTime() > now).map(k => k[0])
						});
					}
					const index = quizzes.indexOf(args[1]);
					if (index === -1) return notFound('quizzes_404.njk', { years: renderYears.reverse() });
					if (quizzed.includes(args[1])) return res.renderFile('quiz_attempted.njk');
					const adjs = [quizzes[index - 1], quizzes[index + 1], quizzes[index]];
					const QUIZ = QUIZZES[args[1]];
					const quizDate = new Date(QUIZ.unlock).getTime();
					if (quizDate > Date.now()) return res.renderFile('quiz_countdown.njk', {
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
					return res.renderFile('_quiz.njk', {
						adjs,
						questions: JSON.stringify(questions),
						qAmt: questions.length,
						id: args[1]
					});
				});
				break;
			}
			case 'rebuild': {
				env.loaders.forEach(loader => loader.cache = {});
				['./members.json', './posts.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
				delete require.cache[require.resolve('./quiz.json')];
				res.renderFile('rebuild.njk');
				break;
			}
			case 'videos': {
				const vids = require('./posts.json');
				const youtubeVids = vids.filter(vid => vid.link.includes('www.youtube.com'));
				const instaVids = vids.filter(vid => vid.link.includes('www.instagram.com'));
				res.renderFile('videos.njk', { youtubeVids, instaVids });
				break;
			}


			case 'corsProxy': {
				const base64Url = req.query.base64Url;
				const url = atob(base64Url);
				axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
					return res.send(response.data);
				});
				break;
			}


			default: {
				while (!args[args.length - 1]) args.pop();
				const isAsset = /\.(?:js|ico)$/.test(args[args.length - 1]);
				const filepath = path.join(
					__dirname,
					isAsset ? '../assets' : '../templates', path.join(...args) + (isAsset ? '' : '.njk')
				);
				tryFile(filepath, isAsset);
			}
		}
	}
	function post (req, res) {
		const args = req.url.split('/');
		args.shift();

		switch (args[0]) {
			case "checker": {
				const checker = require('./checker.js');
				const correct = checker.compare(args[2], args[1], req.body); // req.data
				switch (correct) {
					case true: {
						res.send("correct");
						break;
					}
					case false: {
						res.send("");
						break;
					}
					default: {
						res.send(correct);
						break;
					}
				}
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
				const QUIZZES = require('./quiz.json');
				if (!QUIZZES.hasOwnProperty(quizId)) return res.status(400).send('Invalid Quiz ID');
				const QUIZ = QUIZZES[quizId];
				QUIZ.random.forEach(randDef => {
					const keys = shuffle(Object.keys(randDef.from)).slice(0, randDef.amount);
					solutions.push(...keys.map(key => QUIZ.questions[randDef.from[key]].solution));
				});
				shuffle(solutions);
				const answers = Array.from({ length: solutions.length }).map((_, i) => ~~req.body[`answer-${i + 1}`]);
				const points = [answers.filter((ans, i) => ~~ans === ~~solutions[i]).length, solutions.length];
				res.renderFile('quiz_success.njk', { score: points[0], totalScore: points[1] });
				const dbh = require('../database/database_handler');
				dbh.updateUserQuizRecord({ userId: req.user._id, quizId, score: points[0], time: Date.now() });
				break;
			}
			default:
				res.redirect(`/${args.join('/')}`);
				break;
		}
	}

	app.get(/.*/, (req, res) => get(req, res));
	app.post(/.*/, (req, res) => post(req, res));
}

module.exports = handler;
