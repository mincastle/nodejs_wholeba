/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */
var sql = require('./db_sql');

function selectLoves (conn, data, done) {

  sql.selectLoves(data, function (convertsql) {
    var datas = [data.couple_no];
    conn.query(convertsql, datas, function (err, rows) {
      done(null, rows);
    });
  });
}

function insertLoves (conn, data, done) {
  var datas;

  datas = [data.couple_no, data.loves_condom, data.loves_date];

  var convertsql = "insert into loves(couple_no, loves_condom, loves_date) values (?, ?, ifnull(?, now()))"
  conn.query(convertsql, datas, function (err, row) {
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

exports.selectLoves = selectLoves;
exports.insertLoves = insertLoves;
exports.updateLoves = updateLoves;
exports.deleteLoves = deleteLoves;