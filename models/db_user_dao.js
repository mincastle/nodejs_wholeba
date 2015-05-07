/**
 * Created by 장 한솔 on 2015-05-07.
 */
var sql = require('./db_sql');
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var pool = mysql.createPool(db_config);


//해당 사용자의 리워드 행 추가
//arg2.insertId = user_no
function insertReward(arg2, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err, null);
    } else {
      var params = [arg2.insertId];
      conn.query(sql.insertReward, params, function(err, row) {
        if(err) {
          done(err, null);
        } else {
          if(row.affectedRows == 1) {
            row.user_no = arg2.insertId; //waterfall에서 넘겨받은 user_no
            console.log('insert reward row : ', row);
            done(null, row);
          } else {
            done('사용자의 리워드정보 추가 실패', null);
          }
        }
        conn.release();
      });
    }
  });
}

//자동로그인
function isAutoLogin(data, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err, null);
    } else {
      var params = [data.user_no, data.user_phone];
      console.log('params', params);
      conn.query(sql.selectAutologin, params, function(err, row) {
        if(err){
          done(err, null);
        } else {
          if(!row[0] || row[0].cnt ==0) {
            done('로그인 정보가 변경되었습니다.', null);
          }else{
            done(null, row[0]);
          }
        }
        conn.release();
      });
    }
  });
};

//입력받은 user_id가 중복된 값인지 아닌지 확인
function checkUserId(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection error : ', err);
      done(err, null);
    }
    else {
      conn.query(sql.selectUserId, [data.user_id], function (err, row) {
        if (err) {
          console.log('err', err);
          done(err, null);
          conn.release();
          return;
        } else {
          console.log('check id : ', row[0]);
          if (row[0].cnt == 1) {
            done("이미 존재하는 아이디입니다", null);
            conn.release();
          } else {
            done(null, row[0]);
            conn.release();
          }
        }
      });
    }
  });
}

//check auth_phone
function checkAuthPhone(result, done) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('err', err);
    else {
      //auth_phone에 user_phone이 있는지 없는지 확인
      //couple_no와 결과 cnt 조회
      conn.query(sql.selectAuthPhone, [result.user_no], function (err, row) {
        if (err) {
          console.log('err', err);
          done(err, null);
        } else {
          if(row[0].cnt == 1) {
            //row.couple_no를 가지고 상대방 전화번호를 찾아야함! (join_code == 2)
            result.row = row[0];
            done(null, result);
          } else if(row[0].cnt == 0){
            // couple도 아니고 auth_phone에도 없음
            // 커플요청페이지 보여줘야함
            result.join_code = "1";
            done(null, result);
          }
        }
        conn.release();
      });
    }
  });
}

//join_code 조회를 위한 couple_withdraw와 user_addition조회
function checkCoupleWithdrawandUserAddition(result2, done){
  pool.getConnection(function(err, conn) {
    var params = [result2.couple_no];
    conn.query(sql.selectCoupleWithdraw, params, function(err, row) {
      if(err) {
        done(err, null);
      } else {
        if(row[0].couple_withdraw == 1) {
          //상대방이 탈퇴, 알림다이얼로그로 이동
          result2.join_code = "5";
          done(null, result2);
        } else if (row[0].couple_withdraw == 0) {
          //user_addition 추가로 조회하여 메인으로 이동하거나(join_code = 0),
          //추가정보 입력창으로 이동(join_code = 4)
          checkUserAddition(result2, done);
        } else {
          done('커플탈퇴여부 값 이상', null);
        }
      }
      conn.release();
    });
  });
}


//user_addition을 조회(join_code를 알아내기위함-가입정보조회)
function checkUserAddition(result2, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err, null);
    } else {
      var params = [result2.user_no];
      conn.query(sql.selectUserAddition, params, function(err, row) {
        if(err){
          done(err, null);
        } else{
          console.log('check user addition row[0] : ', row[0]);
          if(row[0].user_addition == 0) {
            //couple_withdraw == 0 && user_addition == 0 이므로
            //user_gender와 user_req 추가 필요
            result2.row = row[0];
            done(null, result2);
          }else if(row[0].user_addition == 1) {
            //couple_withdraw == 0 && user_addition == 1 이므로 메인으로 이동
            result2.join_code = "0";
            done(null, result2);
          }else {
            done('사용자의 추가정보입력여부 값 이상', null);
          }
        }
        conn.release();
      });
    }
  });
}



//추가정보 입력안했기 때문에 유저의 user_req, user_gender 조회
function getRespondentInfo(result3, done) {
  pool.getConnection(function (err, conn) {
    if(err) {
      done(err, null);
    } else {
      var params = [result3.user_no];
      conn.query(sql.selectUserReqandUserGender, params, function(err, row) {
        if(err) {
          done(err, null);
        } else {
          if(row[0]) {
            //console.log('result3', row[0]);
            result3.user_req = row[0].user_req.toString();
            result3.gender = row[0].user_gender;
            result3.join_code = "4";
            done(null, result3);
          } else {
            done('사용자 커플요청정보, 성별 조회 실패',null);
          }
        }
        conn.release();
      });
    }
  });
}

//커플 승인자 이므로 화면에 보여줄 상대방 전화번호 얻기
function getPartnerPhone(result2, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err, null);
    } else {
      var params = [result2.row.couple_no, result2.user_no];
      conn.query(sql.selectPartnerPhone, params, function(err, row) {
        if(err) {
          done(err, null);
        } else {
          if(row[0].user_phone) {
            result2.phone = row[0].user_phone;
            result2.join_code = "2";
            done(null, result2);
          } else {
            done('상대방 전화번호 조회 실패', null);
          }
        }
        conn.release();
      });
    }
  });
}

//insert user
function insertUser(data, arg1, done) {
  console.log('arg1', arg1);
  if (arg1.cnt == 0) {
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log('connection err : ', err);
        done(err, null);
      }
      var params = [data.user_id, data.user_pw, data.user_phone, data.user_regid];
      conn.query(sql.insertUser, params, function (err, row) {
        if (err) {
          done(err, null);
        } else {
          done(null, row);
        }
        conn.release();
      });
    });
  } else {
    done("이미 존재하는 아이디입니다", null);
  }
}

function getCoupleIs(result, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      var params = [result.couple_no];
      conn.query(sql.selectCoupleIs, params, function (err, row) {
        if (err) done(err, null);
        else {
          console.log('get couple_is row : ', row);
          if(row[0].couple_is == 0) {
            // 커플요청은 했으나 상대방이 승인아직 안함,
            // 버튼이 비활성화된 커플 요청페이지로 이동
            result.join_code = "3";
            done(null, result);
          } else if(row[0].couple_is == 1) {
            //user_addition, couple_withdraw 조회해야함
            done(null, result);
          } else done('커플승인여부 조회 실패', null);
        }
        conn.release();
      });
    }
  });
}

//selectUserReq
function selectUserReq(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      conn.query(sql.selectUserReq, [data.user_no], function (err, row) {
        if (err) {
          done(err, null);
        }
        else {
          if(row) {
            if(!row[0].user_req) {
              done('커플요청여부 조회 실패', null);
            } else {
              console.log('select user_req : ', row[0]);
              done(null, row[0]);
            }
          } else {
            done('커플요청여부 조회 실패', null);
          }
        }
        conn.release();
      });
    }
  });
}

//update couple_birth, user_birth
function updateCoupleandUserBirth(data, arg, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      done(err, null);
    }
    else {
      //user_req = 1 이면 커플요청자이므로 사귄날 update
      //그 후에 user_birth update
      if (arg.user_req = 1) {
        if(!data.couple_birth) {
          done('커플의 사귄날 입력정보 없음', null);
        }
        var params = [data.couple_birth, data.user_no];
        conn.query(sql.updateCoupleBirth, params, function (err, row) {
          if (err) {
            done(err, null);
          }
          else {
            updateUserBirth(data, done);
          }
          conn.release();
        });
      }
      //user_req = 0이면 커플요청받은사람 이므로 생일만 update
      else if (arg.user_req == 0) {
        updateUserBirth(data, done);
      } else {
        done('사용자의 커플요청여부 에러', null);
      }
    }
  });
}


//update user_birth
function updateUserBirth(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      var params = [data.user_birth, data.user_no];
      conn.query(sql.updateUserBirth, params, function (err, row) {
        if (err) {
          done(err, null);
        }
        else {
          //console.log('update user birth : ', row);
          done(null, row);
        }
        conn.release();
      });
    }
  });
}

//login
//user_no, couple_no, user_phone, user_regid 를 row로 반환
function doLogin(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      var params = [data.user_id, data.user_pw];
      console.log('do login params', params);
      conn.query(sql.selectLogin, params, function (err, row) {
        if (err) {
          done(err, null);
          conn.release();
          return;
        }
        else {
          console.log('do login : ', row[0]);
          if (row) {
            if (row[0].cnt == 1) {
              done(null, row[0]);
            } else {
              done('존재하지 않는 아이디이거나 비밀번호가 틀렸습니다', null);
            }
          } else done('login error', null);
          5
        }
        conn.release();
      });
    }
  });
}


//사용자의 전화번호와 gcm id가 변경되면 갱신
//arg는 조회된 값, data는 입력받은 값
function updateUserInfo(data, arg, done) {
  //결과값이 하나인지 체크
  //gcm id가 다를경우
  if (data.user_regid != arg.user_regid && data.user_regid != "") {
    pool.getConnection(function (err, conn) {
      if (err) done(err, null);
      else {
        var params = [data.user_regid, arg.user_no];
        conn.query(sql.updateUserRegId, params, function (err, row) {
          if (err) done(err, null);
          else {
            if (row) {
              //전화번호도 다를경우
              if (data.user_phone == arg.user_phone && arg.user_phone != "") {
                //기존것과 같으면 바꿀필요 없이 break;
                done(null, arg);
              } else {
                console.log('update user_regid row', row);
                updateUserPhone(data, arg, done);
              }
            } //row
          }
          conn.release();
        });
      }
    });
  } else if (data.user_phone != arg.user_phone && data.user_phone != "") {
    //전화번호만 다를경우
    updateUserPhone(data, arg, done);
  } else {
    //다같을경우
    done(null, arg);
  }
}

//user_phone이 달라졌을 경우 갱신
//data : 입력값, arg : 기존값
function updateUserPhone(data, arg, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      var params = [data.user_phone, arg.user_no];
      conn.query(sql.updateUserPhone, params, function (err, row) {
        if (err) {
          done(err, null);
        }
        else {
          console.log('update user_phone : ', row);
          done(null, arg);
        }
        conn.release();
      });
    }
  });
}

/*
 insert pills
 1. pills 테이블에 insert
 2. user_pills=1로 갱신
 */
function insertPills(pills, done) {
  var pillsDate = new Date(pills.pills_date);

  pool.getConnection(function (err, conn) {
    if (err) done(err);
    else {
      var params = [pills.user_no, pillsDate, pills.pills_time];
      conn.query(sql.insertPills, params, function (err, row) {
        if (err) {
          done(err);
        } else {
          if (row) {
            console.log('insert pills row : ', row);
            if (row.affectedRows == 1) {
              updateUserPills(pills, done);
            } else done('피임약 정보 등록 실패');
          }
        }
        conn.release();
      });
    }
  });
}

//set user_pills
function updateUserPills(pills, done) {
  //update user_pills
  pool.getConnection(function (err, conn) {
    var params = [pills.user_pills, pills.user_no];
    conn.query(sql.updateUserPills, params, function (err, row) {
      if (err) {
        done(err);
      } else {
        if (row.affectedRows == 1) {
          console.log('update user_pills row : ', row);
          done(null);
        } else {
          done('사용자 피임약복용여부 등록 실패', null);
        }
      }
      conn.release();
    });
  });
}

//insert period
function insertPeriods(period, callback) {
  //string to date
  var startDate = new Date(period.period_start);
  var endDate = new Date(period.period_end);
  //지난 배란일 : (다음 시작예정일:시작일+주기)-14
  var dangerDate = new Date(period.period_start);
  var cycle = parseInt(period.period_cycle);
  //시작일에서 날짜만 변경
  dangerDate.setDate(startDate.getDate() - 14);
  var thisParams = [period.user_no, startDate, endDate, dangerDate, cycle];

  //다음 예정일도 저장
  var nextStartDate = new Date(startDate);
  nextStartDate.setDate(nextStartDate.getDate() + cycle);  //다음달 예정 시작일
  var nextEndDate = new Date(nextStartDate);
  var nextDangerDate = new Date(nextStartDate);
  nextEndDate.setDate(nextEndDate.getDate() + 5);  //디폴트 생리기간 : 5일
  nextDangerDate.setDate(nextStartDate.getDate() - 14);  //다음달의 예정 배란일
  var nextCycle = (nextStartDate - startDate)/(24 * 3600 * 1000); //millisecond to day
  var nextParams = [period.user_no, nextStartDate, nextEndDate, nextDangerDate, nextCycle];
  //console.log('nextParams', nextParams[1].toLocaleDateString());
  //console.log('nextParams', nextParams[2].toLocaleDateString());
  //console.log('nextParams', nextParams[3].toLocaleDateString());
  //console.log('nextParams', nextParams[4]);

  async.parallel([
      function(done){
        insertPeri(thisParams, done);
      },
      function(done) {
        insertPeri(nextParams, done);
      }],
    function(err, result) {
      if(err) {
        console.log('insert period err : ', err);
        callback(err, null);
      } else {
        console.log('insert period result : ', result);
        callback(null, result);
      }
    });
}

function insertPeri(params, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      done(err, null);
    }
    conn.query(sql.insertPeriod, params, function (err, row) {
      if (err) {
        done(err, null);
      } else {
        if (row) {
          console.log('insert period row : ', row);
          if(row.affectedRows == 1) {
            done(null, row);
          } else {
            done()
          }
        } else done('생리주기 정보 등록 실패', null);
      }
      conn.release();
    });
  });
}

//insert 생리증후군
function insertSyndromes(syndromes, done) {
  var user_no = syndromes.user_no;
  var syn = syndromes.items;
  //var arrayQuery = [];
  var length = syn.length;
  var params = [];
  console.log('length', length);

  async.parallel([
      function(done) {
        if (0 < length) {
          params = [user_no, syn[0].syndrome_name,
            parseInt(syn[0].syndrome_before), parseInt(syn[0].syndrome_after)];
          console.log(params);
          insertSyn(params, done);
        } else {
          done('증후군 입력값 이상', null);
        }
      },
      function(done){
        if(1 < length) {
          params = [user_no, syn[1].syndrome_name,
            parseInt(syn[1].syndrome_before), parseInt(syn[1].syndrome_after)];
          insertSyn(params, done);
        } else {
          done(null, 'syndrome num : ' + length);
        }
      },
      function(done){
        if(2 < length) {
          params = [user_no, syn[2].syndrome_name,
            parseInt(syn[2].syndrome_before), parseInt(syn[2].syndrome_after)];
          insertSyn(params, done);
        } else {
          done(null, 'syndrome num : ' + length);
        }
      }
    ]
    , function(err, result) {
      if(err) {
        console.log('err', err);
        done(err, null);
      } else {
        if(result) {
          //console.log('woman info result', result);
          done(null, result);
        } else {
          done('증후군 등록 실패', null);
        }
      }
    });
}

function insertSyn(params, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      done(err, null);
    }
    else {
      //사용자가 등록한 증후군 갯수만큼 저장
      //console.log('params', params);
      conn.query(sql.insertSyndrome, params, function(err, row) {
        if(err) {
          done(err, null);
        } else {
          if(row.affectedRows == 1) {
            console.log('insert syndrome row : ', row);
            done(null, row);
          } else {
            done('생리증후군 등록 실패', null);
          }
        }
        conn.release();
      });
    }
  });
}

//자동로그인 (/autologin)
exports.isAutoLogin = isAutoLogin;

//회원가입 (/join)
exports.checkUserId = checkUserId;
exports.insertReward = insertReward;
exports.insertUser = insertUser;

//로그인
exports.updateUserPhone = updateUserPhone; //private
exports.updateUserInfo = updateUserInfo;
exports.doLogin = doLogin;

//가입정보조회 (/join)
exports.getCoupleIs = getCoupleIs;
exports.checkAuthPhone = checkAuthPhone;
exports.checkCoupleWithdrawandUserAddition = checkCoupleWithdrawandUserAddition;
exports.getRespondentInfo = getRespondentInfo;
exports.getPartnerPhone = getPartnerPhone;

//공통정보등록 (/common)
exports.selectUserReq = selectUserReq;
exports.updateUserBirth = updateUserBirth; //private
exports.updateCoupleandUserBirth = updateCoupleandUserBirth;


//여성정보등록 (/woman)
exports.updateUserPills = updateUserPills;
exports.insertPills = insertPills;
exports.insertPeriods = insertPeriods;
exports.insertPeri = insertPeri; //private
exports.insertSyndromes = insertSyndromes;
exports.insertSyn = insertSyn; //private

