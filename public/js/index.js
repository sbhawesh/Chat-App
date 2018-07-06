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
  var formattedTime = moment(newMessage.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMesssage',{
    from:'User',
    text:messageTextbox.val()
  },function(){
      jQuery('[name=message]').val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser!');
  }
  locationButton.attr('disabled','disabled').text('sending...');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function () {
    alert('Unable to fetch location');
    locationButton.removeAttr('disabled').text('Send location');
  });
});
