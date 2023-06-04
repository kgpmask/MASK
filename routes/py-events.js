const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	return res.renderFile("event-articles/py_events.njk");
});

router.get('/qatq', (req, res) => {
	return res.renderFile("event-articles/qatq.njk");
});

router.get('/seekers-quest', (req, res) => {
	return res.renderFile("event-articles/seekers-quest.njk");
});

router.get('/cosplay23', (req, res) => {
	return res.renderFile("event-articles/cosplay23.njk");
});

router.get('/intrasoc', (req, res) => {
	return res.renderFile("event-articles/intrasoc.njk");
});

router.get('/suzume', (req, res) => {
	return res.renderFile("event-articles/suzumetrip.njk");
});

module.exports = router;
