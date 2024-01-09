const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');
const NewsletterCount = require('../models/NewsletterCount');

router.get('/:target?', async (req, res) => {
	const target = req.params.target;
	const letters = require('../src/newsletter_desc.json').sort((a, b) => -(new Date(a.link) > new Date(b.link)));

	const getViewCountFromLocalStorage = (target) => {
		const viewCountKey = `viewCount_${target}`;
		return parseInt(localStorage.getItem(viewCountKey)) || 0;
	};

	const updateViewCountInLocalStorage = (target, count) => {
		const viewCountKey = `viewCount_${target}`;
		localStorage.setItem(viewCountKey, count.toString());
	};

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

		const newsletterCount = await NewsletterCount.findOneAndUpdate(
			{ _id: target }, { $inc: { count: 1 } }, { new: true, upsert: true }
		);

		const viewCountFromLocalStorage = getViewCountFromLocalStorage(target);

		updateViewCountInLocalStorage(target, viewCountFromLocalStorage + 1);

		return res.renderFile(`newsletters/${target}/${target}.njk`,
			{ adjs, pages, target, targetpage, viewCount: newsletterCount.count }
		);
	}
});

module.exports = {
	route: '/newsletters',
	router
};
