var db_model = require('../models/db_model');
var expect = require('expect.js');

describe('select test', function () {
  var user_phone = '010-1111-1111';
  var sql = "select count(*) as cnt from couple where auth_phone=?";
  var data = [user_phone];
  it('AuthPhone exist', function (done) {
    db_model.selectOne(sql, data, function (output) {
      expect(output[0].cnt).to.be(1);
      done();
    });
  });
});