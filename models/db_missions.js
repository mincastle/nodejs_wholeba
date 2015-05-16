var mysql = require('mysql');
var db_config = require('./db_config');
var dao = require('./db_missions_dao');
var async = require('async');
var commonDao = require('./db_common_dao');

var pool = mysql.createPool(db_config);

//missions목록조회
//oderby 0(최신순), 1(남자순), 2(여자순)
//date = '2015-3-1'
//state 0(실패) 1(성공) 2(확인안함) 3(진행중) 4(패스)d
//data = {user_no, couple_no, date, orderby}
exports.getlist = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      dao.selectMissionsList(conn, data, callback);
    }
    conn.release();
  });
};

//mission하나조회
//data = {user_no, mlist_no}
exports.get = function (data, callback) {
  var result = {};
  result.user_no = data.user_no;
  result.mlist_no = data.mlist_no;

  pool.getConnection(function(err, conn) {
    if(err) {
      done(err);
    } else {
      var params = [data.user_no, data.mlist_no];
      conn.query(sql.selectOneMission, params, function(err, row) {
        if(err) {
          done(err);
        } else {
          if(row) {
            console.log('select one mission row: ', row);
            result.row = row;  //result에 추가
            done(null, result);
          } else {
            done('미션조회실패');
          }
        }
      });
    }
  });
};

/*
  missions생성
  0. 확인안했거나 진행중인 미션이 3개미만인지 확인
  1-1. theme으로 랜덤 select
  1-2. couple_no는 같고 user_no가 다른 유저(user_no, user_regid) select
  2. missionlist insert
  3. 2의 유저에게 push(mlist_no, mlist_name, mlist_regdate)
  4. 보낸사람의 reward 차감
 data = {user_no, couple_no, mission_theme}
 */
exports.add = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      conn.beginTransaction(function(err) {
        if(err) {
          console.log('err', err);
          conn.rollback(function() {
            callback(err);
          });
        } else {
          async.waterfall(
            [
              function(done) {
                //theme으로 mission select
                //user select (진행중인 미션이 3개이상이면 err)
                //arg1 {user_no, couple_no, partner_no, partner_regid,mission{...}}
                dao.selectMissionandUser(conn, data, done);
              },
              function(arg1, done) {
                //insert missionlist
                //arg2 = arg1 + mlist_no
                dao.insertMissionlist(conn, arg1, done);
              },
              function(arg2, done) {
                //reward 차감
                commonDao.updateUserReward(conn, arg2, -1, done);
              },
              function(arg3, done) {
                //push
                dao.sendCreateMissionandRewardPush(conn, arg3, done);
              }
            ],
            function(err) {
              if(err) {
                conn.rollback(function() {
                  callback(err);
                });
              } else {
                //리워드 추가갯수
                if(result) {
                  conn.commit(function(err) {
                    if(err) {
                      conn.rollback(function() {
                        callback(err);
                      });
                    } else {
                      callback(null, result);
                    }
                  });  //commit
                }
              }
            }); //async
        }
        conn.release();
      });  //transaction
    }
  });  //getConnection
};

/*
  진행중인 미션조회
  메인에서 미션팝업 들어왔을시 조회
  1. user_no로 mlist_state=2|3인 미션 조회
 */
exports.runningMission = function(data, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      dao.selectRunningMission(conn, data, done);
    }
  });
}

/*
  missions확인
  1. 해당 mlist_no의 mission_state = 3(진행중)으로 갱신
  2. 상대방에게 확인했다는 푸시 (mlist_no, hint 전송)
  data = {user_no, mlist_no}
 */
exports.confirm = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      async.series(
        [
          function(done){
            //내부 트랜잭션 처리
            //mission_expire 조회 후 mlist_expiredate, mlist_state 갱신
            dao.updateMissionConfirm(conn, data, done);
          },
          function(done) {
            //상대방에게 푸시전송(+힌트)
            dao.sendMissionConfirmPush(conn, data, done);
          }
        ],
        function(err, result) {
        if(err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
    conn.release();
  });
};

//missions삭제
exports.delete = function (data, callback) {
  var success = 1;
  callback(success);
};

/*
  missions성공
  1. mlist_state = 1, mlist_successdate = now()로 갱신
  2. user에게 reward +1 (리워드푸시)
 */
exports.success = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      conn.beginTransaction(function(err) {
        if(err) {
          conn.rollback(function() {
            callback(err);
            return;
          });
        }
        async.parallel(
          [
            function(done) {
              //mlist update
              dao.updateMissionSuccess(conn, data, done);
            },
            function(done) {
              //reward mlist_reward
              dao.updateMissionSuccessRewardandSendRewardPush(conn, data, done);
            }
          ], function(err, result) {
            if(err) {
              conn.rollback(function() {
                callback(err);
              });
            } else {
              conn.commit(function(err){
                if(err) {
                  conn.rollback(function() {
                    callback(err);
                  });
                } else {
                  callback(null, result);
                }
              });
            }
          }); //async
        conn.release();
      });  //transaction
    }
  });
};