const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/art', async (req, res) => {
	const sample = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/samples/media.json"), 'utf8'));
	const art = PARAMS.mongoless ? sample : await dbh.getPosts('art');
	return res.renderFile('art.njk', { art });
});

router.get('/videos', async (req, res) => {
	const sample = [{ name: 'How to get into MASK', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube' }];
	const vids = PARAMS.mongoless ? sample : await dbh.getPosts('youtube');
	vids.forEach(vid => vid.embed = `https://www.youtube.com/embed/${vid.link.split('?v=')[1]}?playsinline=1`);
	return res.renderFile('videos.njk', { vids });
});


module.exports = router;
