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

function updateDday (conn, data, done) {
  var datas = [data.dday_name, data.dday_date, data.couple_no, data.dday_no];
  console.log('datas', datas);
  conn.query(sql.updateDday, datas, function (err, row) {
    if(err) {
      done(err);
    } else {
      if(row.affectedRows == 1) {
        done(null);
      } else {
        done('정상적으로 수정되지 않았습니다.');
      }
    }
  });
}

function deleteDday (conn, data, done) {
  var datas = [data.couple_no, data.dday_no];
  conn.query(sql.deleteDday, datas, function (err, row) {
    if(err) {
      done(err);
    } else {
      if(row.affectedRows == 1) {
        done(null);
      } else {
        done('정상적으로 삭제되지 않았습니다.');
      }
    }
  });
}

exports.selectDdayList = selectDdayList;
exports.insertDday = insertDday;
exports.updateDday = updateDday;
exports.deleteDday = deleteDday;