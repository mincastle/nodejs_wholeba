var db_model = require('../models/db_model');
var expect = require('expect.js');
var db_sqlscript = require('../models/db_sqlscript');

describe('SelectOne Test', function () {
  var user_phone = '010-1111-1111';
  var data = [user_phone];
  it('AuthPhone exist', function (done) {
    db_model.selectOne(db_sqlscript.sqlFindAuth, data, function (output) {
      expect(output[0].cnt).to.be(1);
      done();
    });
  });
});