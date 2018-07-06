var socket = io();

socket.on('connect',function () {           //listening event
  console.log("connected to server");

  // socket.emit('createMesssage',{
  //   from:"bhawesh",
  //   text:"hello"
  // });
});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function (newMessage) {
  console.log("new message :",newMessage);
  var li = jQuery('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);

  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();

  socket.emit('createMesssage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){

  });
});
