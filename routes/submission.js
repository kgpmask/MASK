const router = require('express').Router();

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
	const data = req.body.data;
	if (!data.email) return res.send({ success: false, message: 'No email has been provided. Please check again.' });
	if (!data.name) return res.send(
		{ success: false, message: 'No name has been provided. Use "Anonymous" if you do not want to share your name.' }
	);
	if (!data.member) return res.send({ success: false, message: 'Select whether you are a member of IIT Kharagpur or not.' });
	if (!data.type) return res.send({ success: false, message: 'Select the type of content you are submitting.' });
	if (!data.link) return res.send({ success: false, message: 'No link has been provided.' });
	if (!data.proof) delete data.proof;
	if (!data.social) delete data.social;
	try {
		response = await dbh.addSubmission(data);
		return res.send({ success: true, message: 'Successfully Added', response: response });
	} catch (e) {
		console.log(e);
		return res.send({ success: false, message: 'Error while adding' });
	}
	// Add a Discord hook to send a message in case of new submission
});

module.exports = {
	route: '/submissions',
	router
};
