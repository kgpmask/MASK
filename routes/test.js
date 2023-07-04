const router = require('express').Router();

router.get('/', (req, res) => {
	res.renderFile('test.njk');
});

module.exports = {
	route: '/test',
	router
};
