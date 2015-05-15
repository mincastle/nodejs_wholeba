/**
 * Created by 장 한솔 on 2015-05-09.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var gcm = require('node-gcm');
var pool = mysql.createPool(db_config);
//gcm sender
var sender = new gcm.Sender('AIzaSyBtz1plKo81Edizatu0vhhl9trNiFwtGb8'); //server api key

//미션목록조회
//date = '2015-3-1'
//state 0(실패) 1(성공) 2(확인안함) 3(진행중) 4(패스)d
//data = {user_no, couple_no, date, orderby}
function selectMissionsList(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  else {
    //orderby setting
    switch(data.orderby) {
      case 0 : var orderbySql = sql.orderbyLatest; break;
      case 1 : var orderbySql = sql.orderbyMale; break;
      case 2 : var orderbySql = sql.orderbyFemale; break;
      default : done('orderby 값 이상 : ' + data.orderby);
    }
    var params = [data.couple_no, data.date, data.date];
    if(orderbySql) {
      conn.query(sql.selectMissionList + orderbySql, params, function(err, rows) {
        if(err) {
          done(err);
        } else {
          console.log('missionlist rows : ', rows);
          done(null, rows);
        }
      });
    }
  }
}


//미션생성시, theme을 랜덤으로 고르고, 미션수행할 유저 조회
//data = {user_no, couple_no, mission_theme}
function selectMissionandUser(conn, data, callback) {
  if (!conn) {
    callback('연결 에러');
    return;
  }
  result = {};
  async.parallel(
    [
      function (done) {
        selectMissionPartner(conn, data, done);
      },
      function (done) {
        selectRandomMission(conn, data, done);
      }
    ],
    function (err, res) {
      if (err) {
        callback(err);
      } else {
        console.log('select mission and user result : ', res);
        //결과를 {user_no, mission} 형식으로세팅
        result.user_no = data.user_no;
        result.couple_no = data.couple_no;
        if (res[0].mission == 1) {
          result.mission = res[0].row;
          result.partner_no = res[1].partner_no;
          result.partner_regid = res[1].partner_regid;
        } else {
          result.mission = res[1].row;
          result.partner_no = res[0].partner_no;
          result.partner_regid = res[0].partner_regid;
        }
        callback(null, result);
      }
    });
}

//미션 생성시, 미션을 수행할 유저 조회
function selectMissionPartner(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.couple_no, data.user_no];
  conn.query(sql.selectMissionPartner, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0].partner_no) {
        console.log('select mission partner row[0] : ', row[0]);
        //확인안하거나 진행중이 미션이 3개이상인지 조회
        if (row[0].mlist_cnt > 2) {
          done('상대방의 진행중인 미션: ' + row[0].mlist_cnt + '개 (미션생성실패)');
        } else {
          done(null, row[0]);
        }
      } else {
        done('상대방(미션수행자) 조회 실패');
      }
    }
  });
}


//테마에 따라 미션 랜덤으로 한개 조회
function selectRandomMission(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  console.log('thmeme data : ', data);
  var result = {};
  var param = [data.theme_no];
  //mission_no, mission_name, mission_reward, mission_expiration 조회
  conn.query(sql.selectMissionTheme, param, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0]) {
        console.log('random mission row[0] : ', row[0]);
        result.mission = 1;
        result.row = row[0];
        done(null, result);
      } else {
        done('랜덤으로 미션 1개 조회 실패');
      }
    }
  });
}

//missionlist 테이블에 생성
//data = {user_no, user_regid, partner_no, partner_regid, mission(mission_no, mission_name, mission_expiration, mission_reward)}
function insertMissionlist(conn, data, callback) {
  if (!conn) {
    callback('연결 에러');
    return;
  }
  var params = [data.partner_no, data.mission.mission_no, data.mission.mission_name, data.mission.mission_reward];
  conn.query(sql.insertMissionlist, params, function (err, row) {
    if (err) {
      callback(err);
    } else {
      //console.log('row', row);
      if (row.affectedRows == 1) {
        console.log('insert missionlist row : ', row);
        //data.user_no 에게 푸시 보내야 하므로 전송
        data.mlist_no = row.insertId;
        callback(null, data);
      } else {
        callback('미션리스트 생성 실패');
      }
    }
  });
}


//미션 생성시, 미션 보낸 사람의 리워드 -1
//todo unsigned int 처리
function updateUserReward(conn, data, rewardnum, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [rewardnum, data.user_no];
  conn.query(sql.updateUserReward, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        console.log('reward change : ', rewardnum);
        console.log('alldata : ', data);
        data.rewardchange = rewardnum;
        done(null, data);  //data 그대로 전달
      } else {
        done('리워드 차감 실패');
      }
    }
  });
}

//미션생성시,
//미션 생성푸시 + 리워드 갯수 변화 푸시 전송
function sendCreateMissionandRewardPush(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.parallel(
    [
      function (done) {
        sendCreateMissionPush(conn, data, done);
      },
      function (done) {
        sendRewardPush(conn, [data.user_no], done);
      }
    ],
    function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
}

//미션 생성시, 미션수행자에게 미션이 생성되었음을 알리는 푸시전송
//mlist_no, mlist_name, mlist_regdate 보내줘야함
function sendCreateMissionPush(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        //직전에 insert 한 mlist아이템 조회
        //푸시에 담아보낼 mission_name, mlist_regdate를 조회
        selectOneMission(conn, data, done);
      },
      function (allData, done) {
        var message = new gcm.Message;
        var regid = [data.partner_regid];
        //console.log('push data : ', data);

        message.addData('type', 5+"");
        message.addData('mlist_no', allData.mlist_no);
        message.addData('mission_name', allData.mission.mlist_name);
        message.addData('mlist_regdate', allData.mission.mlist_regdate);
        message.addData('theme_no', allData.mission.theme_no);
        sender.sendNoRetry(message, regid, function (err, result) {
          if (err) {
            console.log('err', err);
            done(err);
          }
          else {
            //todo 안드랑 연결하면 주석풀기!!!!
            //if (result.success) {
            if (true) {
              console.log('push result', result);
              done(null, allData);
            } else {
              done(err);
            }
          }
        });
      }
    ], function (err, result) {
      if (err) {
        done(err);
      } else {
        if (result) {
          done(null, result);
        }
      }
    });

}

//미션 생성시, 푸시보낼때 필요한 내용조회
function selectOneMission(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.mlist_no, data.partner_no];
  console.log('params', params);
  conn.query(sql.selectOneMission, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('row', row);
      //mlist_name, mlist_regdate 조회
      if (row[0]) {
        console.log('select one mission row[0] : ', row[0]);
        data.mission = row[0];
        done(null, data);
      } else {
        done('미션조회실패');
      }
    }
  });
}

//진행중인 미션조회
function selectRunningMission(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var param = [data.user_no];
  conn.query(sql.selectRunningMission, param, function (err, rows) {
    if (err) {
      done(err);
    } else {
      //length = 0일수도있음
      done(null, rows);
    }
  });
}


/*
  미션확인시, 해당 미션의 mission_state, expiredate 갱신
  1. mission_no 로 mission_expire(int) 검색 후 now()에 계산
  2. update
 */
//data = {user_no, mlist_no};
function updateMissionConfirm(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  conn.beginTransaction(function(err) {
    if(err) {
      conn.rollback(function() {
        done(err);
      });
    } else {
      async.waterfall(
        [
          function(done) {
            getMissionExpiredate(conn, data, done);
          },
          //updateInfo = {user_no, mlist_no, mlist_confirmdate, mlist_expiredate}
          function(updateInfo, done) {
            updateMissionStateandExpiredate(conn, updateInfo, done);
          }
        ],
        function(err, result) {
          if(err) {
            conn.rollback(function() {
              done(err);
            });
          } else if(result) {
            conn.commit(function(err) {
              if(err) {
                conn.rollback(function() {
                  done(err);
                });
              } else {
                done(null, result);
              }
            });
          }
      });  //async
    }
  });  //transaction
}

//미션확인시, 유효기간 조회 후 계산
function getMissionExpiredate(conn, data, done) {
  //expiration 조회 후 -> 오늘 + expiration
  var param = [data.mlist_no];
  conn.query(sql.selectMissionExpiration, param, function(err, row) {
    if(err) {
      done(err);
    } else {
      if(row[0].mission_expiration) {
        console.log('mission expiration : ', row[0].mission_expiration);
        var confirmdate = new Date();
        var expiredate = new Date(confirmdate);
        expiredate.setDate(confirmdate.getDate() + row[0].mission_expiration);
        console.log('expiredate : ', expiredate.toLocaleDateString());
        console.log('confirmdate : ', confirmdate.toLocaleDateString());
        data.mlist_confirmdate = confirmdate;
        data.mlist_expiredate = expiredate;  //data에 추가
        done(null, data);
      } else {
        done('미션 유효기간 조회 실패');
      }
    }
  });
}

//미션확인시, 계산된 expiredate 로 , state도 같이 갱신
function updateMissionStateandExpiredate(conn, data, done) {
  var param = [data.mlist_confirmdate, data.mlist_expiredate, data.user_no, data.mlist_no];
  conn.query(sql.updateMissionConfirm, param, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        console.log('update mlist_state, expiredate row : ', row);
        done(null, row);
      } else {
        done('미션확인실패');
      }
    }
  });
}

//미션확인시 hint조회해서 푸시보냄
//data {user_no, mlist_no}
function sendMissionConfirmPush(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        selectMissionConfirmPushInfo(conn, data, done);
      },
      function (pushinfo, done) {
        //pushinfo {partner_regid, hint}
        var message = new gcm.Message;
        var regid = [pushinfo.partner_regid];
        //console.log('push data : ', data);

        message.addData('type', 6+"");
        message.addData('mission_hint', pushinfo.mission_hint);
        sender.sendNoRetry(message, regid, function (err, result) {
          if (err) {
            console.log('err', err);
            done(err);
          }
          else {
            //todo 안드랑 연결하면 주석풀기!!!!
            //if (result.success) {
            if (true) {
              console.log('push result', result);
              done(null);
            } else {
              done(err);
            }
          }
        });
      }
    ],
    function (err) {
      if (err) {
        done(err);
      } else {
        done(null);
      }
    });
}

//미션확인시, 푸시에 보낼 힌트와 푸시 보낼 대상의 regid 조회
function selectMissionConfirmPushInfo(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.selectMissionConfirmPushInfo, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0]) {
        console.log('mission confirm info row[0] : ', row[0]);
        done(null, row[0]);
      } else {
        done('미션확인시, 푸시정보 조회 실패');
      }
    }
  });
}

//미션 성공시, mlist_state, mlist_successdate 갱신
function updateMissionSuccess(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.updateMissionSuccess, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        console.log('update mission success row : ', row);
        done(null);
      } else {
        done('미션 성공 업데이트 실패');
      }
    }
  });
}

/*
 미션 성공시, 리워드 갯수가 미션마다 다름
 waterfall 1. 리워드 줄 갯수 조회 mlist_reward
 2. 갯수만큼 업데이트
 3. 리워드 최종 갯수 푸시
 data = {user_no, mlist_no}
 */

function updateMissionSuccessRewardandSendRewardPush(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        //리워드줄 갯수 조회
        selectMissionReward(conn, data, done);
      },
      function (rewardInfo, done) {
        //update reward
        updateUserReward(conn, data, rewardInfo.mlist_reward, done);
      },
      function (arg1, done) {
        //reward push
        sendRewardPush(conn, [data.user_no], done);
      }
    ], function (err, result) {
      if (err) {
        done(err);
      } else {
        if (result) {
          done(null, result);
        } else {
          done('리워드 변경 실패');
        }
      }
    });  //async
}

//미션 성공시, 줄 리워드 갯수 조회
function selectMissionReward(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.selectMissionReward, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0].mlist_reward) {
        done(null, row[0]);
      } else {
        done('미션리워드 조회 실패');
      }
    }
  });
}

//리워드 변화시 조회해서 푸시
//todo data = [user_no] 로 넘길것!
function sendRewardPush(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        //리워드 조회
        selectUserReward(conn, data, done);
      },
      function (rewardInfo, done) {
        var message = new gcm.Message;
        var regid = [rewardInfo.user_regid];
        //console.log('push data : ', data);

        //todo type 정한 후 바꾸어야함
        message.addData('type', 3);
        message.addData('type', 3);
        message.addData('reward', rewardInfo.reward);
        sender.sendNoRetry(message, regid, function (err, result) {
          if (err) {
            console.log('push err', err);
            done(err);
          } else {
            //console.log('push if err else');
            //todo 안드랑 연결하면 주석풀기!!!!
            //if (result.success) {
            if (true) {
              console.log('push result', result);
              done(null, result);
            } else {
              done(err);
            }
          }
        });
      }
    ], function (err, result) {
      if (err) {
        //console.log("ASDQWEWQE", err);
        done(err);
      } else {
        if (result) {
          done(null, result);
        }
      }
    });
}

//사용자의 리워드갯수 조회
function selectUserReward(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  conn.query(sql.selectUserReward, data, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0]) {
        console.log('select reward push info : ', row[0]);
        done(null, row[0]);
      } else {
        done('리워드 조회 실패');
      }
    }
  });
}

//미션실패
function updateMissionFail(conn, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  conn.beginTransaction(function(err) {
    if(err) {
      conn.rollback(function() {
        done(err);
      });
    } else {
      async.waterfall(
        [
          function(done) {
            //미션 유효기간이 지난 진행중인 미션 조회
            conn.query(sql.selectMissionFail, [], function(err, rows) {
              if(err) {
                done(err);
              } else {
                if(rows.length != 0) {
                  done(null, rows);
                } else {
                  done('--------------------미션실패로 바꿀 미션이 없음');
                }
                console.log('select mission rows : ', rows);
              }
            });
          },
          function(failMissions, done) {
            var param = [];
            async.each(failMissions, function(mi, done) {
              param = [mi.mlist_no];
              conn.query(sql.updateMissionFail, param, function(err, row) {
                if(err) {
                  done(err);
                }
                if(row.affectedRows == failMissions.length) {
                  //console.log('row', row);
                  done(null);
                }
              });
            }, function(err) {
              if(err) {
                done(err);
              } else {
                done(null);
              }
            });
          } //update misson fail
        ],
        function(err) {
          if(err) {
            conn.rollback(function() {
              done(err);
            });
          } else {
            conn.commit(function(err) {
              if(err) {
                conn.rollback(function() {
                  done(err);
                });
              } else {
                done(null);
              }
            });
          }
        }); //async
    }
  });  //transaction
}





//미션목록조회
exports.selectMissionsList = selectMissionsList;

//미션생성
exports.selectMissionandUser = selectMissionandUser;
exports.insertMissionlist = insertMissionlist;
exports.updateUserReward = updateUserReward;  //미션성공시에도 사용
exports.sendCreateMissionandRewardPush = sendCreateMissionandRewardPush;

//진행중인 미션조회
exports.selectRunningMission = selectRunningMission;

//미션확인
exports.updateMissionConfirm = updateMissionConfirm;
exports.sendMissionConfirmPush = sendMissionConfirmPush;

//미션성공
exports.updateMissionSuccess = updateMissionSuccess;
exports.updateMissionSuccessRewardandSendRewardPush = updateMissionSuccessRewardandSendRewardPush;

//리워드변화시에 매번 사용, 리워드조회해서 총갯수 푸시
exports.sendRewardPush = sendRewardPush;

//미션 실패
exports.updateMissionFail = updateMissionFail;
