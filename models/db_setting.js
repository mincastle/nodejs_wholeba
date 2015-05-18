var mysql = require('mysql');
var db_config = require('./db_config');
var dao = require('./db_setting_dao');
var async = require('async');

var pool = mysql.createPool(db_config);

//여성사용자가 공개여부설정
//data = {user_no, user_public}
exports.setPublic = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      dao.updateUserPublic(conn, data, callback);
    }
    conn.release();
  });
};

/*
  여성정보조회
  1. 여자면 패스, 남자면 여자user_no 조회
  2. 여성정보조회
  data={user_no, couple_no, user_gender}
 */
exports.herself = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      async.waterfall(
        [
          function(done) {
            //여자번호와 공개설정여부 조회
            dao.selectHerUserNo(conn, data, done);
          },
          function(userinfo, done) {
            //userinfo = {user_no, remale_no, female_public, user_gender, couple_no}
            //여성정보조회
            dao.selectHersInfo(conn, data, done);
          }
        ],
        function(err, result) {
          //result = [[{period_no, start, end, cycle}],
          // {user_pills, pills_no, pills_date, pills_time}]
          if(err) {
            callback(err);
          } else if (result) {
            console.log('get her info result : ', result);
            callback(null, result);
          } else {
            callback('여성정보조회 실패');
          }
        }
      );
    }
    conn.release();
  });
};

//주기수정
exports.updatePeriod = function (data, callback) {
  var success = 1;
  callback(success);
};

//qna전송
exports.qna = function (data, callback) {
  var success = 1;
  callback(success);
};