const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	return res.renderFile('submissions.njk');
});

module.exports = router;
