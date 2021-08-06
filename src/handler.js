const fs = require('fs').promises;
const path = require('path');

function notFound (res) {
	res.status(404).sendFile(path.join(__dirname, '../views', '404.html'));
}

const handler = {
	get: (req, res) => {
		const args = req.url.split('/');
		args.shift();
		switch (args[0]) {
			case '': {
				res.sendFile(path.join(__dirname, '../views', 'home.html'));
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
			default: {
				const isAsset = /\.(?:js|ico)$/.test(args[args.length - 1]);
				const filepath = path.join(__dirname, isAsset ? '../assets' : '../views', path.join(...args) + (isAsset ? '' : '.html'));
				fs.access(filepath).then(err => {
					if (err) notFound(res);
					else res.sendFile(filepath);
				}).catch(() => notFound(res));
				
			}
		}
	},
	post: (req, res) => {
		// no POST routes currently in use
		// redirect to GET
		return res.redirect(req.url);
	}
}

module.exports = handler;