/**
 * Created by ProgrammingPearls on 15. 5. 4..
 */
var sql = require('./db_sql');
var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//커플 승인 후, couple 테이블에서 couple 생성
function insertMakeCouple (data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
    }
    var datas = [data.couple_birth, data.auth_phone];
    conn.query(sql.insertMakeCouple, datas, function (err, row) {
      //console.log('updateCoupleIs_row', row);
      if (err) {
        conn.release();
        done(err);
      } else if (row.affectedRows == 0) {
        done('정상적으로 업데이트 되지 않았습니다.');
      } else {
        done(null, row.insertId);
      }
      conn.release();
    });
  });
}
//function UpdateCoupleIs (data, done) {
//  pool.getConnection(function (err, conn) {
//    if (err) {
//      console.log('connection err', err);
//      done(err);
//    }
//    var datas = [data.auth_phone, data.couple_birth, data.couple_no];
//    conn.query(sql.updateAuthandBirth, datas, function (err, row) {
//      //console.log('updateCoupleIs_row', row);
//      if (err) {
//        conn.release();
//        done(err);
//      } else if (row.affectedRows == 0) {
//        done('정상적으로 업데이트 되지 않았습니다.');
//      } else {
//        done(null);
//      }
//      conn.release();
//    });
//  });
//}

function updateUserGenderandCoupleNo (data, insertId, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
    }
    var datas = [data.user_gender, insertId, data.user_no];
    conn.query(sql.updateUserGenderandCoupleNo, datas, function (err, row) {
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

exports.insertMakeCouple = insertMakeCouple;
exports.updateUserGenderandCoupleNo = updateUserGenderandCoupleNo;
