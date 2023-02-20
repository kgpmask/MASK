const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	// TODO: Rename this to /quiz/success
	return res.renderFile('events/quiz_success.njk');
});

module.exports = router;
