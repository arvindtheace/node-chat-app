const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const port = process.env.PORT || 3300;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    //send a message to the new user who joined
    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app!'));
    
    //send a message to others notifying that a new user has joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined the chat'));

    socket.on('createMessage', (message) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('user was disconnected!');
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

