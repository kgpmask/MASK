const express = require('express');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');
const sample = require('../src/samples/posts');

router.get('/art', async (req, res) => {
	const art = PARAMS.mongoless ? sample.filter(post => post.type === 'art') : await dbh.getPosts('art');
	return res.renderFile('art.njk', { art });
});

router.get('/videos', async (req, res) => {
	const vids = PARAMS.mongoless ? sample.filter(post => post.type === 'youtube') : await dbh.getPosts("youtube");
	vids.forEach((vid) => {
		vid.embed = `https://www.youtube.com/embed/${vid.link.split('?v=')[1]}?playsinline=1`;
	});
	return res.renderFile('videos.njk', { vids });
});


module.exports = router;
