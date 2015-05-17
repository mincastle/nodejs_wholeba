var mysql = require('mysql');
var db_config = require('./db_config');
var dao = require('./db_setting_dao');

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

//여성정보조회
exports.herself = function (data, callback) {
  var success = 1;
  callback(success);
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