/**
 * Created by ProgrammingPearls on 15. 5. 1..
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var pool = mysql.createPool(db_config);


// 오직 insert만 작업하자.
var insert = function (sql, data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('query_err', err);
          callback(err);
        } else {
          console.log('row', row);
          callback(row);
          conn.release();
        }
      });
    }
  });
};

// 오직 한개의 행만 반환하자.
var selectOne = function (sql, data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('query_err', err);
          callback(err);
        } else {
          console.log('row', row);
          callback(row);
          conn.release();
        }
      });
    }
  });
};


exports.insert = insert;
exports.selectOne = selectOne;