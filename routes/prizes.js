const router = require('express').Router();

router.get('/', (req, res) => {
	const prizes = require('../src/rewards.json');
	return res.renderFile('events/prizes.njk', { prizes });
});

module.exports = {
	route: '/prizes',
	router
};
