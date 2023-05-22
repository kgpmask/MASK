const dbh = require('../database/handler');

const router = require('express').Router();

// Route for opening poll or poll list
router.get('/:pollId?', async (req, res) => {
	if (!req.loggedIn) return res.redirect('/login');
	const pollId = req.params.pollId;
	const activePolls = await dbh.getActivePolls();
	if (!pollId) return res.renderFile('poll_list.njk', {
		activePolls,
		message: !activePolls.length ? 'No polls active right now' : undefined
	});
	const poll = activePolls.find(poll => poll._id === pollId);
	if (!poll) return res.notFound('Poll unavailable');
	const votedFor = poll.records.find(record => record.votes.find(voter => voter === req.user._id))?.value;
	return res.renderFile('poll_vote.njk', { poll, votedFor });

	// TLDR: Check if pollId exists in path
	// If not, render list of polls awailable
	// Else, check if the pollId is valid
	// If not, 404. Else, render poll
});

// Route for updating vote in poll
router.post('/', async (req, res) => {
	// Need to add validation
	await dbh.updatePoll({
		pollId: req.body.pollId,
		userId: req.user._id,
		userChoice: req.body.userChoice
	});
	return res.send('Successfully voted.');
});

// Route for displaying poll results
router.get('/results/:id?', async (req, res) => {
	const pollId = req.params.id;
	if (!pollId) return res.notFound('No ID given.');
	const activePolls = await dbh.getActivePolls();
	const poll = activePolls.find(poll => poll._id === pollId);
	if (!poll) return res.notFound('No poll with this ID.');
	return res.renderFile('poll_results.njk', {
		_id: pollId,
		title: poll.title,
		records: poll.records.map(record => {
			return {
				value: record.value,
				votes: record.votes.length
			};
		}).sort((a, b) => -(a.votes > b.votes))
	});
});

module.exports = router;