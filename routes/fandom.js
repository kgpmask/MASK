const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	return res.error(`...uhh I don't think you're supposed to be here...`);
	// eslint-disable-next-line no-unreachable
	return res.renderFile('fandom_quiz.njk');
});

module.exports = router;
