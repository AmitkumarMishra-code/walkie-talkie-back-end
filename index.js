var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: { origin: '*' }
});

let connectedUsers = []

io.on('connection', (socket) => {
    console.log('a user connected with socketId: ' + socket.id);

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('username', (username) => {
        socket.emit('list', connectedUsers)
        connectedUsers.push({
            id: socket.id,
            username: username
        })
        socket.broadcast.emit('list', connectedUsers)

        console.log(connectedUsers)
    })
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.id !== socket.id)
        socket.broadcast.emit('list', connectedUsers)
    })
});
http.listen(4000, () => {
    console.log('listening on *:4000');
});