const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const { PORT } = require('./config.js');
const appHandler = require('./handler.js');

global.app = express();

app.get(/.*/, (req, res) => appHandler.get(req, res));
app.post(/.*/, (req, res) => appHandler.post(req, res));

const server = app.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});