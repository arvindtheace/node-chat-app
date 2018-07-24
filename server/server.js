const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const port = process.env.PORT || 3300;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');



    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name are required');
        }

        socket.join(params.room);
        //if they were a part of any other rooms, remove them
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        //send a message to the new user who joined
        socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app!'));

        //send a message to others notifying that a new user has joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the chat`));

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('user was disconnected!');
        var user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

