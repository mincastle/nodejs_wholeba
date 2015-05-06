/**
 * Created by ProgrammingPearls on 15. 5. 6..
 */
var moment = require('moment');
var expect = require('expect.js');

// mocha test
describe('mement test', function () {
  it('YYYY-MM-DD format', function (done) {
    expect(moment('Sun Mar 01 2015 00:00:00 GMT+0000 (UTC)').format('YYYY-MM-DD')).to.be('2015-03-01');
    done();
  });
});

