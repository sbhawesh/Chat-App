var socket = io();

socket.on('connect',function () {           //listening event
  console.log("connected to server");

  socket.emit('createMesssage',{
    text:"hello"
  });
});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function (newMessage) {
  console.log("new message :",newMessage);
});
