var mysql = require('mysql');
var db_config = require('./db_config');
var async = require('async');
var dao = require('./db_couple_dao');

var pool = mysql.createPool(db_config);

/*
 커플요청 Parameter { user_no, auth_phone, user_gender }
  1. 커플 요청을 하면 couple을 생성(couple_birth, auth_phone) 한다.
  2. 요청한 user_no의 couple_no와 gender, user_req를 업데이트해준다. (요청 했음을 기억하기 위해서)
 */

exports.ask = function (data, callback) {
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
              dao.insertMakeCouple(conn, data, done);
            }, function (arg1, done) {
              dao.updateUserGenderandCoupleNoandUserReq(conn, data, arg1, done);
            }],
            function (err, insertId) {
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
                    callback(null, insertId);
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

/*
 커플승인 Parameter [user_no]
  1. 커플 요청을 받은 사람인지 확인한 후, 조회한 couple_id를 갖고 온다.
  2. 해당 couple_no에 couple_is를 1로 변경해준다.
  3. 승인한 user의 couple_no, user_gender(남->여, 여->남), user_req를 업데이트 해준다.

  4. //TODO : 승인된 커플들의 reward를 생성한다.???
 */
exports.answer = function (data, callback) {
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
              dao.selectCheckAnswerCouple(conn, data, done);
            },function (couple_no, done) {
              dao.updateCoupleIs(conn, couple_no, done);
            }, function (couple_no, done) {
              dao.selectOtherGender(conn, couple_no, data, done);
            }, function (couple_no, other_gender, done) {
              dao.updateUserCoupleNoandGenderandUserReq(conn, couple_no, other_gender, data, done);
            }],
            function (err, result) {
              conn.commit(function(err) {
                if (err) {
                  conn.rollback(function () {
                    callback(err);
                  });
                } else {
                  callback(null, result);
                }
              });
            });
        }
        conn.release();
      });  //begin transaction
    }
  });


};

//커플정보조회
exports.getinfo = function (data, callback) {
  //var success = 1;
  //callback(success);
  dao.selectCoupleInfo(data, callback);

};

//내기분변경
exports.mycondition = function (data, callback) {
  var success = 1;
  callback(success);
};

//상대방격려하기(날라온 행동을 push)
exports.yourcondition = function (data, callback) {
  var success = 1;
  callback(success);
};