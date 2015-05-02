var express = require('express');
var router = express.Router();
//var db_user = require('../models/db_user');
var db_model = require('../models/db_model');
var db_sqlscript = require('../models/db_sqlscript');

/* 회원가입

 작업 순서 :
 1. 가입한 회원이 couple table의 authphone에 등록되어있는지 확인한다.(couple_is가 0인 회원 중)
  1-1. authphone이 등록 되어있지 않는 사람
    1-1-1. 새로운 couple을 생성한다.
    1-1-2. 생성된 couple_no값과 함께 user 테이블에 user를 생성한다.(insert)
  1-2. authphone이 등록 되어있는 사람
    1-2-1. 기존 가입 사용자의 요청을 받은 사람이므로 커플의 no를 가져온다.
    1-2-2. 가져온 couple_no값과 함께 user 테이블에 user를 생성한다.(insert)
    1-2-3. couple table의 couple_is를 1로 업데이트 한다.
 2. 처리된 결과를 약속된 형태로 가공한다.
 3. 가공된 result 값을 json으로 전송해준다.
 */

router.post('/join', function (req, res, next) {
  //var user_id = req.body.user_id;
  //var user_pw = req.body.user_pw;
  //var user_phone = req.body.user_phone;
  //var user_regid = req.body.user_regid;

  var result = {
    "success" : "0",
    "result" : {}
  };
  var user_phone = req.body.user_phone;
  var data = [user_phone];





  //db_model.selectOne(db_sqlscript.sqlFindAuth, data, function (output) {
  //  if(output[0] == 0) {  // 1-1. authphone이 등록 되어있지 않는 사람
  //    db_model.insert(db_sqlscript.sqlSaveCouple, [], function (output) { //  1-1-1. 새로운 couple을 생성한다.
  //      if (output.affectedRows == 1) { // insert 성공시
  //        var insertId = output.insertId;
  //
  //        // 1-1-2. 생성된 couple_no값과 함께 user 테이블에 user를 생성한다.(insert)
  //
  //
  //        // 2. 처리된 결과를 약속된 형태로 가공한다.
  //        result.success = "1";
  //        result.result.message = output;
  //
  //        // 3. 가공된 result 값을 json으로 전송해준다.
  //        res.json(result);
  //      } else {
  //
  //        // 2. 처리된 결과를 약속된 형태로 가공한다.
  //        result.success="0";
  //        result.result.message = output;
  //        // 3. 가공된 result 값을 json으로 전송해준다.
  //        res.json(result);
  //      }
  //    });
  //  } else {  // 1-2. authphone이 등록 되어있는 사람
  //    res.json(output);
  //  }
  //});
});


//가입정보조회
router.get('/join', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var data = [user_no];

  db_user.join_info(data, function (success) {
    if (success) {
      res.json({
        "success": 1,
        "result": {
          "message": "가입정보조회 성공",
          "items": {
            "join_code": 0,
            "phone": "010-0000-0000"
          }
        }
      });
    } else {
      fail_json(res, "가입정보조회");
    }
  });
});

//공통정보등록
router.post('/common', function (req, res, next) {
  var user_no = req.session.user_no | -1;

  var couple_birth = req.body.couple_birth;
  var user_birth = req.body.user_birth;
  var data = [user_no, couple_birth, user_birth];

  db_user.common(data, function (success) {
    if (success) {
      success_json(res, "공통정보등록");
    } else {
      fail_json(res, "공통정보등록");
    }
  });
});

//여성정보등록
router.post('/woman', function (req, res, next) {
  var user_no = req.session.user_no | -1;

  var period_start = req.body.period_start;
  var period_end = req.body.period_end;
  var period_cycle = req.body.period_cycle;
  //todo 객체의 배열 받는 법?
  var syndromes = req.body.syndromes; //객체의 배열
  var user_pills = req.body.user_pills;
  var pills_date = req.body.pills_date;
  var pills_time = req.body.pills_time;
  var data = [user_no, period_start, period_end, period_cycle, syndromes, user_pills, pills_date, pills_time];

  db_user.woman(data, function (success) {
    if (success) {
      success_json(res, "여성정보등록");
    } else {
      fail_json(res, "여성정보등록");
    }
  });
});

//로그인
router.post('/login', function (req, res, next) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var user_phone = req.body.user_phone;
  var user_regid = req.body.user_regid;
  var data = [user_id, user_pw, user_phone, user_regid];

  db_user.login(data, function (success) {
    if (success) {
      success_json(res, "로그인");
    } else {
      fail_json(res, "로그인");
    }
  });
});

//기본값 조회
router.get('/userinfo', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var data = [user_no];

  db_user.userinfo(data, function (success) {
    if (success) {
      res.json({
        "success": 1,
        "result": {
          "message": "기본값조회 성공",
          "items": {
            "user_no": 1,
            "couple_no": 1,
            "condom": 1,
            "gender": "F"
          }
        }
      });
    } else {
      fail_json(res, "기본값조회");
    }
  });
});

//로그아웃
router.post('/logout', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  //var user_no = 1;
  var data = [user_no];

  db_user.logout(data, function (success) {
    if (success) {
      success_json(res, "로그아웃");
    } else {
      fail_json(res, "로그아웃");
    }
  });
});

//회원탈퇴
router.post('/withdraw', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var couple_no = req.session.couple_no | -1;
  var data = [user_no, couple_no];

  db_user.withdraw(data, function (success) {
    if (success) {
      success_json(res, "회원탈퇴");
    } else {
      fail_json(res, "회원탈퇴");
    }
  });
});


module.exports = router;
