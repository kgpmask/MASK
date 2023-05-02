require('./env.js').init();

const childProcess = require('child_process');
const express = require('express');
const http = require('http');
const nunjucks = require('nunjucks');
const passport = require('passport');
const path = require('path');

global.Tools = require('./tools.js');
const DB = require('../database/database.js');
const PORT = PARAMS.port ?? require('./config.js').PORT;
const route = require("./route.js");
const socketio = require('socket.io')();
const initMiddleware = require('./middleware.js');

global.app = express();
const waitForDB = PARAMS.mongoless ? Promise.resolve() : DB.init();

const nunjEnv = nunjucks.configure(path.join(__dirname, '../templates'), {
	express: app,
	noCache: PARAMS.dev
});

initMiddleware(app);

route(app, nunjEnv);

const server = http.createServer(app);
global.io = socketio.listen(server);

require('./socket.js');

server.listen(PORT, () => {
	console.log(`The MASK server's up at http://localhost:${PORT}/`);
});

const sass = childProcess.exec(`npx sass assets${PARAMS.dev ? ' --watch' : ''} --no-source-map --style compressed`);

exports.ready = async () => {
	await waitForDB;
};

exports.close = () => {
	server.close();
	sass.kill();
	DB.disconnect();
};
