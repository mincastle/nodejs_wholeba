/**
 * Created by 장 한솔 on 2015-05-17.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var pool = mysql.createPool(db_config);

//여성사용자가 공개여부설정
//data = {user_no, user_public}
function updateUserPublic(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_public, data.user_no];
  conn.query(sql.updateUserPublic, params, function(err, row) {
    if(err) {
      done(err);
    } else {
      if(row.affectedRows == 1) {
        done(null);
      } else {
        done('공개설정여부 등록 실패');
      }
    }
  });
}

exports.updateUserPublic = updateUserPublic;