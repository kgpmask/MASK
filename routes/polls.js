const dbh = require('../database/handler');

const router = require('express').Router();

router.get('/:pollId?', async (req, res) => {
	if (!req.loggedIn) return res.redirect('/login');
	const pollId = req.params.pollId;
	const activePolls = await dbh.getActivePolls();
	if (!pollId) return res.renderFile('poll_list.njk', { activePolls });
	if (!activePolls.find(poll => poll._id === pollId)) return res.notFound('Poll unavailable');
	return res.renderFile('poll_vote.njk', { poll: activePolls.find(poll => poll._id === pollId) });

	// TLDR: Check if pollId exists in path
	// If not, render list of polls awailable
	// Else, check if the pollId is valid
	// If not, 404. Else, render poll
});

router.post('/', async (req, res) => {
	await dbh.updatePoll({
		pollId: req.body.pollId,
		userId: req.user._id,
		userChoice: req.body.choice
	});
	return res.send("Successfully voted.");
});

module.exports = router;
