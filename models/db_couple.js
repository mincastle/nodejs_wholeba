//var mysql = require('mysql');
//var db_config = require('./db_config');
var async = require('async');
var dao = require('./db_couple_dao');

//var pool = mysql.createPool(db_config);

/*
 커플요청 Parameter { user_no, auth_phone, user_gender, couple_birth }
  1. 커플 요청을 하면 couple을 생성(couple_birth, auth_phone) 한다.
  2. 요청한 user_no의 couple_no와 gender를 업데이트해준다.
 */

exports.ask = function (data, callback) {

  async.waterfall([function (done) {
      dao.insertMakeCouple(data, done);
    }, function (arg1, done) {
      dao.updateUserGenderandCoupleNo(data, arg1, done);
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
 커플승인 Parameter [user_no, couple_no]
  1. 해당 couple_no에 couple_is를 1로 변경해준다.
  2. 해당 user_no의 couple_no를 업데이트 해준다.
  3. dday 테이블에 couple_birth를 추가시켜준다.
 */
exports.answer = function (data, callback) {

  async.series([function (done) {
      dao.updateCoupleIs(data, done);
    }, function (done) {
      dao.updateUserCoupleNo(data, done);
    }, function (done) {
      dao.insertMakeDday(data, done);
    }],
    function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null);
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