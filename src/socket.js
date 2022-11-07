io.on('connection', socket => {
	if (socket.handshake.query.userId) socket.userId = socket.handshake.query.userId;
	socket.join('waiting-for-live-quiz');
});
