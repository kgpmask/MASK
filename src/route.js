const checkerRouter = require("../routes/checker");
const corsProxyRouter = require("../routes/corsProxy");
const govPortalRouter = require("../routes/govportal");
const gitHookRouter = require("../routes/git-hook");
const homeRouter = require("../routes/home");
const liveRouter = require("../routes/live");
const mediaRouter = require("../routes/media");
const membersRouter = require("../routes/members");
const miscRouter = require("../routes/misc");
const newsletterRouter = require("../routes/newsletter");
const pollRouter = require("../routes/polls");
const profileRouter = require("../routes/profile");
const quizzesRouter = require("../routes/quizzes");
const userRouter = require("../routes/user");

function link (app, nunjEnv) {
	const smallerRoutes = ["/about", "/apply", "/blog", "/prizes", "/submissions", "/success", "/privacy", "/terms"];
	const userRoutes = ["/login", "/logout"];
	const mediaRoutes = ["/art", "/videos"];

	app.use('/', (req, res, next) => {
		if (req.url in smallerRoutes) {
			next();
		} else {
			next('route');
		}
	}, miscRouter);

	app.use('/', (req, res, next) => {
		if (req.url in userRoutes) {
			next();
		} else {
			next('route');
		}
	}, userRouter);

	app.use('/', (req, res, next) => {
		if (req.url in mediaRoutes) {
			next();
		} else {
			next('route');
		}
	}, mediaRouter);

	app.use('/checker', checkerRouter);
	app.use('/corsProxy', corsProxyRouter);
	app.use('/git-hook', gitHookRouter);
	app.use('/gov-portal', govPortalRouter);
	app.use('/', homeRouter);
	app.use('/home', homeRouter);
	app.use('/live', liveRouter);
	app.use('/members', membersRouter);
	app.use('/newsletters', newsletterRouter);
	app.use('/polls', pollRouter);
	app.use('/profile', profileRouter);
	app.use(['/quizzes', '/events'], quizzesRouter);
	app.use('/rebuild', (req, res) => {
		nunjEnv.loaders.forEach(loader => loader.cache = {});
		['./members.json', './rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
		return res.renderFile('rebuild.njk');
	});

	app.use('/error', async () => {
		throw new Error('Sensitive error');
	});


	app.use((req, res, next) => {
		// If propagation hasn't stopped, switch to GET!
		if (req.method === "POST") {
			return res.redirect(req.url);
		}
		next();
	});
	app.use((req, res, next) => {
		// Catch-all 404
		res.notFound();
	});

	app.use((err, req, res, next) => {
		if (PARAMS.dev) console.error(err.stack);
		// Make POST errors show only the data, and GET errors show the page with the error message
		res.status(500);
		if (req.method === 'GET') res.renderFile('404.njk', { message: 'Server error! This may or may not be due to invalid input.' });
		else res.send(err.toString());
	});
}

module.exports = link;
