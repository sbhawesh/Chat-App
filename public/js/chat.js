var socket = io();

function scrollToBottom () {
  var messages =jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function () {           //listening event
  var params = jQuery.deparam(window.location.search);

  socket.emit('join',params,function(err) {
    if(err){
      alert(err);
      window.location.href = '/';

    } else {
      console.log('No error');

    }

  });
});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);

});

socket.on('newMessage',function (newMessage) {
  var formattedTime = moment(newMessage.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: newMessage.text,
    from: newMessage.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});


jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMesssage',{
    text:messageTextbox.val()
  },function(){
      jQuery('[name=message]').val('');
  });
});

var addPeople = jQuery('#add__people');
addPeople.on('click', function () {
  var params = jQuery.deparam(window.location.search);
  window.location.href = '/add.html';
})

var leaveRoom = jQuery('#leave_room');
leaveRoom.on('click', function () {
    var user = jQuery.deparam(window.location.search);
    socket.emit('leaveRoom',{
      user: user.name
    });
    window.location.href = '/';
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
