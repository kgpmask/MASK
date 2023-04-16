const express = require('express');
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', async (req, res) => {
	const sample = [
		{
			name: 'How to get into MASK',
			link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			type: 'youtube',
			attr: ['Parth Mane'],
			date: new Date('Oct 25, 2009'),
			page: '_blank',
			hype: true
		},
		{
			name: 'Art - Tanjiro Kamado',
			link: '0025.webp',
			type: 'art',
			attr: ['Sanjeev Raj Ganji'],
			date: new Date(1630261800000),
			hype: true
		},
		{
			name: 'Art - Saitama',
			link: '0019.webp',
			type: 'art',
			attr: ['Garima Mendhe'],
			date: new Date(1628879400000),
			hype: true
		},
		{
			name: 'Art - Kirigakure Shinobi Massacre',
			link: '0012.webp',
			type: 'art',
			attr: ['Arpit Das'],
			date: new Date(1589308200000),
			hype: true
		},
		{
			name: 'Art - Garou',
			link: '0008.webp',
			type: 'art',
			attr: ['Pritam Mallick'],
			date: new Date(1572220800000),
			hype: true
		},
		{
			name: '「AMV」Phantasy Star Online 2 - Symphony',
			link: 'https://www.youtube.com/watch?v=GX7TAigwZPw',
			type: 'youtube',
			attr: ['Hrishabh Kumar Tundwar'],
			date: new Date(1673289000000),
			hype: true
		},
		{
			name: '「AMV」The Garden of Words - A Thousand Years',
			link: 'https://www.youtube.com/watch?v=9W4eyQ7LP7g',
			type: 'youtube',
			attr: ['Hrishabh Kumar Tundwar'],
			date: new Date(1673289000000),
			hype: true
		},
		{
			name: '「AMV」Assassination Classroom - Heathens',
			link: 'https://www.youtube.com/watch?v=unITcghHNVI',
			type: 'youtube',
			attr: ['Chiranjeet Mishra'],
			date: new Date(1673289000000),
			hype: true
		}
	];
	const allPosts = PARAMS.mongoless ? sample : await dbh.getPosts();
	const posts = PARAMS.mongoless ? allPosts.splice(0, 2) : allPosts.splice(0, 7);
	posts.forEach(post => {
		const elapsed = Date.now() - post.date;
		if (!isNaN(elapsed) && elapsed < 7 * 24 * 60 * 60 * 1000) post.recent = true;
	});
	const toBeDisplayed = PARAMS.mongoless ? 3 : 5;
	const art = allPosts.filter(post => post.type === 'art' && post.hype).splice(0, toBeDisplayed);
	const vids = allPosts.filter(post => post.type === 'youtube' && post.hype).splice(0, toBeDisplayed);
	return res.renderFile('home.njk', { posts, vids, art });
});

module.exports = router;
