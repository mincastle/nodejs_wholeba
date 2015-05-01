var mysql = require('mysql');
var db_config = require('./db_config');
var pool = mysql.createPool(db_config);


var join = function (sql, data, callback) {
  var output = {"success" : "0"};
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('conn_err', err);
      output.result.message = err;
      callback(output);
    } else {
      conn.query(sql, datas, function (err, row) {
        if (err) {
          console.log('query_err', err);
          output.result.message = err;
        } else {
          console.log('row', row);
          if(row.affectedRows == 1) {
            output.success = 1;
            output.result.message = ' 성공';
          }
          callback(output);
          conn.release();
        }
      });
    }
  });
};

//회원가입
exports.insert = insert;

//가입정보조회
exports.join_info = function (data, callback) {
  var success = 1;
  callback(success);
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
