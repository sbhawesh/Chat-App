const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const  publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));
//console.log(publicPath);

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) => {
	console.log("new user!!");

 socket.emit('newMessage',{
	 text:"from server hey bhawesh!!"
 });

	socket.on('createMesssage',(Messsage) => {
		console.log("message : ",Messsage);
	});

	socket.on('disconnect',() => {
		console.log("user was disconnected");
	});
});

server.listen(port,() => {
	console.log(`server is running on ${port}`);
});
