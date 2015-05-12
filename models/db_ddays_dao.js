/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */
var sql = require('./db_sql');

function selectDdayList (conn, data, done){
  var datas = [data.couple_no];
  conn.query(sql.selectDdayList, datas, function (err, row) {
    if(err) {
      done(err);
    } else {
      done(null, row);
    }
  });
}

exports.selectDdayList = selectDdayList;