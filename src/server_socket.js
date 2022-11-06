//function,passed it in port of server
const io = require('socket.io')(/*server port*/6969,{
    cors: {
        origin: ['//client port link'] //quiz-master client
    }
})

//function that runs every single time a client connects to our server,gives a socket instance for each
io.on('connection', socket => {
    socket.on('data',() => {
        socket.broadcast.emit('recieve-data',/*data*/) //send to every other socket other than quiz-master one
        console.log(data)
    })
})