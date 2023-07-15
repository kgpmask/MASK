const axios = require('axios');
const hooks = !PARAMS.discordless ? JSON.parse(process.env.DISCORD_HOOKS) : {};

async function deployErrorHook (env, commit, err) {
	// env: prod | dev
	const webhookLink = hooks.deploy;
	const webhookObject = {
		embeds: [
			{
				title: `Deploy failed in ${env}`,
				fields: [
					{
						name: 'Error',
						value: `${err}`
					},
					{
						name: 'Commit',
						value: `\`${commit.id.slice(0, 7)}\` ${commit.message}`
					}
				]
			}
		]
	};
	await axios.post(webhookLink, webhookObject);
	return 'Success';
}

async function submissionHook (data) {
	const webhookLink = hooks.submission;
	const webhookObject = {
		embeds: [
			{
				title: `Submission: ${data.type}`,
				fields: [
					{
						name: 'Email',
						value: `${data.email}`
					},
					{
						name: 'Name',
						value: `${data.name}`
					},
					{
						name: 'Member',
						value: `${data.member}`
					},
					{
						name: 'Proof',
						value: `${data.proof ? true : false}`
					},
					{
						name: 'Link',
						value: `[Submission Link](${data.link})`
					}
				]
			}
		]
	};
	await axios.post(webhookLink, webhookObject);
	return 'Success';
}


module.exports = {
	deployErrorHook,
	submissionHook
};

