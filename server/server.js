const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validator');
const {Users} = require('./utils/users');
const  publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));
//console.log(publicPath);

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection',(socket) => {
	console.log("new user!!");



 socket.on('join',(params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
			return callback('name and room are required');
		}
    socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id,params.name,params.room);

		io.to(params.room).emit('updateUserList',users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin','welcome to chat App'));
	  socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
		callback();
 });


	socket.on('createMesssage',(Messsage,callback) => {
		//console.log("message : ",Messsage);
		var user = users.getUser(socket.id);
		if(user && isRealString(Messsage.text)) {
			io.to(user.room).emit('newMessage',generateMessage(user.name,Messsage.text));
		}

		callback();

	});

	socket.on('createLocationMessage',(coords) => {
		var user = users.getUser(socket.id);
		if(user)
		{
		  io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));	
		}

	});

	socket.on('disconnect',() => {
		var user = users.removeUser(socket.id);

		if(user) {
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));

		}
	});
});

server.listen(port,() => {
	console.log(`server is running on ${port}`);
});
