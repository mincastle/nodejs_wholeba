//var mysql = require('mysql');
//var db_config = require('./db_config');
var async = require('async');
var dao = require('./db_couple_dao');

//var pool = mysql.createPool(db_config);

/*
 커플요청 Parameter [user_no, couple_no, couple_date, auth_phone, user_gender]
 1. user의 user_gender를 업데이트 해준다.
 2. 생성된 couple의 couple_date, auth_phone을 업데이트 한다.
 */

exports.ask = function (data, callback) {

  async.parallel([function (done) {
      dao.UpdateCoupleIs(data, done);
    }, function (done) {
      dao.UpdateUserGender(data, done);
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