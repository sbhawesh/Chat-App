const path = require('path');
const http = require('http');
const helper = require('@sendgrid/mail');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validator');
const {Users} = require('./utils/users');
const  publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
//console.log(publicPath);

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// app.set('view engine', 'html');
// app.post('/success',(req,res) => {
// 	res.send("Mail Send successfully !!!")
// });

app.post('/join',(req,res) => {
	res.render('join.html');

});
app.post('/add',(req,res) => {
	console.log('in log')
	var user = req.body.usrnm;
	var frm = req.body.email;
	var to = req.body.emailTo;
	var fromEmail = new helper.Email(`${frm}`);
	var toEmail = new helper.Email(`${to}`);
	var subject = 'Join chat room';
	var content = new helper.Content('text/plain', `Join chat from ${user}`);
	var mail = new helper.Mail(fromEmail, subject, toEmail, content);

	// console.log(process.env["SENDGRID_API_KEY"]);
	var sg = require('sendgrid')(process.env["SENDGRID_API_KEY"]);
	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});

	sg.API(request, function (error, response) {
	  if (error) {
	    console.log('Error response received');
			res.send("Unable to send Email");
	  }
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
		//res.redirect('/success');

	});


	res.send('Mail sent successfully');

});


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

	socket.on('leaveRoom',(usr) => {
		var user = users.removeUserByName(usr.user);
		if(user) {
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
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
