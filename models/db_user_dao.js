/**
 * Created by 장 한솔 on 2015-05-07.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var pool = mysql.createPool(db_config);


//해당 사용자의 리워드 행 추가
//arg2.insertId = user_no
function insertReward(conn, arg2, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [arg2.insertId];
  conn.query(sql.insertReward, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row.affectedRows == 1) {
        row.user_no = arg2.insertId; //waterfall에서 넘겨받은 user_no
        console.log('insert reward row : ', row);
        done(null, row);
      } else {
        done('사용자의 리워드정보 추가 실패', null);
      }
    }
  });

}

//입력받은 user_id가 중복된 값인지 아닌지 확인
function checkUserId(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  conn.query(sql.selectUserId, [data.user_id], function (err, row) {
    if (err) {
      console.log('err', err);
      done(err, null);
      return;
    } else {
      console.log('check id : ', row[0]);
      if (row[0].cnt == 1) {
        done("이미 존재하는 아이디입니다", null);
      } else {
        done(null, row[0]);
      }

    }
  });

}

//check auth_phone
function checkAuthPhone(conn, result, done) {
  //auth_phone에 user_phone이 있는지 없는지 확인
  //couple_no와 결과 cnt 조회
  conn.query(sql.selectAuthPhone, [result.user_no], function (err, row) {
    if (err) {
      console.log('err', err);
      done(err, null);
    } else {
      console.log('authphone res :', row);
      if (row[0].cnt) {
        console.log('auth phone res : ', row);
        //row.couple_no를 가지고 상대방 전화번호를 찾아야함! (join_code == 2)
        result.row = row[0];
        done(null, result);
        //} else if (row[0].cnt == 0) {
      } else {
        // couple도 아니고 auth_phone에도 없음
        // 커플요청페이지 보여줘야함
        result.join_code = 1;
        done(null, result);
      }
    }
  });
}

//join_code 조회를 위한 couple_withdraw와 user_addition조회
function checkCoupleWithdrawandUserAddition(conn, result2, done) {
  var params = [result2.couple_no];
  conn.query(sql.selectCoupleWithdraw, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row[0].couple_withdraw == 1) {
        //상대방이 탈퇴, 알림다이얼로그로 이동
        result2.join_code = 5;
        //done(null, result2);
        selectUserGender(conn, result2, done);
      } else if (row[0].couple_withdraw == 0) {
        //user_addition 추가로 조회하여 메인으로 이동하거나(join_code = 0),
        //추가정보 입력창으로 이동(join_code = 4)
        checkUserAddition(result2, done);
      } else {
        done('커플탈퇴여부 값 이상', null);
      }
    }
  });
}

//user_addition을 조회(join_code를 알아내기위함-가입정보조회)
function checkUserAddition(result2, done) {
  pool.getConnection(function (err, conn) {
    if (err) {
      done(err, null);
    } else {
      var params = [result2.user_no];
      conn.query(sql.selectUserAddition, params, function (err, row) {
        if (err) {
          done(err, null);
        } else {
          console.log('check user addition row[0] : ', row[0]);
          if (row[0].user_addition == 0) {
            //couple_withdraw == 0 && user_addition == 0 이므로
            //user_gender와 user_req 추가 필요
            result2.row = row[0];
            done(null, result2);
          } else if (row[0].user_addition == 1) {
            //couple_withdraw == 0 && user_addition == 1 이므로 메인으로 이동
            result2.join_code = 0;
            //done(null, result2);
            selectUserGender(conn, result2, done);
          } else {
            done('사용자의 추가정보입력여부 값 이상', null);
          }
        }
        conn.release();
      });
    }
  });
}


//추가정보 입력안했기 때문에 유저의 user_req, user_gender 조회
function getRespondentInfo(conn, result3, done) {
  var params = [result3.user_no];
  conn.query(sql.selectUserReqandUserGender, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row[0]) {
        //console.log('result3', row[0]);
        result3.user_req = row[0].user_req;
        result3.user_gender = row[0].user_gender;
        result3.join_code = 4;
        selectUserGender(conn, result3, done);
        //done(null, result3);
      } else {
        done('사용자 커플요청정보, 성별 조회 실패', null);
      }
    }
  });
}

//커플 승인자 이므로 화면에 보여줄 상대방 전화번호 얻기
function getPartnerPhone(conn, result2, done) {
  var params = [result2.row.couple_no, result2.user_no];
  console.log('partner_params', params);
  conn.query(sql.selectPartnerPhone, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      console.log('partner_row',row);
      if (row[0].user_phone) {
        result2.phone = row[0].user_phone;
        result2.join_code = 2;
        done(null, result2);
        //성별이 아직 없음 couple/ask 할때 넣음
        //selectUserGender(conn, result2, done);
      } else {
        done('상대방 전화번호 조회 실패', null);
      }
    }
  });
}

//insert user
function insertUser(conn, data, arg1, done) {
  console.log('arg1', arg1);
  if (!conn) {
    done('연결 에러');
    return;
  }
  if (arg1.cnt == 0) {
    var params = [data.user_id, data.user_pw, data.user_phone, data.user_regid, data.user_regdate];
    conn.query(sql.insertUser, params, function (err, row) {
      if (err) {
        done(err, null);
      } else {
        if (row) {
          done(null, row);
        } else {
          done('이미 존재하는 아이디입니다.');
        }
      }
    });
  }
}

function getCoupleIs(conn, result, done) {
  var params = [result.couple_no];
  conn.query(sql.selectCoupleIs, params, function (err, row) {
    if (err) done(err, null);
    else {
      console.log('get couple_is row : ', row);
      if (row[0].couple_is == 0) {
        // 커플요청은 했으나 상대방이 승인아직 안함,
        // 버튼이 비활성화된 커플 요청페이지로 이동
        result.join_code = 3;
        //console.log('result : ', result);
        selectUserGender(conn, result, done);
        //done(null, result);
      } else if (row[0].couple_is == 1) {
        //user_addition, couple_withdraw 조회해야함
        done(null, result);
      } else done('커플승인여부 조회 실패', null);
    }
  });
}

//selectUserReqandUserGender
function selectUserReqandUserGender(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  conn.query(sql.selectUserReqandUserGender, [data.user_no], function (err, row) {
    if (err) {
      done(err, null);
    }
    else {
      if (row) {
        console.log('row[0]', row[0]);
        if (row[0].user_req != undefined) {
          console.log('select user_req : ', row[0]);
          done(null, row[0]);
        } else {
          done('커플요청여부 조회 실패', null);
        }
      } else {
        done('커플요청여부 조회 실패', null);
      }
    }
  });
}

//update couple_birth, user_birth
function updateCoupleandUserBirth(conn, data, arg, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }

  data.user_gender = arg.user_gender;
  //user_req = 1 이면 커플요청자이므로 사귄날 update
  //그 후에 user_birth update
  if (arg.user_req == 1) {
    if (!data.couple_birth) {
      done('커플의 사귄날 입력정보 없음', null);
      return;
    }
    var params = [data.couple_birth, data.user_no];
    conn.query(sql.updateCoupleBirth, params, function (err, row) {
      if (err) {
        done(err, null);
      }
      else {
        updateUserBirth(conn, data, done);
      }
    });
  }
  //user_req = 0이면 커플요청받은사람 이므로 생일만 update
  else if (arg.user_req == 0) {
    updateUserBirth(conn, data, done);
  } else {
    done('사용자의 커플요청여부 에러', null);
  }
}


//update user_birth
function updateUserBirth(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_birth, data.user_no];
  conn.query(sql.updateUserBirth, params, function (err, row) {
    if (err) {
      done(err, null);
    }
    else {
      if (row.affectedRows == 1) {
        done(null);
      } else {
        done('user birth 업데이트 중 에러');
      }
    }
  });
}

//login
function doLogin(conn, data, done) {
  var params = [data.user_id, data.user_pw];
  console.log('data.user_phone', data.user_phone);
  conn.query(sql.selectLogin, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      console.log('do login : ', row[0]);
      if (row) {
        if (row[0].cnt == 1) {
          switch (row[0].user_islogin) {
            case 0 : // 로그아웃 처리 되어있는 경우
              done(null, row[0]);
              break;
            case 1:  // 기기에 로그인 되어있거나 강제종료 되어있는 경우
              if (data.user_phone != row[0].user_phone) {
                console.log('userphone changed');
                var items = {
                  "user_no" : row[0].user_no,
                  "user_regid" : data.user_regid,
                  "user_phone" : data.user_phone,
                  "user_regid_old" : row[0].user_regid,
                  "user_phone_old" : row[0].user_phone
                };
                done('userphone changed', items);
              } else {
                console.log('userphone not changed');
                done(null, row[0]);
              }
              break;
          }
        } else {
          done('존재하지 않는 아이디이거나 비밀번호가 틀렸습니다');
        }
      } else {
        done('로그인에 실패했습니다.');
      }
    }
  });
}


//사용자의 전화번호와 gcm id가 변경되면 갱신
//arg는 조회된 값, data는 입력받은 값
function updateUserRegIdandUserPhone(conn, data, arg, done) {
  var user_no = data.user_no || arg.user_no;
  var params = [data.user_regid, data.user_phone, user_no];
  console.log('data', data);
  console.log('params', params);
  conn.query(sql.updateUserRegIdandUserPhone, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row) {
        if(arg){
          done(null, arg);
        }else{
          done(null, data);
        }
      } else {
        done('err');
      }
    }
  });
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
          if (row.affectedRows == 1) {
            console.log('update user_phone : ', row);
            row.user_no = arg.user_no;
            done(null, arg);
          } else {
            done('전화번호 갱신 실패', null);
          }
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
function insertPills(conn, pills, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var pillsDate = new Date(pills.pills_date);
  var params = [pills.user_no, pillsDate, pills.pills_time];
  conn.query(sql.insertPills, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row) {
        console.log('insert pills row : ', row);
        if (row.affectedRows == 1) {
          updateUserPills(conn, pills, done);
        } else done('피임약 정보 등록 실패');
      }
    }
  });
}

//set user_pills
function updateUserPills(conn, pills, done) {
  if (!conn) {
    done('연결에러');
    return;
  }
  var params = [pills.user_pills, pills.user_no];
  conn.query(sql.updateUserPills, params, function (err, row) {
    if (row.affectedRows == 1) {
      console.log('update user_pills row : ', row);
      done(null);
    } else {
      console.log('row', row);
      done('사용자 피임약복용여부 등록 실패', null);
    }
  });
}

//insert period
function insertPeriods(conn, period, callback) {
  if (!conn) {
    callback('연결에러');
    return;
  }
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
  var nextCycle = (nextStartDate - startDate) / (24 * 3600 * 1000); //millisecond to day
  var nextParams = [period.user_no, nextStartDate, nextEndDate, nextDangerDate, nextCycle];
  //console.log('nextParams', nextParams[1].toLocaleDateString());
  //console.log('nextParams', nextParams[2].toLocaleDateString());
  //console.log('nextParams', nextParams[3].toLocaleDateString());
  //console.log('nextParams', nextParams[4]);

  async.parallel([
      function (done) {
        insertPeri(conn, thisParams, done);
      },
      function (done) {
        insertPeri(conn, nextParams, done);
      }],
    function (err, result) {
      if (err) {
        console.log('insert period err : ', err);
        callback(err, null);
      } else {
        console.log('insert period result : ', result);
        callback(null, result);
      }
    });
}

function insertPeri(conn, params, done) {
  conn.query(sql.insertPeriod, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row) {
        console.log('insert period row : ', row);
        if (row.affectedRows == 1) {
          done(null, row);
        } else {
          done()
        }
      } else done('생리주기 정보 등록 실패', null);
    }
  });
}

//insert 생리증후군
function insertSyndromes(conn, syndromes, done) {
  console.log('syndromeasdasdasd', syndromes);
  var user_no = syndromes.user_no;
  var syndromes = syndromes.items;
  console.log('dasdasdsyndrome', syndromes);
  var length = syndromes.length;
  var params = [];
  console.log('length', length);

  //배열길이에 맞게 반복
  async.each(syndromes, function (syn, done) {
      params = [user_no, syn.syndrome_no, parseInt(syn.syndrome_before), parseInt(syn.syndrome_after)];
      insertSyn(conn, params, done);
    },
    function (err) {
      if (err) {
        done(err, null);
      } else {
        done(null, "생리증후군 등록 성공");
      }
    });
}

function insertSyn(conn, params, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  //사용자가 등록한 증후군 갯수만큼 저장
  conn.query(sql.insertSyndrome, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row.affectedRows == 1) {
        console.log('insert syndrome row : ', row);
        done(null, row);
      } else {
        done('생리증후군 등록 실패', null);
      }
    }
  });
}

function updateUserAddition(conn, data, done) {

  var params = [data.user_no];
  console.log('params_addition', params);
  conn.query(sql.updateUserAddition, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        done(null, row);
      } else {
        done('addition 변경 실패');
      }
    }
  });
}

//update user_islogin
//data = user_no, couple_no, user_phone, user_regid
function updateUserIsLogin(conn, data, islogin, done) {
  var params = [islogin, data.user_no];
  conn.query(sql.updateUserIsLogin, params, function (err, row) {
    if (err) {
      done(err, null);
    } else {
      if (row.affectedRows == 1) {
        done(null, data);  //세션 설정을 위해 이전의 user_no, couple_no 조회한 결과를 보냄
      } else {
        done('user_islogin 변경 실패', null);
      }
    }
  });
}

//가입정보조회시, 무조건 성별 조회
function selectUserGender(conn, result, done) {
  if(!conn) {
    done(err);
    return;
  }
  var param = [result.user_no];
  conn.query(sql.selectUserGender, param, function(err, row) {
    if(err) {
      done(err);
    } else {
      //console.log('성별 row[0]' , row[0]);
      if(row[0].user_gender) {
        result.user_gender = row[0].user_gender;
        done(null, result);
      } else {
        done('사용자 성별 조회 실패');
      }
    }
  });
}


//회원 탈퇴, 상대방 user_regid가져오기
function selectOtherRegId (conn, data, done) {
  var datas = [data.couple_no, data.user_no];
  conn.query(sql.selectOtherRegId, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      if(row) {
        data.other_regid = row[0].other_regid;
        console.log('data', data);
        done(null);
      } else {
        done('상대방 user_no, user_regid 조회 실패');
      }
    }
  });
}

function updateUserWithdraw (conn, data, done) {
  var datas = [data.couple_no];

  conn.query(sql.updateUserWithdraw, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 2) {
        done(null);
      } else {
        done('user 탈퇴 실패하였습니다.');
      }
    }
  });
}

function updateCoupleWithdraw (conn, data, done) {
  var datas = [data.couple_no];

  console.log('couple_withdraw', datas);
  conn.query(sql.updateCoupleWithdraw, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('couple_withdraw_row', row);
      if (row.affectedRows == 1) {
        done(null, data);
      } else {
        done('couple 탈퇴 실패하였습니다.');
      }
    }
  });
}

/* --------------------------- exports --------------------------- */

//회원가입 (/join)
exports.checkUserId = checkUserId;
exports.insertReward = insertReward;
exports.insertUser = insertUser;

//로그인
exports.updateUserPhone = updateUserPhone; //private
exports.updateUserRegIdandUserPhone = updateUserRegIdandUserPhone;
exports.doLogin = doLogin;
exports.updateUserIsLogin = updateUserIsLogin; //로그인과 로그아웃에서 사용

//가입정보조회 (/join)
exports.getCoupleIs = getCoupleIs;
exports.checkAuthPhone = checkAuthPhone;
exports.checkCoupleWithdrawandUserAddition = checkCoupleWithdrawandUserAddition;
exports.getRespondentInfo = getRespondentInfo;
exports.getPartnerPhone = getPartnerPhone;

//공통정보등록 (/common)
exports.selectUserReqandUserGender = selectUserReqandUserGender;
exports.updateUserBirth = updateUserBirth; //private
exports.updateCoupleandUserBirth = updateCoupleandUserBirth;


//여성정보등록 (/woman)
exports.updateUserPills = updateUserPills;
exports.insertPills = insertPills;
exports.insertPeriods = insertPeriods;
exports.insertPeri = insertPeri; //private
exports.insertSyndromes = insertSyndromes;
exports.insertSyn = insertSyn; //private

// 공통정보등록, 여성정보등록 후 추가 정보 등록 완료
exports.updateUserAddition = updateUserAddition;

// 회원탈퇴
exports.selectOtherRegId = selectOtherRegId;
exports.updateUserWithdraw = updateUserWithdraw;
exports.updateCoupleWithdraw = updateCoupleWithdraw;