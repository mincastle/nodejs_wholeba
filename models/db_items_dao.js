/**
 * Created by 장 한솔 on 2015-05-14.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var pool = mysql.createPool(db_config);

//아이템 목록 조회
function selectItems(conn, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  conn.query(sql.selectItems, [], function(err, rows) {
    if(err) {
      done(err);
    } else {
      if(rows.length != 0) {
        //console.log('select items rows : ', rows);
        done(null, rows);
      } else {
        done('아이템목록조회 실패');
      }
    }
  });
}

exports.selectItems = selectItems;