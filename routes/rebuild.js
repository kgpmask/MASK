const express = require("express");
const router = express.Router();

// TODO - Will do this later i promise
// router.get('/rebuild', (req, res) => {
// 	nunjEnv.loaders.forEach(loader => loader.cache = {});
// 	['./members.json', './posts.json', './rewards.json'].forEach(cache => delete require.cache[require.resolve(cache)]);
// 	return res.renderFile('rebuild.njk');
// });

module.exports = router;
