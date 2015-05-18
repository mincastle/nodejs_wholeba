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

//여성정보조회시, 여성사용자번호 조회
//data = {user_no, couple_no, user_gender}
function selectHerUserNo(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  if(data.user_gender == 'F') {
    done(null, data);  //여자일 경우 그대로 전송
  } else {
    var params=[data.couple_no, data.user_no];
    conn.query(sql.selectWomanUserNo, params, function(err, row) {
      if(err) {
        done(err);
      } else {
        if(row[0]) {
          console.log('-----------select woman user_no ; ', row[0].female_no);
          data.partner_no = row[0].partner_no;
          done(null, data);
        } else {
          done('여성사용자번호조회 실패');
        }
      }
    });
  }
}

//여성정보조회
//data = {user_no, female_no, female_public, user_gender, couple_no}
function selectHersInfo(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  if(data.user_gender == 'M') {
    //남자일때는 여자가 공개설정을 했을 때만 조회
    if(data.female_public == 0) {
      done(null, '상대방이 비공개설정 했음');
    } else {
      //직전에 조회한 여성번호로 조회
      getHerInfo(conn, data.female_no, done);
    }
  } else {
    //여자라면 그대로 조회
    getHerInfo(conn, data.user_no, done);
  }
}

//여성정보 조회
//todo user_no는 배열로
function getHerInfo(conn, herUserNo, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  async.parallel(
    [
      function(done) {
        //periods
        selectUserPeriods(conn, herUserNo, done);
      },
      function(done) {
        //pill
        selectUserPills(conn, herUserNo, done);
      }
    ],
    function(err, result) {
      if(err) {
        done(err);
      } else if (result) {
        done(null, result);
      } else {
        done('여성정보조회 실패');
      }
    }
  )
}

//여성정보조회시, 주기조회
function selectUserPeriods(conn, herUserNo, done) {
  if(!conn) {
    done(err);
    return;
  }
  var param = [herUserNo];
  conn.query(sql.selectUserPeriods, param, function(err, rows) {
    if(err) {
      done(err);
    } else {
      if(rows) {
        console.log('--------------------select periods count : ', rows.length);
        done(null, rows);
      } else {
        done('생리주기조회 실패');
      }
    }
  });
}

//여성정보조회시, 피임약복용여부 조회
function selectUserPills(conn, herUserNo, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  var param = [herUserNo];
  //여러개일경우 가장 최근것만 조회
  conn.query(sql.selectUserPills, param, function(err, row) {
    if(err) {
      done(err);
    } else {
      if(row[0]) {
        console.log('------------select pills info, user_pills : ', row[0].user_pills);
        done(null, row[0]);
      } else {
        done('피임약복용여부 조회 실패');
      }
    }

  });
}

//여성정보공개설정
exports.updateUserPublic = updateUserPublic;

//여성정보조회
exports.selectHerUserNo = selectHerUserNo;
exports.selectHersInfo = selectHersInfo;