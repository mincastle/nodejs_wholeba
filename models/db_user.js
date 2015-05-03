var mysql = require('mysql');
var db_config = require('./db_config');
var async = require('async');

var pool = mysql.createPool(db_config);
var sql = "";

/*
 * 회원가입
 * 내 번호가 이미 커플의 인증번호에 있으면 커플을 이어주고 유저생성,
 * 없으면 새로운 커플과 유저를 생성
 * 1. count(couple의 auth_phone == user_phone)
 * 2. insert into couple -> 3. insert into user
 * 2. or update couple -> 3. insert into user
 */
exports.join = function (data, callback) {
  async.waterfall([
    function(done) {
      checkAuthPhone(data, done);
    },
    function(arg1, done) {
      getCoupleNo(data, arg1, done);
    },
    function(arg2, done) {
      insertUser(arg2, done);
    }],
    function(err, result) {
      if(err) {
        console.log('err', err);
        callback(err, null);
      } else {
        console.log('result', result);
        callback(null, result);
    }
  });
};

//auth_phone check
function checkAuthPhone(data, done) {
  pool.getConnection(function(err, conn) {
    if(err) console.log('err', err);
    else {
      //auth_phone에 user_phone이 있는지 없는지 확인
      //있을 경우의 user insert를 위해 couple_no도 조회한다
      sql = 'select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is = 0;';
      conn.query(sql, [data[2]], function(err, row) {
        if(err) {
          console.log('err', err);
          done(err, null);
        } else {
          console.log('row', row[0]);
          done(null, row[0]);
          conn.release();
        }
      });
    }
  });
}

//get couple_no
function getCoupleNo(data, arg1, done) {

  var user_req = 1;

  pool.getConnection(function(err, conn) {
    if(err) console.log('connection err', err);
    else {
      // auth_phone이 없으므로 couple 생성으로 couple_no를 얻는다
      if(arg1.cnt == 0) {
        sql = 'insert into couple values();';
        conn.query(sql, [], function (err, row) {
          if(err) {
            console.log('err', err);
            done(err, null);
            conn.release();
          } else {
            console.log('row', row);
            data.push(row.insertId);  //새로 생성된 couple_no 넣기
            data.push(user_req);      //커플요청자
            done(null, data);
            conn.release();
          }
        });
      }
      // auth_phone이 있으므로 있는 couple_no를 갖다씀
      else {
        if(arg1.couple_no) {
          //console.log('null', null);
          user_req = 0;
          data.push(arg1.couple_no);   //기존에 존재하던 couple_no 넣기
          data.push(user_req);         //커플승인자
          done(null, data);
          conn.release();
        } else {
          console.log('arg1.couple_no', arg1.couple_no);
          done('couple_no undefined', null);
          conn.release();
        }
      }
    }
  });
}

//insert user
function insertUser(arg2, done) {
  pool.getConnection(function(err, conn) {
    if(err) console.log('connection err : ', err);
    sql = 'insert into user(user_id, user_pw, user_phone, user_regid, couple_no, user_req) values(?, ?, ?, ?, ?, ?)';
    conn.query(sql, arg2, function(err, row) {
      if(err) done(err, null);
      row.couple_no = arg2[4];  //couple_no 넘겨주기
      done(null, row);
      conn.release();
    });
  });
}

/*
 * 가입정보조회
 * 해당 사용자가 커플 요청을 한사람인지, 받은 사람인지의 여부
 * + 받은사람이라면 상대의 휴대폰 번호를 같이 리턴
 */

exports.join_info = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      console.log('connection err', err);
      callback(err, null);
    }
    sql = 'select distinct (select user_req from user where user_no=?) as user_req, (select user_phone from user where couple_no in (select couple_no from user where user_no=?) and not(user_no = ?) )as phone from user;';
    conn.query(sql, data, function(err, row) {
      if(err) callback(err, null);
      //console.log('row', row[0]);
      conn.release();
      callback(null, row[0]);
    });
  });
};

//공통정보등록
exports.common = function (data, callback) {
  var success = 1;
  callback(success);
};

//여성정보등록
exports.woman = function (data, callback) {
  var success = 1;
  callback(success);
};

//로그인
exports.login = function (data, callback) {
  var success = 1;
  callback(success);
};

//사용자기본값조회
exports.userinfo = function (data, callback) {
  var success = 1;
  callback(success);
};

//로그아웃
exports.logout = function (data, callback) {
  var success = 1;
  callback(success);
};

//회원탈퇴
exports.withdraw = function (data, callback) {
  var success = 1;
  callback(success);
};
