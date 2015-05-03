var express = require('express');
var router = express.Router();
var db_user = require('../models/db_user');

var fail_json = {
  "success": 0,
  "result": {
  }
}

var success_json = {
  "success": 1,
  "result": {
  }
}

//회원가입
router.post('/join', function (req, res, next) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var user_phone = req.body.user_phone;
  var user_regid = req.body.user_regid;
  var data = [user_id, user_pw, user_phone, user_regid];
  console.log('data',data);

  db_user.join(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result.affectedRows == 1) {
        success_json.result.message = "회원가입 성공";
        //success_json.result.user_no = result.insertId;
        //success_json.result.couple_no = result.couple_no;
        //TODO : session user_no, couple_no 저장
        req.session.user_no = result.insertId;
        req.session.couple_no = result.couple_no;
        res.json(success_json);
        console.log('waterfall result : ', result);
      } else res.json(fail_json);
    }
  });
});

//가입정보조회
router.get('/join', function (req, res, next) {
  var user_no = req.session.user_no | 9;
  var data = [user_no, user_no, user_no];

  db_user.join_info(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      //console.log('result', result);
      //join_code 값 세팅
      var join_code = result.user_req;
      if(result.user_req == 0) join_code =1;
      else join_code = 0;
      res.json({
        "success": 1,
        "result": {
          "message": "가입정보조회 성공",
          "items": {
            "join_code": join_code,
            "phone": result.phone
          }
        }
      });
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
      //success_json(res, "공통정보등록");
    } else {
      //fail_json(res, "공통정보등록");
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
      //success_json(res, "여성정보등록");
    } else {
      //fail_json(res, "여성정보등록");
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
      //success_json(res, "로그인");
    } else {
      //fail_json(res, "로그인");
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
      //fail_json(res, "기본값조회");
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
      //success_json(res, "로그아웃");
    } else {
      //fail_json(res, "로그아웃");
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
      //success_json(res, "회원탈퇴");
    } else {
      //fail_json(res, "회원탈퇴");
    }
  });
});


module.exports = router;
