const fs = require('fs').promises;
const path = require('path');
const tools = require('./tools.js');

function handler (app, env, vapid) {
	function get (req, res) {
		function notFound (custom404, ctx) {
			res.status(404).render(path.join(__dirname, '../templates', custom404 || '404.njk'), ctx);
		}
		function tryFile (path, asset, ctx) {
			fs.access(path).then(err => {
				if (err) notFound(false, ctx);
				else res[asset ? 'sendFile' : 'render'](path, ctx);
			}).catch(() => {
				notFound(false, ctx);
			});
			
		}
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
					if (err) notFound();
					else res.sendFile(filepath);
				}).catch(() => notFound());
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
				fs.readdir('./templates/newsletters').then(letters => {
					const years = {};
					letters.sort(); // Windows isn't automatically sorted
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
					if (!args[1]) return res.render(path.join(__dirname, '../templates', 'newsletters.njk'), {
						years: renderYears.reverse()
					});
					if (args[1] === 'random') {
						const referer = req.headers.referer?.split('/').pop();
						const randLetter = letters.filter(letter => letter.slice(0, -4) !== referer).random().slice(0, -4);
						return res.redirect(`/newsletters/${randLetter}`);
					}
					const index = letters.indexOf(args[1] + '.njk');
					if (index === -1) return notFound('newsletters_404.njk', { years: renderYears.reverse() });
					const filepath = path.join(__dirname, '../templates', 'newsletters', letters[index]);
					const adjs = [letters[index - 1]?.slice(0, -4), letters[index + 1]?.slice(0, -4), letters[index].slice(0, -4)];
					return res.render(filepath, { adjs });
				}).catch(err => console.log(err) || notFound());
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
		// no POST routes currently in use
		// redirect to GET
		return res.redirect(req.url);
	}

	app.get(/.*/, (req, res) => get(req, res));
	app.post(/.*/, (req, res) => post(req, res));

	// VAPID will be required for push notifications
}

module.exports = handler;