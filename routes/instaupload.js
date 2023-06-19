const { IgApiClient } = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);
require('dotenv').config();
const ig = new IgApiClient();
const postToInsta = async (files) => {
	try {
		ig.state.generateDevice(process.env.IG_USERNAME);
		await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

		await ig.publish.photo({
			file: files.data,
			caption: 'Really nice photo from the internet!'
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = postToInsta;
