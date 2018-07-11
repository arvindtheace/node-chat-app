const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3300;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    //send a message to the new user who joined
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'welcome to the chat app!',
        createdAt: new Date().getTime()
    });
    
    //send a message to others notifying that a new user has joined
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'new user joined the chat',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('disconnect', () => {
        console.log('user was disconnected!');
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

