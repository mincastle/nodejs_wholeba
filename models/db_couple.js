//var mysql = require('mysql');
//var db_config = require('./db_config');
var async = require('async');
var dao = require('./db_couple_dao');

//var pool = mysql.createPool(db_config);

/*
 커플요청 Parameter { user_no, auth_phone, user_gender }
  1. 커플 요청을 하면 couple을 생성(couple_birth, auth_phone) 한다.
  2. 요청한 user_no의 couple_no와 gender, user_req를 업데이트해준다. (요청 했음을 기억하기 위해서)
 */

exports.ask = function (data, callback) {

  async.waterfall([function (done) {
      dao.insertMakeCouple(data, done);
    }, function (arg1, done) {
      dao.updateUserGenderandCoupleNoandUserReq(data, arg1, done);
    }],
    function (err, insertId) {
      if (err) {
        callback(err);
      } else {
        callback(null, insertId);
      }
    });
};

/*
 커플승인 Parameter [user_no]
  1. 커플 요청을 받은 사람인지 확인한 후, 조회한 couple_id를 갖고 온다.
  2. 해당 couple_no에 couple_is를 1로 변경해준다.
  3. 승인한 user의 couple_no, user_gender(남->여, 여->남), user_req를 업데이트 해준다.
 */
exports.answer = function (data, callback) {

  async.waterfall([function (done) {
      dao.selectCheckAnswerCouple(data, done);
    },function (couple_no, done) {
      dao.updateCoupleIs(couple_no, done);
    }, function (couple_no, done) {
      dao.selectOtherGender(couple_no, data, done);
    }, function (couple_no, other_gender, done) {
      dao.updateUserCoupleNoandGenderandUserReq(couple_no, other_gender, data, done);
    }],
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
  });
};

//커플정보조회
exports.getinfo = function (data, callback) {
  var success = 1;
  callback(success);
};

//내기분변경
exports.mycondition = function (data, callback) {
  var success = 1;
  callback(success);
};

//상대방격려하기
exports.yourcondition = function (data, callback) {
  var success = 1;
  callback(success);
};