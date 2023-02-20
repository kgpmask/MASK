const express = require("express");
const router = express.Router();

const checker = require('../src/checker.js');
const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.post('/:newsletter/:puzzleType', async (req, res) => {
	const { solutions } = await dbh.getNewsletter(req.params.newsletter);
	const response = checker.checkNewsletterPuzzle(req.params.puzzleType, req.body, solutions);
	switch (response) {
		case true: return res.send('correct');
		case false: return res.send('');
		default: return res.send(response);
	}
});

module.exports = router;
