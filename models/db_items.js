var mysql = require('mysql');
var db_config = require('./db_config');
var dao = require('./db_items_dao');
var pool = mysql.createPool(db_config);

/*
  아이템록조회
  모든 아이템목록을 주면 클라이언트에서 살 수 있는지 없는지 판단
 */
exports.getlist = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    }
    dao.selectItems(conn, callback);
  });
};

//아이템구매
exports.buy = function (data, callback) {
  var success = 1;
  callback(success);
};

//보유아이템조회
exports.own = function (data, callback) {
  var success = 1;
  callback(success);
};

//아이템사용
exports.apply = function (data, callback) {
  var success = 1;
  callback(success);
};