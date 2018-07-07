const expect = require('expect');

const {isRealString} = require('./validator');

describe('isRealString',() => {
  it('should reject non-string value', () => {
    var res = isRealString(13)
    expect(res).toBe(false);
  });
  it('should reject string with spaces', () => {
    var res = isRealString('    ');
    expect(res).toBe(false);
  });
  it('should allow string with no space',() => {
    var res = isRealString(' bhawesh ');
    expect(res).toBe(true);
  });

});
