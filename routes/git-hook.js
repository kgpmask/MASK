const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Tools = require("../src/tools");

router.post('/', async (req, res) => {

	// Console log git hook requests
	console.log(`git-hook request sent at: ${new Date()}`);
	const pushBranch = req.body.ref.split('/')[2];
	console.log(`\tRef branch: ${pushBranch}\n\tHead commit: ${req.body.head_commit?.message}`);
	// Validate secret
	const secret = process.env.WEBHOOK_SECRET;
	if (!secret) return res.send('Disabled due to no webhook secret being configured');
	const sigHeader = 'X-Hub-Signature-256';
	const signature = Buffer.from(req.get(sigHeader) || '', 'utf8');
	const payload = JSON.stringify(req.body);
	const hmac = crypto.createHmac('sha256', secret);
	const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8');
	if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
		return res.error(new Error(`Request body digest (${digest}) did not match ${sigHeader} (${signature})`));
	}
	const branch = process.env.WEBHOOK_BRANCH;
	if (!branch) return res.send('No branch configured for webhooks');
	if (branch !== 'dev' && branch !== 'main') {
		return res.send('Automatic webhook updates are only enabled on dev and main branch');
	}
	// We don't need it to restart unless the branch is same
	if (branch !== pushBranch) return res.send('Not for current docker.');
	res.send('Hook received. Starting code update.');
	// Note: This needs to be inside a timeout with a hook to Discord if it fails
	await new Promise(async (resolve, reject) => {
		setTimeout(() => reject(new Error('60 seconds time out')), 60_000);
		await Tools.updateCode();
		return resolve('Successfully updated');
	});
	console.log('Code updated. Restarting.');
	return process.exit(0);
});

module.exports = router;
