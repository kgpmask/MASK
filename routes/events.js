const router = require('express').Router();

router.get('/', (req, res) => {
	return res.renderFile('event-articles/py_events.njk');
});

router.get('/qatq', (req, res) => {
	return res.renderFile('event-articles/qatq.njk');
});

router.get('/seekers-quest', (req, res) => {
	return res.renderFile('event-articles/seekers-quest.njk');
});

router.get('/cosplay23', (req, res) => {
	return res.renderFile('event-articles/cosplay23.njk');
});

router.get('/intrasoc', (req, res) => {
	return res.renderFile('event-articles/intrasoc.njk');
});

router.get('/suzume', (req, res) => {
	return res.renderFile('event-articles/suzumetrip.njk');
});

router.get('/gear-5-screening', (req, res) => {
	return res.renderFile('event-articles/gear-5-screening.njk');
});

router.get('/ocaq-2023', (req, res) => {
	return res.renderFile('event-articles/ocaq-2023.njk');
});

router.get('/bidoof-art', (req, res) => {
	return res.renderFile('event-articles/bidoof-art.njk');
});

router.get('/intrasoc-2024', (req, res) => {
	return res.renderFile('event-articles/intrasoc-2024.njk');
})

module.exports = {
	route: '/events',
	router
};
