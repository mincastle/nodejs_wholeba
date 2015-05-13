var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);
var dao = require('./db_love_dao');

//러브목록조회
exports.getlist = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {

    }
  });
};

//러브생성
exports.add = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.insertLoves(conn, data, callback);
    }
  });
};

//러브수정
exports.modify = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.updateLoves(conn, data, callback);
    }
  });
};

//러브삭제
exports.delete = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      dao.deleteLoves(conn, data, callback);
    }
  });
};
