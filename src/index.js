const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const socket = require('./sockets');

const app = express();
const server = http.createServer(app)
const io = socketio.listen(server);

// DB connection
mongoose.connect('mongodb://localhost/chat-database')
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err))

// Settings
app.set('port', process.env.PORT || 4000)

socket(io);

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Starting the server
server.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
})