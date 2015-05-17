/**
 * Created by 장 한솔 on 2015-05-15.
 */
var mysql = require('mysql');
var db_config = require('./db_config');
var sql = require('./db_sql');
var async = require('async');
var gcm = require('node-gcm');
var pool = mysql.createPool(db_config);
//gcm sender
var sender = new gcm.Sender('AIzaSyBtz1plKo81Edizatu0vhhl9trNiFwtGb8'); //server key

//다른 dao에서 푸시 접근시 사용
function getSender() {
  return sender;
}

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

//리워드 변화시 조회해서 푸시
//data 입력값 그대로 result
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
        var message = new gcm.Message();
        message.addData('type', 8+'');
        message.addData('reward_cnt', rewardInfo.reward_cnt+'');

        var registrationIds = [];
        registrationIds.push(rewardInfo.user_regid);
        console.log('reward push regid : ', rewardInfo.user_regid);
        console.log('reward push regid length : ', rewardInfo.user_regid.length);

        sender.sendNoRetry(message, registrationIds, function (err, result) {
          if (err) {
            console.log('push err', err);
            done(err);
          } else {
            console.log('reward push result', result);
            //todo 안드랑 연결하면 주석풀기!!!!
            //if (result.success) {
            if (true) {
              done(null, data);  //data 그대로
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

//get gcm sender
exports.getSender = getSender;

//리워드갯수 갱신
exports.updateUserReward = updateUserReward;

//리워드변화시에 매번 사용, 리워드조회해서 총갯수 푸시
exports.sendRewardPush = sendRewardPush;