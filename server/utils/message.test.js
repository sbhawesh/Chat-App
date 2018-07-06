var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage',() => {
   it('should generate correct message',() => {
     var from = 'bhawesh';
     var text = 'some message';
     var message = generateMessage(from,text);

     expect(typeof(message.createdAt)).toBe('number');
     expect(message).toInclude({from,text});
   });
});
