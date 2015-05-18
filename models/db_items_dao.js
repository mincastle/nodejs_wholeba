/**
 * Created by 장 한솔 on 2015-05-14.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var commonDao = require('./db_common_dao');
var pool = mysql.createPool(db_config);
var gcm = require('node-gcm');

//아이템 목록 조회
function selectItems(conn, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  conn.query(sql.selectItems, [], function (err, rows) {
    if (err) {
      done(err);
    } else {
      if (rows.length != 0) {
        //console.log('select items rows : ', rows);
        done(null, rows);
      } else {
        done('아이템목록조회 실패');
      }
    }
  });
}

//아이템사용여부조회
//한 미션당 아이템은 한번만 사용할 수 있음
//data = {user_no, item_no, mlist_no}
function selectMissionUseItem(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.selectMissionUseItem, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('select mission user item row[0] : ', row[0]);
      if (row[0].cnt == 0) {
        //해당미션에 사용된 아이템이 없으므로 아이템 사용가능
        done(null, row[0]);
      } else if (row[0].cnt > 0) {
        done('해당미션에 이미 아이템을 사용하였습니다');
      } else {
        done('미션에 대한 아이템사용여부 조회 실패');
      }
    }
  });
}

/*
 아이템 사용시, 리워드 처리 - > 추후 아이템구매로 빼야함
 1. 아이템의 가격 조회(item_exchange)
 2. 리워드 차감(updateUserReward)
 3. 리워드 푸시(push reward)
 4. 아이템리스트 테이블에 추가(insert itemlist)
 data = {user_no, item_no, mlist_no}
 result = {itemlist_no}
 */
function buyItem(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        selectItemExchange(conn, data, done);
      },
      function (itemExchangeInfo, done) {
        var cost = (-1) * itemExchangeInfo.item_exchange;
        commonDao.updateUserReward(conn, data, cost, done);
      },
      function (reformData, done) {
        commonDao.sendRewardPush(conn, [data.user_no], done);
      },
      function (reformData2, done) {
        insertItemlist(conn, data, done);
      }
    ],
    function (err, itemlistInfo) {
      if (err) {
        done(err);
      } else if (itemlistInfo) {
        done(null, itemlistInfo);
      } else {
        done('아이템구매 실패');
      }
    });
}

//아이템 사용시, 아이템의 교환바나나칩갯수 조회
function selectItemExchange(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var param = [data.item_no];
  conn.query(sql.selectItemExchange, param, function (err, row) {
    if (err) {
      done(err);
    } else if (row[0].item_exchange != 0) {
      console.log('item exchange row[0] : ', row[0]);
      done(null, row[0]);
    } else {
      done('교환할 칩갯수 조회실패');
    }
  });
}

//아이템 사용시, insert itemlist
function insertItemlist(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.item_no];
  conn.query(sql.insertItemlist, params, function (err, row) {
    if (err) {
      done(err);
    } else if (row.affectedRows == 1) {
      console.log('insert itemlist row : ', row);
      done(null, row);
    } else {
      done('아이템리스트 추가 실패');
    }
  });
}

//아이템사용시, 아이템에 따른 사용처리+itemlist update(사용시간, 사용미션)
//theme_no 0(랜덤) 1(악마) 2(처음) 3(섹시) 4(애교) 5(천사)
//data = {user_no, item_no, mlist_no, mission_name, item_usedate}
function useItem(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.series(
    [
      function (done) {
        switch (data.item_no) {
          //미션 다시 뽑기
          case 1:
            useItemReselect(conn, data, 0, done);
            break;
          //미션 유효기간 3일 늘리기
          case 2:
            useItemExtendMissionExpiredate(conn, data, done);
            break;
          //악마미션으로 다시 뽑기
          case 3:
            useItemReselect(conn, data, 1, done);
            break;
          //섹시미션으로 다시 뽑기
          case 4:
            useItemReselect(conn, data, 3, done);
            break;
          //천사미션으로 다시 뽑기
          case 5:
            useItemReselect(conn, data, 5, done);
            break;
          //애교미션으로 다시 뽑기
          case 6:
            useItemReselect(conn, data, 4, done);
            break;
          //처음미션으로 다시 뽑기
          case 7:
            useItemReselect(conn, data, 2, done);
            break;
          //미션패스
          case 8:
            useItemPassMission(conn, data, done);
            break;
          //미션 내마음대로 쓰기
          case 9:
            useItemCustomMission(conn, data, done);
            break;
          default:
            done('없는 아이템번호 사용');
            break;
        }
      },
      function (done) {
        //사용성공시, 사용미션과 사용시간 업데이트
        //itemlist
        updateItemlistUse(conn, data, done);
      }
    ],
    function (err, result) {
      if (err) {
        done(err);
      } else if (result) {
        done(null, result[1]); //series는 결과가 배열로
      } else {
        done('아이템 사용처리 실패');
      }
    });
}

//미션다시뽑기 아이템사용
//theme_no 0(랜덤) 1(악마) 2(처음) 3(섹시) 4(애교) 5(천사)
// data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
function useItemReselect(conn, data, theme_no, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function (done) {
        //새로 뽑기
        selectAnotherMission(conn, data, theme_no, done);
      },
      function (missionInfo, done) {
        //update missionlist
        updateMissionReselected(conn, data, missionInfo, done);
      }
    ],
    function (err, result) {
      if (err) {
        done(err);
      } else if (result) {
        done(null, result);
      } else {
        done('아이템사용 처리 실패');
      }
    });
}

//미션 테마에 따라 새로 선택
// data = {user_no, item_no, mlist_no, itemlist_no, mission_name}
function selectAnotherMission(conn, data, theme_no, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  //theme setting
  var params = [data.mlist_no, data.user_no];
  if (theme_no == 0) {
    var randomThemeNo = Math.floor((Math.random() * 5) + 1);  //랜덤일시 1~5중 하나 선택
    params.push(randomThemeNo);
    console.log('random theme no', randomThemeNo);
  } else {
    params.push(theme_no);
  }
  //console.log('params ', params);

  conn.query(sql.selectAnotherMission, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row[0]) {
        console.log('reselect theme ' + theme_no + ' row[0] : ', row[0]);
        done(null, row[0]);
      } else {
        done('미션다시뽑기 실패');
      }
    }
  });
}

//새로 선택한 미션으로 정보 업데이트
// data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
// missionInfo = {mission_no, mission_name, mission_reward, mlist_confirmdate, mission_expiration}
function updateMissionReselected(conn, data, missionInfo, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  //console.log('mission info : ', missionInfo);
  var newExpiredate = new Date(missionInfo.mlist_confirmdate);
  newExpiredate.setDate(newExpiredate.getDate() + missionInfo.mission_expiration);  //확인날짜 + 새로운 유효기간
  var params = [missionInfo.mission_no, missionInfo.mission_name,
    missionInfo.mission_reward, newExpiredate, data.user_no, data.mlist_no];
  //console.log('params', params);

  conn.query(sql.updateMissionReselected, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row) {
        console.log('update mlist reselected row : ', row);
        done(null, row);
      } else {
        done('미션리스트 업데이트 실패');
      }
    }
  });
}

//아이템 사용시, 사용시간과 사용한 미션 업데이트
function updateItemlistUse(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var itemUseDate = new Date(data.item_usedate);
  var params = [itemUseDate, data.mlist_no, data.user_no, data.itemlist_no];
  conn.query(sql.updateItemlistUse, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('update itemlist row :', row);
      if (row.affectedRows == 1) {
        done(null, data);  //데이터 재전송
      } else {
        done('아이템리스트 업데이트 실패');
      }
    }
  });
}

/*
 미션유효기간 3일늘리기 아이템
 */
function useItemExtendMissionExpiredate(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.updateItemExpiredate, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        console.log('update expiredate row : ', row);
        done(null, row);
      } else {
        done('미션 유효기간늘리기 업데이트 실패');
      }
    }
  });
}

/*
 미션패스 아이템
 1. itemlist update
 2. mlist_state = 4
 data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
 */
function useItemPassMission(conn, data, done) {
  if (!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.user_no, data.mlist_no];
  conn.query(sql.updateUsePassMissionState, params, function (err, row) {
    if (err) {
      done(err);
    } else {
      if (row.affectedRows == 1) {
        console.log('update pass mission state : ', row);
        done(null, row);
      } else {
        done('미션패스권 사용시 mlist_state 업데이트 실패');
      }
    }
  });
}

/*
 미션 내 마음대로 쓰기 아이템
 mlist_name 업데이트
 data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
 */
function useItemCustomMission(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  var params = [data.mission_name, data.user_no, data.mlist_no];
  conn.query(sql.updateCustomMissionName, params, function(err, row) {
    if(err) {
      done(err);
    } else {
      if(row.affectedRows == 1) {
        console.log('update custom mission name row : ', row);
        done(null, row);
      } else {
        done('미션 내마음대로 쓰기 아이템 사용 실패');
      }
    }
  });
}

//아이템 사용시, 상대방에게 사용한 아이템이름(과 변경된힌트) 푸시전송
function sendUseItemPush(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  async.waterfall(
    [
      function(done) {
        //partner_regid, item_name, item_hintchanged, mission_hint 조회
        selectUseItemPushInfo(conn, data, done);
      },
      function(pushInfo, done) {
        //send push
        //pushInfo = {partner_regid, item_name, item_hintchanged, mission_hint}
        var message = new gcm.Message();
        message.addData('type', 7+'');
        message.addData('item_no', data.item_no+'');
        if(pushInfo.item_hintchanged) {
          message.addData('mission_hint', pushInfo.mission_hint);
        }
        message.addData('item_usedate', pushInfo.item_usedate);
        message.addData('item_name', pushInfo.item_name);
        var registrationIds = [];
        registrationIds.push(pushInfo.partner_regid);

        commonDao.getSender().sendNoRetry(message, registrationIds, function (err, result) {
          if (err) {
            console.log('push err', err);
            done(err);
          } else {
            console.log('use item push result', result);
            //todo 안드랑 연결하면 주석풀기!!!!
            //if (result.success) {
            if (true) {
              done(null, pushInfo);  //pushInfo 그대로
            } else {
              done(err);
            }
          }
        });
      }
    ],
    function(err, result) {
      if(err) {
        done(err);
      } else if (result) {
        done(null, result);
      } else {
        done('아이템사용 푸시전송 실패');
      }
    }
  );
}

//아이템사용 푸시에 필요한 정보조회
//partner_regid, item_name, item_hintchanged, mission_hint
function selectUseItemPushInfo(conn, data, done) {
  if(!conn) {
    done('연결 에러');
    return;
  }
  console.log('data', data);
  var params = [data.user_no, data.itemlist_no, data.item_no];
  conn.query(sql.selectUseItemPushInfo, params, function(err, row) {
    if(err) {
      done(err);
    } else {
      console.log('use item push info row[0] : ', row[0]);
      if(row[0]) {
        done(null, row[0]);
      } else {
        done('아이템사용 푸시정보 조회 실패');
      }
    }
  });
}

//아이템목록 조회
exports.selectItems = selectItems;

//아이템사용
exports.selectMissionUseItem = selectMissionUseItem;
exports.buyItem = buyItem;
exports.useItem = useItem;
exports.sendUseItemPush = sendUseItemPush;