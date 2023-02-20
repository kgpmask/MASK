const express = require("express");
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', async (req, res) => {
	const sample = [{
		name: 'Art - Tanjiro Kamado',
		link: '0025.webp',
		type: 'art',
		attr: [ 'Sanjeev Raj Ganji' ],
		date: new Date(1630261800000),
		hype: true
	}];
	const art = PARAMS.mongoless ? sample : await dbh.getPosts('art');
	return res.renderFile('art.njk', { art });
});


module.exports = router;
