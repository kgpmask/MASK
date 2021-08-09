const fs = require('fs').promises;
const path = require('path');

function notFound (res) {
	res.status(404).render(path.join(__dirname, '../templates', '404.njk'));
}

function handler (app, env, vapid) {
	function get (req, res) {
		const args = req.url.split('/');
		args.shift();
		switch (args[0]) {
			case '': {
				res.render(path.join(__dirname, '../templates', 'home.njk'));
				break;
			}
			case 'assets': {
				args.shift();
				const filepath = path.join(__dirname, '../assets', ...args);
				fs.access(filepath).then(err => {
					if (err) notFound(res);
					else res.sendFile(filepath);
				}).catch(() => notFound(res));
				break;
			}
			case 'rebuild': {
				env.loaders.forEach(loader => loader.cache = {});
				res.render(path.join(__dirname, '../templates', 'rebuild.njk'));
				break;
			}
			case 'newsletters': {
				const months = [
					'-', 'January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'
				];
				if (!args[1]) {
					fs.readdir('./templates/newsletters').then(letters => {
						const years = {};
						letters.sort();
						letters.forEach(letter => {
							const [year, month, num] = letter.slice(0, -4).split('-');
							if (!years[year]) years[year] = { title: year, months: {} };
							if (!years[year].months[month]) years[year].months[month] = { title: months[~~month], issues: [] };
							years[year].months[month].issues.push({
								title: ['-', 'First', 'Second', 'Special'][~~num],
								href: letter.slice(0, -4)
							});
						});
						const renderYears = Object.values(years);
						renderYears.forEach(year => year.months = Object.values(year.months));
						res.render(path.join(__dirname, '../templates', 'newsletters.njk'), {
							years: renderYears.reverse()
						});
					});
					break;
				}
			}
			default: {
				while (!args[args.length - 1]) args.pop();
				const isAsset = /\.(?:js|ico)$/.test(args[args.length - 1]);
				const filepath = path.join(
					__dirname,
					isAsset ? '../assets' : '../templates', path.join(...args) + (isAsset ? '' : '.njk')
				);
				fs.access(filepath).then(err => {
					if (err) notFound(res);
					else res[isAsset ? 'sendFile' : 'render'](filepath);
				}).catch(() => notFound(res));
				
			}
		}
	}
	function post (req, res) {
		// no POST routes currently in use
		// redirect to GET
		return res.redirect(req.url);
	}

	app.get(/.*/, (req, res) => get(req, res));
	app.post(/.*/, (req, res) => post(req, res));

	// VAPID will be required for push notifications
}

module.exports = handler;