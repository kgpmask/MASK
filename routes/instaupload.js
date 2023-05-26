const { IgApiClient } = require("instagram-private-api");
require("dotenv").config();
const ig = new IgApiClient();
const { google } = require("googleapis");
const data = require("../src/credentials.json");
const Client_id = data.CLIENT_ID;
const Client_secret = data.CLIENT_SECRET;
const Redirect_uris = data.REDIRECT_URIS;
const Refresh_token = data.REFRESH_TOKEN;
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

const postToInsta = async (files, caption, type) => {
	try {
		ig.state.generateDevice(data.IG_USERNAME);
		await ig.simulate.preLoginFlow();
		await ig.account.login(data.IG_USERNAME, data.IG_PASSWORD);
		if (type == "image") {
			await ig.publish.photo({
				file: files.image.data,
				caption: caption,
			});
			await drive.files.create({
				requestBody: {
					name: files.image.name,
					mimeType: files.image.mimetype,
				},
				media: {
					mimeType: files.image.mimetype,
					body: bufferToStream(files.data),
				},
			});
		} else if (type == "reel") {
			await ig.publish.video({
				video: files.reel.data,
				coverImage: files.image.data,
				caption: caption,
			});
			await drive.files.create({
				requestBody: {
					name: files.reel.name,
					mimeType: files.reel.mimetype,
				},
				media: {
					mimeType: files.reel.mimetype,
					body: bufferToStream(files.data),
				},
			});
			await drive.files.create({
				requestBody: {
					name: "cover image of" + files.reel.name.split(".")[0] + ".jpg",
					mimeType: files.image.mimetype,
				},
				media: {
					mimeType: files.image.mimetype,
					body: bufferToStream(files.data),
				},
			});
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

module.exports = postToInsta;
