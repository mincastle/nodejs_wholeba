/**
 * Created by ProgrammingPearls on 15. 5. 4..
 */
var sql = require('./db_sql');
var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//커플 승인 후, couple테이블의 auth_phone, couple_birth 업데이트
function UpdateCoupleIs (data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
    }
    var datas = [data.auth_phone, data.couple_birth, data.couple_no];
    conn.query(sql.updateAuthandBirth, datas, function (err, row) {
      //console.log('updateCoupleIs_row', row);
      if (err) {
        conn.release();
        done(err);
      } else if (row.affectedRows == 0) {
        done('정상적으로 업데이트 되지 않았습니다.');
      } else {
        done(null);
      }
      conn.release();
    });
  });
}

function UpdateUserGender (data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
    }
    var datas = [data.user_gender, data.user_no];
    conn.query(sql.updateUserGender, datas, function (err, row) {
      //console.log('updateUserGender_row', row);
      if (err) {
        done(err);
        conn.release();
        return;
      } else if (row.affectedRows == 0) {
        done('정상적으로 업데이트 되지 않았습니다.');
      } else {
        done(null);
      }
      conn.release();
    });
  });
};

exports.UpdateCoupleIs = UpdateCoupleIs;
exports.UpdateUserGender = UpdateUserGender;
