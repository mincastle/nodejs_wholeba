/**
 * Created by ProgrammingPearls on 15. 5. 4..
 */
var sql = require('./db_sql');
var mysql = require('mysql');
var db_config = require('./db_config');
var pool = mysql.createPool(db_config);


//커플 요청 시, 이미 커플 요청을 했는지 여부 확인하기
function selectCheckAskCouple (data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
    }
    var datas = [data.user_no];
    conn.query(sql.selectCheckAskCouple, datas, function (err, row) {
      //console.log('updateCoupleIs_row', row);
      if (err) {
        conn.release();
        done(err);
      } else {
        if (!row.couple_no) {
          done("상대방의 승인 대기중입니다..");
        }else{
          done(null);
        }
      }
      conn.release();
    });
  });
}

//커플 요청 시, couple 테이블에서 couple 생성
function insertMakeCouple (data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
    }
    var datas = [data.auth_phone];
    conn.query(sql.insertMakeCouple, datas, function (err, row) {
      //console.log('updateCoupleIs_row', row);
      if (err) {
        conn.release();
        done(err);
      } else if (row.affectedRows == 0) {
        done('정상적으로 생성되지 않았습니다.');
      } else {
        done(null, row.insertId);
      }
      conn.release();
    });
  });
}

//커플 요청 시, 요청 user의 user_gender, couple_no 업데이트
function updateUserGenderandCoupleNo (data, insertId, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
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
        done(null, insertId);
      }
      conn.release();
    });
  });
};


function selectCheckAnswerCouple (data, done){

}

function updateCoupleIs(data, done) {
  // couple_no에 couple_is 1로 변경
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
    }
    var datas = [data.couple_no];
    conn.query(sql.updateCoupleIs, datas, function (err, row) {
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
}

function updateUserCoupleNo(data, done) {
  // user_no에 couple_no를 변경
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
    }
    var datas = [data.couple_no, data.user_no];
    conn.query(sql.updateUserCoupleNo, datas, function (err, row) {
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
}

function insertMakeDday(data, done) {
  // dday 테이블에 dday 추가
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      done(err);
      return;
    }

    var dday_name = data.dday_name | '처음 만난 날';
    var dday_date = data.dday_date | data.couple_birth;
    var dday_repeat = data.repeat | 0;

    var datas = [data.couple_no, dday_name, dday_date, dday_repeat];
    conn.query(sql.insertMakeDday, datas, function (err, row) {
      //console.log('updateUserGender_row', row);
      if (err) {
        done(err);
        conn.release();
        return;
      } else if (row.affectedRows == 0) {
        done('정상적으로 생성되지 않았습니다.');
      } else {
        done(null, row.insertId);
      }
      conn.release();
    });
  });
}

exports.selectCheckAskCouple = selectCheckAskCouple;
exports.insertMakeCouple = insertMakeCouple;
exports.updateUserGenderandCoupleNo = updateUserGenderandCoupleNo;

exports.selectCheckAnswerCouple = selectCheckAnswerCouple;
exports.updateCoupleIs = updateCoupleIs;
exports.updateUserCoupleNo = updateUserCoupleNo;
exports.insertMakeDday = insertMakeDday;
