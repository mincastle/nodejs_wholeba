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
var sender = new gcm.Sender('AIzaSyAl_chJ0kOOLwd9OLk68awMNr9I_grA3SM'); //server api key

//미션생성시, theme을 랜덤으로 고르고, 미션수행할 유저 조회
//data = {user_no, couple_no, mission_theme}
function selectMissionandUser(data, callback) {
  result = {};
  async.parallel(
    [
      function(done) {
        selectMission(data, done);
      },
      function(done) {
        selectPartner(data, done);
      }
    ],
    function(err, res) {
      if(err) {
        callback(err);
      } else {
        console.log('select mission and user result : ', res);
        //결과를 {user_no, mission} 형식으로세팅
        if(res[0].mission == 1) {
          result.mission = res[0].row;
          result.user_no = res[1].user_no;
          result.user_regid = res[1].user_regid;
        } else {
          result.mission = res[1].row;
          result.user_no = res[0].user_no;
          result.user_regid = res[0].user_regid;
        }
        callback(null, result);
      }
  });
}

//테마에 따라 미션 랜덤으로 한개 조회
function selectMission(data, done) {
  var result = {};
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err)
    } else {
      var param = [data.mission_theme];
      conn.query(sql.selectMissionTheme, param, function(err, row) {
        if(err) {
          done(err);
        } else {
          if(row[0]) {
            result.mission = 1;
            result.row = row[0];
            done(null, result);
          } else {
            done('랜덤으로 미션 1개 조회 실패');
          }
        }
      });
    }
  });
}

//미션을 수행할 유저 조회
function selectPartner(data, done) {
  pool.getConnection(function(err, conn) {
    if(err) {
      done(err);
    } else {
      var params = [data.couple_no, data.user_no];
      conn.query(sql.selectPartner, params, function(err,  row) {
        if(err) {
          done(err);
        } else {
          if(row[0].user_no) {
            done(null, row[0]);
          } else {
            done('상대방(미션수행자) 조회 실패');
          }
        }
      });
    }
  });
}

//missionlist 테이블에 생성
//data = {user_no, user_regid, mission(mission_no, mission_name, mission_expiration, mission_reward)}
function insertMissionlist(data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      var params = [data.user_no, data.mission.mission_no, data.mission.mission_name, data.mission.mission_reward];
      conn.query(sql.insertMissionlist, params, function(err, row) {
        if(err) {
          callback(err);
        } else {
          if(row.affectedRows == 1) {
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
  });
}

//미션 생성시, 미션수행자에게 미션이 생성되었음을 알리는 푸시전송
//mlist_no, mission_name, mission_level 보내줘야함
function sendCreateMissionPush(data, done) {
  var message = new gcm.Message;
  var regid = [data.user_regid];

  //todo type 정한 후 바꾸어야함
  message.addData('type', 3);
  message.addData('mlist_no', data.mlist_no);
  message.addData('mission_name', data.mission.mission_name);
  //message.addData('mission_level', data.mission.mission_level);
  sender.sendNoRetry(message, regid, function (err, result) {
    if(err) {
      console.log('err', err);
      done(err);
    }
    else {
      if(result) {
        console.log('result', result);
        done(null);
      } else {
        done(err);
      }
    }
  });
}


//미션생성
exports.selectMissionandUser = selectMissionandUser;
exports.insertMissionlist = insertMissionlist;
exports.sendCreateMissionPush = sendCreateMissionPush;