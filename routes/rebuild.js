const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	nunjEnv.loaders.forEach(loader => loader.cache = {});
	['../src/members.json', '../src/rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
	return res.renderFile('rebuild.njk');
});

module.exports = router;
