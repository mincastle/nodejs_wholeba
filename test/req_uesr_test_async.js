var db_model = require('../models/db_model');
var expect = require('expect.js');
var db_sqlscript = require('../models/db_sqlscript');
var async = require('async');

describe('First Join Test', function () {
  var user_id = 'aaaa';
  var user_pw = 'aaaa';
  var user_phone = '010-1111-1111';
  var user_regid = 'regreg';

  it('join', function (done) {
    var data = [user_phone];

    async.waterfall([
      function (callback) {
        db_model.remove(db_sqlscript.sqlClearUser, function (output) {
          callback(null);
        });
      }, function (callback) {
        db_model.remove(db_sqlscript.sqlClearCouple, function (output) {
          callback(null);
        });
      }, function (callback) {
        db_model.selectOne(db_sqlscript.sqlFindAuth, data, function (output) {
          expect(output[0].cnt).to.be(0);
          callback(null, output[0].cnt);
        });
      }, function (arg1, callback) {
        db_model.insert(db_sqlscript.sqlSaveCouple, [], function (output) {
          expect(output.affectedRows).to.be(1);
          callback(null, output.insertId);
        });
      }, function (arg1, callback) {
        var data = [arg1, user_id, user_pw, user_phone, user_regid];
        db_model.insert(db_sqlscript.sqlSaveReqUser, data, function (output) {
          callback(null, arg1);
          done();
        });
      }, function (arg1, callback) {
        var auth_phone = '010-2222-2222'; // 요쳥할 전화번호
        var data = [auth_phone, arg1];
        db_model.update(db_sqlscript.sqlUpdateAuth, data, function (output) {
          expect(output.affectedRows).to.be(1);
          callbak(null);
        });
      }
    ], function (err, results) {
      done();
    });
  });
});