var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage',() => {
   it('should generate correct message',() => {
     var from = 'Admin';
     var text = 'some message';
     var message = generateMessage(from,text);


     expect(typeof(message.createdAt)).toBe('number');
     expect(message).toContain({from,text});
   });
});

describe('generateLocationMessage',() => {
  it('should generate correct location',() => {
    var from = 'Admin';
    var latitude = 27;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=27,19';
    var message = generateLocationMessage(from,latitude,longitude);
    expect(typeof(message.createdAt)).toBe('number');
    expect(message).toContain({from,url});

  });
});
