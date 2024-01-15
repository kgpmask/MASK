const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/:target?', async (req, res) => {
	const target = req.params.target;
	const letters = require('../src/newsletter_desc.json').sort((a, b) => -(new Date(a.link) > new Date(b.link)));

	if (!target) return res.renderFile('newsletters.njk', { letters: letters });
	else if (target === 'random') {
		const referer = req.headers.referer?.split('/').pop();
		const randLetter = letters
			.map((letter) => letter.link)
			.filter((letter) => letter !== referer)
			.random();
		return res.redirect(`/newsletters/${randLetter}`);
	} else {
		if (!letters.find((letter) => letter.link === target)) return res.notFound('newsletters_404.njk', { letters });
		const index = letters.findIndex((letter) => letter.link === target);
		const adjs = [index - 1, index + 1, index].map((i) => letters[i]);
		const pages = (await fs.readdir(path.join('__dirname', `../templates/newsletters/${target}`)))
			.filter((file) => file.includes('#'));
		const targetpage = req.query.page;

		return res.renderFile(`newsletters/${target}/${target}.njk`,
			{ adjs, pages, target, targetpage }
		);
	}
});

router.post('/update-count', async (req, res) => {
	const { newsletterId } = req.body;

	try {
		await dbh.updateNewsletterCount(newsletterId);
		return res.status(200).json({ success: true, message: 'View count updated successfully' });
	} catch (error) {
		console.error('Error updating view count:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

module.exports = {
	route: '/newsletters',
	router
};
