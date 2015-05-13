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

  conn.query(sql.insertLoves(data.loves_date), datas, function (err, rows) {
    if(err) {
      done(err);
    } else {
      done(null, rows);
    }
  });
}

exports.insertLoves = insertLoves;