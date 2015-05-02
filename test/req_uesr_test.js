var db_model = require('../models/db_model');
var expect = require('expect.js');
var db_sqlscript = require('../models/db_sqlscript');

describe('First Join Test', function () {
  var cnt;

  var couple_no;
  var user_id = 'aaaa';
  var user_pw = 'aaaa';
  var user_phone = '010-1111-1111';
  var user_regid = 'regreg';

  beforeEach('AuthPhone exist', function (done) {
    var data = [user_phone];
    db_model.remove(db_sqlscript.sqlClearUser, function (output) {
      db_model.remove(db_sqlscript.sqlClearCouple, function (output) {
        db_model.selectOne(db_sqlscript.sqlFindAuth, data, function (output) {
          expect(output[0].cnt).to.be(0);
          db_model.insert(db_sqlscript.sqlSaveCouple, [], function (output) {
            expect(output.affectedRows).to.be(1);
            couple_no = output.insertId;
            done();
          });
        });
      });
    });
  });

  it('Join', function (done) {
    var data = [couple_no, user_id, user_pw, user_phone, user_regid];
    db_model.insert(db_sqlscript.sqlSaveReqUser, data, function (output) {
      done();
    });
  });

  afterEach('couple ask', function () {
    var auth_phone = '010-2222-2222'; // 요쳥할 전화번호
    var data = [auth_phone, couple_no];
    describe('asd', function () {
      it('asd', function (done) {
        db_model.update(db_sqlscript.sqlUpdateAuth, data, function (output) {
          expect(output.affectedRows).to.be(1);
          done();
        });
      });
    });
  });
});

//describe('Insert ReqUser Test' , function () {
//  var couple_no = '15', user_id = req.body.user_id, user_pw = req.body.user_pw
//    , user_phone = req.body.user_phone, user_regid = req.body.user_id.user_regid;
//
//  var data = [couple_no, user_id, user_pw, user_phone, user_regid];
//  it('')
//  db_model.insert(db_sqlscript.sqlSaveReqUser, data, function (output) {
//    res.json({"result": output});
//  });
//});
