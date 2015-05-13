/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */
var sql = require('./db_sql');

function insertLoves (conn, data, done) {
  var datas;
  if (data.loves_date) {
    datas = [data.couple_no, data.loves_condom, data.loves_date];
  } else {
    datas = [data.couple_no, data.loves_condom];
  }

  conn.query(sql.insertLoves(data.loves_date), datas, function (err, row) {
    if(err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        done(null, row);
      } else {
        done('love가 생성되지 않았습니다!');
      }
    }
  });
}

function updateLoves (conn, data, done) {
  var datas = [data.loves_condom, data.loves_date, data.couple_no, data.loves_no];

  conn.query(sql.updateLoves, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        done(null);
      } else {
        done('love가 수정되지 않았습니다!');
      }
    }
  });
}

function deleteLoves (conn, data, done) {
  var datas = [data.couple_no, data.loves_no];

  conn.query(sql.deleteLoves, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        done(null);
      } else {
        done('love가 삭제되지 않았습니다!');
      }
    }
  });
}

exports.insertLoves = insertLoves;
exports.updateLoves = updateLoves;
exports.deleteLoves = deleteLoves;