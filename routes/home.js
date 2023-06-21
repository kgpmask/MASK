const router = require('express').Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');
const sample = require('../src/samples/posts');

router.get('/', async (req, res) => {

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

module.exports = {
	route: ['/home', '/'],
	router
};
