const express = require("express");
const router = express.Router();

const dbh = PARAMS.mongoless ? {} : require('../database/handler');

router.get('/', async (req, res) => {
	if (!req.loggedIn) return res.redirect('/');
	const user = await dbh.getUserStats(req.user._id);
	return res.renderFile('profile.njk', {
		name: req.user.name,
		picture: req.user.picture,
		points: user.points,
		quizzes: user.quizData.map(stamp => {
			const months = [
				'-', 'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'
			];
			const [year, month, date] = stamp.quizId.split('-');
			return `${Tools.nth(~~date)} ${months[~~month]}`;
		})
	});
});


module.exports = router;
