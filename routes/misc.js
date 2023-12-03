const router = require('express').Router();

router.get('/about', (req, res) => {
	return res.renderFile('about.njk');
});

// router.get('/apply', (req, res) => {
// 	return res.redirect('https://forms.gle/Sy7f7Yueyw9m1Ei1A');
// });

router.use('/blog', (req, res) => {
	const url = req.url.replace(/^.*?\/blog/, '');
	// TODO: Fix this!
	return res.redirect(`https://maskiitkgp.blogspot.com${url}.html`);
});

router.get('/prizes', (req, res) => {
	const prizes = require('../src/rewards.json');
	return res.renderFile('events/prizes.njk', { prizes });
});


router.get('/success', (req, res) => {
	// TODO: Rename this to /quiz/success
	return res.renderFile('events/quiz_success.njk');
});

router.get('/privacy', (req, res) => {
	res.renderFile('privacy.njk');
});

router.get('/terms', (req, res) => {
	res.renderFile('terms.njk');
});

router.get('/test-api', (req, res) => {
	return Math.random() < 0.5 ? res.status(400).end() : res.status(200).send(Math.random() >= 0.5 ? 'Heads' : 'Tails');
});

module.exports = {
	route: '/',
	router
};
