/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */
var sql = require('./db_sql');

function selectDdayList (conn, data, done){
  var datas = [data.couple_no];
  conn.query(sql.selectDdayList, datas, function (err, rows) {
    if(err) {
      done(err);
    } else {
      done(null, rows);
    }
  });
}

function insertDday (conn, data, done) {
  var datas = [data.couple_no, data.dday_name, data.dday_date];
  conn.query(sql.insertDday, datas, function (err, row) {
    if(err) {
      done(err);
    } else {
      if(row.affectedRows == 1) {
        done(null, row.insertId);
      } else {
        done('정상적으로 생성되지 않았습니다.');
      }
    }
  });
}

exports.selectDdayList = selectDdayList;
exports.insertDday = insertDday;