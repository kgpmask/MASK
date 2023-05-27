const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Tools = require("../src/tools");

router.post('/', async (req, res) => {
	console.log(`git-hook request sent at: ${new Date()}`);
	const pushBranch = req.body.ref.split('/')[2];
	console.log(`\tRef branch: ${pushBranch}`);
	console.log(`\tHead commit: ${ref.body.head_commit?.message}`);
	const secret = process.env.WEBHOOK_SECRET;
	if (!secret) return res.send('Disabled due to no webhook secret being configured');
	// Validate secret
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

	if (branch !== pushBranch) return res.send('Not for current docker.');
	await Tools.updateCode();
	console.log('Code updated. Sending response.');
	res.send('Success!');
	return process.exit(0);
});

module.exports = router;
