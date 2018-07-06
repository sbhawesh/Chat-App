const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const {generateMessage,generateLocationMessage} = require('./utils/message');
const  publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));
//console.log(publicPath);

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) => {
	console.log("new user!!");

 socket.emit('newMessage', generateMessage('Admin','welcome to chat App'));


 socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));


	socket.on('createMesssage',(Messsage,callback) => {
		console.log("message : ",Messsage);
		io.emit('newMessage',generateMessage(Messsage.from,Messsage.text));
		callback(' from Server');

	});

	socket.on('createLocationMessage',(coords) => {
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
	});

	socket.on('disconnect',() => {
		console.log("user was disconnected");
	});
});

server.listen(port,() => {
	console.log(`server is running on ${port}`);
});
