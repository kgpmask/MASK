const { IgApiClient } = require("instagram-private-api");
require("dotenv").config();
const ig = new IgApiClient();
const postToInsta = async (file) => {
	try {
		ig.state.generateDevice(process.env.IG_USERNAME);
		await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

		await ig.publish.photo({
			file: file.buffer,
			caption: "Really nice photo from the internet!",
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = postToInsta;
