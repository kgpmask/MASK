const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

router.get('/:target?', async (req, res) => {
	const target = req.params.target;
	const letters = require('../src/newsletter_desc.json').sort((a, b) => a < b ? 1 : -1);
	if (!target) return res.renderFile('newsletters.njk', { letters: letters });
	else if (target === 'random') {
		const referer = req.headers.referer?.split('/').pop();
		const randLetter = letters.map(letter => letter.link).filter(letter => letter !== referer).random();
		return res.redirect(`/newsletters/${randLetter}`);
	} else {
		if (!letters.find(letter => letter.link === target)) return res.notFound('newsletters_404.njk', { letters });
		const index = letters.findIndex(letter => letter.link === target);
		const adjs = [index - 1, index + 1, index].map(i => letters[i]);
		const pages = (await fs.readdir(path.join('__dirname', `../templates/newsletters/${target}`)))
			.filter(file => file.includes('#'));
		const targetpage = req.query.page;
		return res.renderFile(`newsletters/${target}/${target}.njk`, { adjs, pages, target, targetpage });
	}
});

module.exports = {
	route: '/newsletters',
	router
};
