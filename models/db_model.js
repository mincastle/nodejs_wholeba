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
      console.error('insert_conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('insert_query_err', err);
          callback(err);
        } else {
          console.log('insert_row', row);
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
      console.error('selOne_conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('selOne_query_err', err);
          callback(err);
        } else {
          console.log('selOne_row', row);
          callback(row);
          conn.release();
        }
      });
    }
  });
};

var select = function (sql, data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('sel_conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, rows) {
        if (err) {
          console.log('sel_query_err', err);
          callback(err);
        } else {
          console.log('sel_row', row);
          callback(rows);
          conn.release();
        }
      });
    }
  });
};

var remove = function (sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('remove_conn_err', err);
      callback(err);
    } else {
      conn.query(sql, function (err, row) {
        if (err) {
          console.log('remove_query_err', err);
          callback(err);
        } else {
          console.log('remove_row', row);
          callback(row);
          conn.release();
        }
      });
    }
  });
};

var update = function (sql, data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('up_conn_err', err);
      callback(err);
    } else {
      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('up_query_err', err);
          callback(err);
        } else {
          console.log('up_row', row);
          callback(row);
          conn.release();
        }
      });
    }
  });
};



exports.insert = insert;
exports.selectOne = selectOne;
exports.select = select;
exports.remove = remove;
exports.update = update;