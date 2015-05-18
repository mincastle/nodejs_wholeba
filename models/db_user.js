var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var dao = require('./db_user_dao');

var pool = mysql.createPool(db_config);

/*
 * 회원가입
 * 0. 아이디 중복 검사
 * 1. insert into user
 * data = {user_id, user_pw, user_phone, user_regid}
 */
exports.join = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      //트랜잭션시작
      conn.beginTransaction(function(err) {
        if(err) {
          console.log('err', err);
          conn.rollback(function () {
            callback(err);
          });
        } else {
          //회원가입절차
          async.waterfall([
              function (done) {
                dao.checkUserId(conn, data, done);
              },
              function (arg1, done) {
                dao.insertUser(conn, data, arg1, done);
              },
              function (arg2, done) {
                dao.insertReward(conn, arg2, done);
              }
            ],
            function (err, result) {
            if (err) {
              console.log('err', err);
              conn.rollback(function () {
                callback(err);
              });
            } else {
              conn.commit(function(err) {
                if (err) {
                  conn.rollback(function () {
                    callback(err);
                  });
                }
                //커밋성공
                else {
                  console.log('result', result);
                  callback(null, result);
                }
              });
            }
          }); //async
        }
        conn.release();
      });  //begin transaction
    }
  });  //getconnection
};

/*
 가입정보조회
 1. couple_no null체크
   1-1. couple_no 가 있으면 couple_is 체크
     1-1-1. couple_is = 1 이면, user_addition, couple_withdraw 체크
       1-1-1-1. user_addition = 0 && couple_withdraw = 0
                이면 user_req 와 user_gender 조회 (join_code = 4)
       1-1-1-2. user_addition = 1 && couple_withdraw = 0
               이면 메인으로 이동(join_code = 0)
      1-1-1-3. couple_withdraw = 1 일땐 무조건 (join_code = 5)
    1-1-2. couple_is = 0 이면, 커플승인 기다리는중 (join_doe = 3)
   1-2. couple_no가 없으면 auth_phone 체크
     1-2-1. auth_phone에 있으면 상대방 전화번호 select (join_code = 2)
     1-2-2. auth_phone에 없으면 요청페이지 띄워줘야함 (join_code = 1)
 data = {"user_no","couple_no"};
*/

exports.join_info = function (data, callback) {
  var result = {};
  result.user_no = data.user_no; //result에 user_no 넣기

  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null);
    } else {
      conn.beginTransaction(function(err) {
        if(err) {
          console.log('err', err);
          conn.rollback(function () {
            callback(err);
          });
        } else {
          async.waterfall([
            function (done) {
              //couple_no가 있으면 couple_is 확인
              if (data.couple_no) {
                result.couple_no = data.couple_no;
                result.isAlreadyCouple = 1; //falg
                //check couple_is
                dao.getCoupleIs(conn, result, done);
              } else {
                result.isAlreadyCouple = 0; //flag
                //check auth_phone
                dao.checkAuthPhone(conn, result, done);
              }
            },
            function (result2, done) {
              if (result2.isAlreadyCouple == 1) {
                if (result2.join_code != undefined) {  //join_code = 3
                  done(null, result2);
                } else {
                  //couple_withdraw와 user_addition 조회
                  dao.checkCoupleWithdrawandUserAddition(conn, result2, done);
                }
              }
              else if (result2.isAlreadyCouple == 0) {
                if (result2.join_code != undefined) {  //join_code = 1
                  done(null, result2);
                } else {
                  //auth_phone 결과얻었으므로 couple_no로 상대방 전화번호 찾아야함
                  dao.getPartnerPhone(conn, result2, done);
                }
              }
              else {
                done('가입정보조회 실패', null);
              }
            },
            function (result3, done) {
              if (result3.join_code != undefined) {
                //join_code = 0 | 1 | 2 | 3 | 5
                done(null, result3);
              } else {
                //couple_is = 1 && couple_withdraw = 0 && user_addition = 0일때
                //커플은 승인되었지만 추가정보를 입력하지 않았으므로 user_req와 user_gender 조회하여
                //사용자에 맞는 추가정보입력 페이지로 이동
                dao.getRespondentInfo(conn, result3, done);
              }
            }
          ], function (err, result) {
            if (err) {
              console.log('err', err);
              callback(err, null);
            } else {
              if (result.join_code != undefined) {
                console.log('join info result : ', result);
                callback(null, result);
              }
            }
          });
        }
        conn.release();
      });  //begin transaction
    }
  });
};

/*
 * 공통정보등록
 * 1.user_req = 0 이면 생일만
 * 2.user_req = 1 이면 사귄날과 생일
 * data = {user_no, couple_birth, user_birth}
 */
exports.common = function (data, callback) {
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
              function (done) {
                dao.selectUserReqandUserGender(conn, data, done);
              },
              function (arg1, done) {
                dao.updateCoupleandUserBirth(conn, data, arg1, done);
              },
              function (done) {
                if (data.user_gender == 'F') {
                  done(null);
                  return;
                }
                dao.updateUserAddition(conn, data, done);
              }
            ],
            function (err, result) {
              if (err) {
                console.log('err', err);
                conn.rollback(function() {
                  callback(err);
                });
              } else {
                console.log('result', result);
                conn.commit(function(err) {
                  if(err) {
                    conn.rollback(function() {
                      callback(err);
                    });
                  } else {
                    callback(null, result);
                  }
                }); //commit
              }
          }); //async
        }
        conn.release();
      });  //transaction
    }
  });  //getConnection
};

/*
 * 여성정보등록
 * 단순히 여러가지의 정보를 등록하는 기능이므로 병렬로 처리
 * todo 트랜잭션 처리 : 3개 모두 성공했을 때만 commit
 * 1. pills 배열이 비었는지 안비었는지 확인
 * 2. 데이터가 있을 경우 user_pills = 1, pills테이블에 insert
 * 3. period insert
 * 4. syndrome insert
 * pills = {"user_no", "user_pills", "pills_date", "pills_time"}
 * period = {"user_no", "period_start", "period_end", "period_cycle"}
 * syndromes = [{syndrome_no, syndrome_before, syndrome_after}]
 */
exports.woman = function (pills, period, syndromes, callback) {
  console.log('pills', pills);
  console.log('period', period);
  console.log('syndromes', syndromes);

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
          async.parallel([
            function (done) {
              if (pills.user_pills == 1) {
                dao.insertPills(conn, pills, done);
              }
              //약복용안할경우 user_pills만 0으로 갱신
              else {
                dao.updateUserPills(conn, pills, done);
              }
            },
            function (done) {
              dao.insertPeriods(conn, period, done);
            },
            function (done) {
              dao.insertSyndromes(conn, syndromes, done)
            },
            function (done) {
              dao.updateUserAddition(conn, pills, done);
            }
          ], function (err, result) {
            if (err) {
              console.log('err', err);
              conn.rollback(function() {
                callback(err);
              });
            } else {
              console.log('result', result);
              conn.commit(function(err) {
                if(err) {
                  conn.rollback(function() {
                    callback(err);
                  });
                }else {
                  callback(null, result);
                }
              }); //commit
            }
          }); //async
        }
        conn.release();
      }); //transaction
    }
  }); //getconnection
};

/*
  로그인
    1. user_islogin = 0 (로그아웃 처리 되어있는 경우)
     1.1 user_phone, user_regid, user_islogin=1 업데이트 (end)
    2. user_islogin = 1 (기기에 로그인이 되어있거나 강제종료되어 있는 경우)
     2.1 user_phone 변경 (다른기기에서 로그인)
      2.1.1 user_phone 변경 메시지 전송
     2.2 user_phone 미변경 (같은기기에서 로그인)
      2.2.1 user_phone, user_regid, user_islogin=1 업데이트 (end)

 * user_phone 비교
 * user_id와 user_pw 비교하여 로그인
 * + user_phone과 user_regid가 달라졌을경우 update
 * users.js에서 세션 저장
 * data = {user_id, user_pw, user_phone, user_regid}
 */
exports.login = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      done(err, null);
    } else {
      conn.beginTransaction(function(err) {
        if(err) {
          console.log('err', err);
          conn.rollback(function () {
            callback(err);
          });
        } else {
          async.waterfall([function (done) {
              dao.selectUserSalt(conn, data, done);
            }, function (done) {
              dao.doLogin(conn, data, done);
            }, function (arg, done) {
                console.log('arg', arg);
              dao.updateUserRegIdandUserPhone(conn, data, arg, done);
            }, function (arg2, done) {
                console.log('arg2', arg2);
              dao.updateUserIsLogin(conn, arg2, 1, done);
            }],
            function (err, result) {
              if (err) {
                if (err == 'userphone changed') {
                  conn.rollback(function () {
                    callback('userphone changed', result);
                  });
                }else{
                  conn.rollback(function () {
                    callback(err);
                  });
                }
              } else {
                conn.commit(function(err) {
                  if (err) {
                    conn.rollback(function () {
                      callback(err);
                    });
                  }
                  //커밋성공
                  else {
                    console.log('result', result);
                    callback(null, result);
                  }
                });
              }
          });
        }
        conn.release();
      });  //begin transaction
    }
  });
};

/* 로그인 여부 확인 후 로그인 하겠다는 요청
  1. 기존에 로그인 되어있던 user_no의 user_regid, user_phone을 가져온다.
 */
exports.acceptlogin = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null);
    } else {
      conn.beginTransaction(function(err) {
        if(err) {
          console.log('err', err);
          conn.rollback(function () {
            callback(err);
          });
        } else {
          async.waterfall([function (done) {
              // user_no에 user_phone, user_regid 업데이트
              dao.updateUserRegIdandUserPhone(conn, data, null, done);
            }, function (arg, done) {
              // user_regid_old에 로그아웃 push 보내기
              dao.updateUserIsLogin(conn, arg, 1, done);
            }],
            function (err, result) {
            if (err) {
              conn.rollback(function () {
                callback(err);
              });
            } else {
              conn.commit(function(err) {
                if (err) {
                  conn.rollback(function () {
                    callback(err);
                  });
                } else {
                  console.log('result', result);
                  callback(null, result);
                }
              });
            }
          });
        }
        conn.release();
      });  //begin transaction
    }
  });
};

//로그아웃
//user_islogin = 0으로 갱신한다
exports.logout = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null);
    } else {
      //islogin 을 0으로 갱신
      dao.updateUserIsLogin(conn, data, 0, callback);
    }
  });
};

//회원탈퇴
exports.withdraw = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.rollback(function () {
            callback(err);
          });
        } else {
          async.waterfall([function (done) {
            dao.selectOtherRegId(conn, data, done);
          }, function (done) {
            async.parallel([function (p_done) {
              dao.updateUserWithdraw (conn, data, p_done);
            }, function (p_done) {
              dao.updateCoupleWithdraw (conn, data, p_done);
            }], function (err) {
              if (err) {
                done(err);
              } else {
                done(null);
              }
            });
          }], function (err) {
            if (err) {
              conn.rollback(function () {
                callback(err);
              });
            } else {
              conn.commit(function (err) {
                if (err) {
                  conn.rollback(function () {
                    callback(err);
                  });
                } else {
                  callback(null, data);
                }
              });
            }
          })
        }
        conn.release();
      });
    }
  });
};
