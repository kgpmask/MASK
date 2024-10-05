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
					{ name: 'Error', value: `${err}` },
					{ name: 'Commit', value: `\`${commit.id.slice(0, 7)}\` ${commit.message}` }
				]
			}
		]
	};
	await axios.post(webhookLink, webhookObject);
	return 'Success';
}

async function submissionHook(data) {
	const webhookLink = hooks.submission;
	const dataTypes = {
	  'dig-art': 'Digital Art',
	  'trd-art': 'Traditional Art',
	  'amv-vid': 'AMV Video',
	  'ani-vid': 'Animation Video',
	  'ins-mus': 'Instrumental Music',
	  'voc-mus': 'Vocal Music'
	};
	
	const timestamp = new Date(data.date).toLocaleString('en-GB', {
	  year: 'numeric',
	  month: '2-digit',
	  day: '2-digit',
	  hour: '2-digit',
	  minute: '2-digit',
	  second: '2-digit',
	});
  
	const webhookObject = {
	  embeds: [
		{
		  title: `Submission: ${dataTypes[data.type]}`,
		  fields: [
			{ name: 'Email', value: `${data.email}` },
			{ name: 'Name', value: `${data.name}` },
			{ name: 'Link', value: `[Submission Link](${data.link})` },
			{ name: 'Member of KGP', value: `${data.member ? 'Yes' : 'No'}`, inline: true },
			{ name: 'Proof', value: `${data.proof ?? 'Not provided'}`, inline: true },
			{ name: 'Social Media Handle', value: `${data.social ?? 'Not provided'}`, inline: true },
			{ name: 'Timestamp', value: `${timestamp}` }
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

