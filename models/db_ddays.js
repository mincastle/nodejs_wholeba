var mysql = require('mysql');
var db_config = require('./db_config');
var pool = mysql.createPool(db_config);
var dao = require('./db_ddays_dao');

//디데이목록조회
exports.getlist = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.selectDdayList(conn, data, callback);
      conn.release();
    }
  });
};

//디데이생성
exports.add = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.insertDday(conn, data, callback);
      conn.release();
    }
  });
};

//디데이수정
exports.modify = function (data, callback) {
  var success = 1;
  callback(success);
};

//디데이삭제
exports.delete = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.deleteDday(conn, data, callback);
      conn.release();
    }
  });
};
