const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	return res.renderFile("py_events.njk");
});

router.get('/cosplay23', (req, res) => {
	return res.renderFile("cosplay23.njk");
});

router.get('/intrasoc', (req, res) => {
	return res.renderFile("intrasoc.njk");
});

router.get('/qatq', (req, res) => {
	return res.renderFile("qatq.njk");
});

module.exports = router;
