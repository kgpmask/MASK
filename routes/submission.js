const router = require('express').Router();
const hooks = require('../src/hooks');
const dbh = require('../database/handler');

router.get('/', (req, res) => {
	if (PARAMS.mongoless) return res.status(403).renderFile('404.njk', {
		pagetitle: 'Method not allowed',
		message: 'This method is not permitted in mongoless mode.'
	});
	return res.renderFile('submissions.njk');
});

router.post('/', async (req, res) => {
	if (PARAMS.mongoless) return res.status(403).send('Not allowed in mongoless');
	// req.body = { email, name, member, link, proof, social }
	const data = req.body;
	// discord hook for submission form data
	dbh.addSubmission(data).then(async submission => await hooks.submissionHook(submission));
	return res.status.send;
});

module.exports = {
	route: '/submissions',
	router
};
