io.on('connection', socket => {
	socket.join('waiting-for-live-quiz');
	console.log(socket);
});
