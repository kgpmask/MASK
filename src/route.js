const artRouter = require("../routes/art");
const checkerRouter = require("../routes/checker");
const corsProxyRouter = require("../routes/corsProxy");
const fandomRouter = require("../routes/fandom");
const gitHookRouter = require("../routes/gitHook");
const homeRouter = require("../routes/home");
const liveRouter = require("../routes/live");
const membersRouter = require("../routes/members");
const miscRouter = require("../routes/misc");
const newsletterRouter = require("../routes/newsletter");
const profileRouter = require("../routes/profile");
const quizzesRouter = require("../routes/quizzes");
const rebuildRouter = require("../routes/rebuild");
const userRouter = require("../routes/user");
const videosRouter = require("../routes/videos");

function link (app) {
	const smallerRoutes = ["/about", "/apply", "/blog", "/prizes", "/submissions", "/success"];
	const userRoutes = ["/login", "/logout"];

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

	app.use('/art', artRouter);
	app.use('/checker', checkerRouter);
	app.use('/corsProxy', corsProxyRouter);
	app.use('/fandom', fandomRouter);
	app.use('/git-hook', gitHookRouter);
	app.use('/', homeRouter);
	app.use('/home', homeRouter);
	app.use('/live', liveRouter);
	app.use('/members', membersRouter);
	app.use('/newsletters', newsletterRouter);
	app.use('/profile', profileRouter);
	app.use(['/quizzes', '/events'], quizzesRouter);
	app.use('/rebuild', rebuildRouter);
	app.use('/videos', videosRouter);

	app.use((err, req, res, next) => {
		if (PARAMS.dev) console.error(err.stack);
		// Make POST errors show only the data, and GET errors show the page with the error message
		res.status(500).renderFile('404.njk', { message: 'Server error! This may or may not be due to invalid input.' });
	});

	app.post((req, res) => {
		// If propagation hasn't stopped, switch to GET!
		return res.redirect(req.url);
	});
	app.use((req, res) => {
		// Catch-all 404
		console.log("404... so...");
		res.notFound();
	});
}

module.exports = link;
