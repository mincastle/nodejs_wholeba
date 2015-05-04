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
      console.log('err', err);
        fail_json.result.message = err;
        console.log('fail_json', fail_json);
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
  var user_no = req.session.user_no | -1;
  var data = [user_no, user_no, user_no];

  db_user.join_info(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result) {
        //join_code 값 세팅
        var join_code;
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
    }
  });
});

//공통정보등록
router.post('/common', function (req, res, next) {
  var user_no = req.session.user_no | -1;

  var couple_birth = req.body.couple_birth;
  var user_birth = req.body.user_birth;
  var data = [user_no, couple_birth, user_birth];

  db_user.common(data, function (err, result) {
    //console.log('result', result);
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result.affectedRows == 1) {
        success_json.result.message = "공통정보등록 성공";
        res.json(success_json);
      }
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
  var user_pills = req.body.user_pills; //현재에 약을 먹는지 안먹는지
  var pills_date = req.body.pills_date;
  var pills_time = req.body.pills_time;
  var period = [user_no, period_start, period_end, period_cycle];
  var syndromes = syndromes;
  var pills = [];
  if(user_pills == 1) {
    pills = [user_no, user_pills, pills_date, pills_time];
  }

  db_user.woman(pills, period, syndromes, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result) {
        success_json.result.message = "여성정보등록 성공";
        res.json(success_json);
      }
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

  db_user.login(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result) {
        //TODO session setting
        //user_phone과 user_regid가 넘어오긴하지만 최신정보가 아니므로 사용하면 안됨!
        req.session.user_no = result.user_no;
        req.session.couple_no = result.couple_no;
        success_json.result.message = "로그인 성공";
        res.json(success_json);
      }
    }
  });
});

//기본값 조회
router.get('/userinfo', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var data = [user_no, user_no];

  db_user.userinfo(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(result) {
        res.json({
          "success": 1,
          "result": {
            "message": "기본값조회 성공",
            "items": {
              "user_no": result.user_no,
              "couple_no": result.couple_no,
              "condom": result.condom,
              "gender": result.user_gender
            }
          }
        });
      }
    }
  });
});

//로그아웃
router.post('/logout', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  //var data = [user_no];

  //TODO redis세션 처리
  req.session.destroy(function(err) {
    if(err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = "로그아웃 성공";
      res.json(success_json);
    }
  });

  //db_user.logout(data, function (success) {
  //  if (success) {
  //    //success_json(res, "로그아웃");
  //  } else {
  //    //fail_json(res, "로그아웃");
  //  }
  //});
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


























