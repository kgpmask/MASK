const { IgApiClient } = require("instagram-private-api");
const { readFile } = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(readFile);
require("dotenv").config();
const ig = new IgApiClient();
const { google } = require("googleapis");
const Client_id = process.env.CLIENT_ID;
const Client_secret = process.env.CLIENT_SECRET;
const Redirect_uris = process.env.REDIRECT_URIS;
const Refresh_token = process.env.REFRESH_TOKEN;
const { Duplex } = require("stream");

function bufferToStream(buffer) {
	let stream = new Duplex();
	stream.push(buffer);
	stream.push(null);
	return stream;
}

const oauth2Client = new google.auth.OAuth2(
	Client_id,
	Client_secret,
	Redirect_uris
);

oauth2Client.setCredentials({ refresh_token: Refresh_token });

const drive = google.drive({
	version: "v3",
	auth: oauth2Client,
});

const postToInsta = async (files, caption) => {
	try {
		ig.state.generateDevice(process.env.IG_USERNAME);
		await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
		await ig.publish.photo({
			file: files.data,
			caption: caption,
		});
		console.log(caption);
		const file = await drive.files.create({
			requestBody: {
				name: files.name,
				mimeType: files.mimetype,
			},
			media: {
				mimeType: files.mimetype,
				body: bufferToStream(files.data),
			},
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = postToInsta;
