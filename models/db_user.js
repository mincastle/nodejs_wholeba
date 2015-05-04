var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');

var pool = mysql.createPool(db_config);

//회원가입
exports.join = function (data, callback) {
  var success = 1;
  callback(success);
};

//가입정보조회
exports.join_info = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      callback(err, null);
    }
    conn.query(sql.selectUserJoinInfo, data, function (err, row) {
      if (err) {
        callback(err, null);
        conn.release();
        return;
      }
      console.log('row', row);
      conn.release();
      callback(null, row[0]);
    });
  });
};

//공통정보등록
exports.common = function (data, callback) {
  var success = 1;
  callback(success);
};

//여성정보등록
exports.woman = function (data, callback) {
  var success = 1;
  callback(success);
};

//로그인
exports.login = function (data, callback) {
  var success = 1;
  callback(success);
};

//사용자기본값조회
exports.userinfo = function (data, callback) {
  var success = 1;
  callback(success);
};

//로그아웃
exports.logout = function (data, callback) {
  var success = 1;
  callback(success);
};

//회원탈퇴
exports.withdraw = function (data, callback) {
  var success = 1;
  callback(success);
};
