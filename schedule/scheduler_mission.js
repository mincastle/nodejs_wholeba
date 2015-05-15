///**
// * Created by 장 한솔 on 2015-05-14.
// */
//
//
///*cron : 리눅스의 반복작업을 할 때 사용
//  cron style
//    [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR {optional}]
//   분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-7 : 0or7이 일요일)
// */
//
//(function () {
//  var schedule = require('node-schedule');
//  var mysql = require('mysql');
//  var db_config = require('../models/db_config');
//  var pool = mysql.createPool(db_config);
//  var dao = require('../models/db_missions_dao');
//
//  var cronStyle = '* * * * *'; //분 시 일 월 년 = 매분매시매일매월매년
//  schedule.scheduleJob(cronStyle, function () {
//    console.log('--------------------update mission fail');
//    pool.getConnection(function(err, conn) {
//      if(err) {
//        console.log('mission fail err : ', err);
//      } else {
//        dao.updateMissionFail(conn, function(err) {
//          if(err) {
//            console.log('--------------------mission fail err : ', err);
//          } else {
//            console.log('--------------------update mission fail success!!');
//          }
//        });
//      }
//      conn.release();
//    });
//  });
//}());
////매분마다 missionlist를 전체조회하여 유효기간이 지났으면 state=0으로 갱신