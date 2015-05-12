var mysql = require('mysql');
var db_config = require('./db_config');
var gcm = require('node-gcm');
var dao = require('./db_missions_dao');

var pool = mysql.createPool(db_config);

//missions목록조회
//oderby 0(최신순), 1(난이도순), 2(남자순), 3(여자순)
//state 0(실패) 1(성공) 2(패스)
exports.getlist = function (data, callback) {
  var success = 1;
  callback(success);
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
  1-1. theme으로 랜덤 select
  1-2. couple_no는 같고 user_no가 다른 유저(user_no, user_regid) select
  2. missionlist insert
  3. 2의 유저에게 push
 data = {user_no, couple_no, mission_theme}
 */
exports.add = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    } else {
      async.waterfall(
        [
          function(done) {
            //theme으로 mission select
            //user select
            dao.selectMissionandUser(conn, data, done);
          },
          function(arg1, done) {
            //insert missionlist
            dao.insertMissionlist(conn, arg1, done);
          },
          function(arg2, done) {
            //push
            dao.sendCreateMissionPush(arg2, done);
          }
        ],
        function(err) {
          if(err) {
            callback(err);
          } else {
            callback(null);
          }
        });  //async
    }
    conn.release();
  });  //getConnection
};

//missions확인
exports.confirm = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions삭제
exports.delete = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions성공
exports.success = function (data, callback) {
  var success = 1;
  callback(success);
};