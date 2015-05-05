//var mysql = require('mysql');
//var db_config = require('./db_config');
var async = require('async');
var dao = require('./db_couple_dao');

//var pool = mysql.createPool(db_config);

/*
 커플요청 Parameter [user_no, couple_no, couple_date, auth_phone, user_gender]
 1. 커플 요청을 하면 couple을 생성(couple_birth, auth_phone) 한다.
 2. 요청한 user_no의 couple_no와 gender를 업데이트해준다.
 */

exports.ask = function (data, callback) {

  async.waterfall([function (done) {
      dao.insertMakeCouple(data, done);
    }, function (arg1, done) {
      dao.updateUserGenderandCoupleNo(data, arg1, done);
    }],
    function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
};

/*
 커플승인 Parameter [user_no, couple_no]
 1. couple의 couple_is를 1로 수정한다.
 TODO : 커플 승인 안하면...???
 */
exports.answer = function (data, callback) {
  var success = 1;
  callback(success);
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