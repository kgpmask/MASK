const router = require('express').Router();
const axios = require('axios');

router.get('/', (req, res) => {
	const base64Url = req.query.base64Url;
	const url = atob(base64Url);
	return axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
		return res.send(response.data);
	});
});

module.exports = {
	route: '/corsProxy',
	router
};
