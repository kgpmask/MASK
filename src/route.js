const fs = require('fs').promises;
const path = require('path');

async function link (app, nunjEnv) {
	// readdir and use routers like a madman
	const routerModules = (await fs.readdir(path.join(__dirname, '../routes'))).filter(file => file.endsWith('.js'));
	routerModules.forEach(module => {
		const { route, router } = require(`../routes/${module}`);
		app.use(route, router);
	});

	app.use('/rebuild', (req, res) => {
		nunjEnv.loaders.forEach(loader => loader.cache = {});
		['./rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
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
		if (req.method === "GET")
			res.renderFile("404.njk", {
				message: "Server error! This may or may not be due to invalid input.",
				pagetitle: "Error"
			});
		else res.send(err.toString());
	});
}

module.exports = link;
