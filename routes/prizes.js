const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const prizes = require('../src/rewards.json');
	return res.renderFile('events/prizes.njk', { prizes });
});

module.exports = router;
