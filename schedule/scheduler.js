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
//var schedule = require('node-schedule');
//var mysql = require('mysql');
//var db_config = require('../models/db_config');
//var pool = mysql.createPool(db_config);
//var missiondao = require('../models/db_missions_dao');
//var userdao = require('../models/db_user_dao');
//var async = require('async');
//
//(function () {
//
//  var missionFailCron = '* * * * *'; //분 시 일 월 년 = 매분매시매일매월매년
//  missionFailScheduler(missionFailCron);
//
//  var pillsUpdateCron = '0 0 * * *'; //매일 00:00
//  pillsUpdateScheduler(pillsUpdateCron);
//
//}());
//
//
////매분마다 missionlist를 전체조회하여 유효기간이 지났으면 state=0으로 갱신
//function missionFailScheduler(cronstyle) {
//  schedule.scheduleJob(cronstyle, function () {
//    console.log('-------------update mission fail');
//    pool.getConnection(function(err, conn) {
//      if(err) {
//        console.log('mission fail err : ', err);
//      } else {
//        missiondao.updateMissionFail(conn, function(err) {
//          if(err) {
//            console.log('--------------mission fail err : ', err);
//          } else {
//            console.log('--------------update mission fail success!!');
//          }
//        });
//      }
//      conn.release();
//    });
//  });
//}
//
////매일 00:00이 되면 pills를 돌아 startdate+28 && user_pills=1인 사용자에
////한하여 pills 데이터에 새로 업데이트
//function pillsUpdateScheduler(cronstyle) {
//  schedule.scheduleJob(cronstyle, function() {
//    console.log('-------------------update user pills');
//    pool.getConnection(function(err, conn) {
//      if(err) {
//        console.log('update user pills err : ', err);
//      } else {
//        async.waterfall(
//          [
//            function(callback){
//              userdao.selectPillstoUpdate(conn, callback);
//            },
//            function(updateinfo, callback) {
//              async.each(updateinfo, function(pills, done) {
//                //최근 복용정보의 만기날짜 계산
//                var pills_expiredate = new Date(pills.pills_date);
//                pills_expiredate.setDate(pills_expiredate.getDate() + 28);
//                //console.log('pills : ', pills);
//                //console.log('pills expire date : ', pills_expiredate);
//                //계산된 날짜가 과거이면 새로 추가
//                if(pills_expiredate <= Date.now()) {
//                  console.log('insert pills user_no : ', pills.user_no);
//                  insertPill(conn, pills, done);
//                } else {
//                  console.log('dont need to insert user_no : ', pills.user_no);
//                  done(null); //추가안함 continue;
//                }
//              }, function(err) {
//                if(err) {
//                  callback(err);
//                } else {
//                  callback(null);
//                }
//              });
//            }
//          ],
//          function(err) {
//            if(err) {
//              console.log('update user pills err : ', err);
//            } else {
//              console.log('---------------update user pills success!!!');
//            }
//          }
//        )
//      }
//      conn.release();
//    });
//  });
//}
//
////pills 스케줄러 실행시, pills하나 추가
////data = [{pills_date, user_no, pills_time, user_pills}]
//function insertPill(conn, pills, done) {
//  if(!conn) {
//    done('연결 에러');
//    return;
//  }
//  var params = [pills.user_no, pills.pills_time, pills.pills_date];
//  conn.query(sql.insertPillstoUpdate, params, function(err, row) {
//    if(err) {
//      done(err);
//    } else {
//      if(row.affectedRows == 1) {
//        done(null);
//      } else {
//        done('pills 추가 실패');
//      }
//    }
//  });
//}