var mysql = require('mysql');
var db_config = require('./db_config');
var dao = require('./db_items_dao');
var pool = mysql.createPool(db_config);
var async = require('async');

/*
  아이템록조회
  모든 아이템목록을 주면 클라이언트에서 살 수 있는지 없는지 판단
 */
exports.getlist = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    }
    dao.selectItems(conn, callback);
  });
};


/*
 아이템사용
 0. itemlist에 item_usemission = mlist_no가 있나 확인 (미션에 이미 아이템을 사용했는지)
 1. 아이템 구매
   1-1. 아이템의 가격 조회(item_exchange)
   1-2. 리워드 차감(updateUserReward)
   1-3. 리워드 푸시(push reward)
   1-4. 아이템리스트 테이블에 추가(insert itemlist, insertId넘겨줘야함)
 2. 아이템에 따른 사용
   2-1. item마다........처리리(item_no)
   2-2. itemlist_no에 사용한 미션, 아이템사용시간 업데이트(item_usemission, item_usedate)
3. 사용결과 파트너에게 전송(+hint)
   3-1. 파트너 regid 조회
   3-2-1.미션다시 뽑았을 경우 (아이템이름+hint)
   3-2-2.미션패스or내가쓰기 (아이템이름만)
 data = {user_no, item_no, mlist_no, mission_name, item_usedate}
 */
exports.use = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      callback(err);
    }
    conn.beginTransaction(function(err) {
      if(err) {
        conn.rollback(function() {
          callback(err);
        });
      } else {
        async.waterfall(
          [
            function(done) {
              //해당미션이 아이템사용이 가능한지 확인(이전에 아이템사용했는지)
              dao.selectMissionUseItem(conn, data, done);
            },
            function(arg1, done) {
              //아이템 구매 + 리워드 푸시
              dao.buyItem(conn, data, done);
            },
            function(insertItemlistInfo, done) {
              // data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
              data.itemlist_no = insertItemlistInfo.insertId;
              dao.useItem(conn, data, done);
            },
            function(insertItemlistInfo2, done) {
              //data = {user_no, item_no, mlist_no, itemlist_no, mission_name, item_usedate}
              dao.sendUseItemPush(conn, insertItemlistInfo2, done);
            }
          ],
          function(err, result) {
            if(err) {
              conn.rollback(function() {
                callback(err);
              });
            } else if(result){
              conn.commit(function(err) {
                if(err) {
                  conn.rollback(function() {
                    callback(err);
                  });
                } else {
                  callback(null, result);
                }
              }); //commit
            } else {
              conn.rollback(function() {
                callback(err);
              });
            }
        });  //async
      }
      conn.release();
    });  //transaction
  });
};


/*
  아이템구매
  1. 아이템의 exchange 만큼 내 리워드 빼기 + 리워드 푸시
  2. insert itemlist
 */
//exports.buy = function (data, callback) {
//  var success = 1;
//  callback(success);
//};


//보유아이템조회
//exports.own = function (data, callback) {
//  var success = 1;
//  callback(success);
//};
