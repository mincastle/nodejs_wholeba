var express = require('express');
var router = express.Router();
var db_user = require('../models/db_user');

var fail_json = {
  "success": 0,
  "result": {}
};

var success_json = {
  "success": 1,
  "result": {}
};

//회원가입
router.post('/join', function (req, res, next) {
  var bodydata = req.body;

  var user_id = bodydata.user_id;
  var user_pw = bodydata.user_pw;
  var user_phone = bodydata.user_phone;
  var user_regid = bodydata.user_regid;
  var user_regdate = bodydata.user_regdate;

  if (!user_regid) {
    next(new Error('reg_id 입력이 안되었습니다.'));
  }

  var data = {
    "user_id": user_id,
    "user_pw": user_pw,
    "user_phone": user_phone,
    "user_regid": user_regid,
    "user_regdate" : user_regdate
  };
  console.log('data', data);

  db_user.join(data, function (err, result) {
    if (err) {
      console.log('err', err);
      fail_json.result.message = err;
      console.log('fail_json', fail_json);
      res.json(fail_json);
    } else {
      if (result.affectedRows == 1) {
        success_json.result = {};
        success_json.result.message = "회원가입 성공";
        success_json.result.user_no = result.user_no;
        req.session.user_no = result.user_no;
        res.json(success_json);
      } else {
        res.json(fail_json);
      }
    }
  });
});

//가입정보조회
router.get('/join', function (req, res, next) {
  var user_no = req.session.user_no;
  //세션 체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }
  var couple_no = req.session.couple_no;
  var data = {"user_no": user_no, "couple_no": couple_no};
  console.log('join_date', data);
  db_user.join_info(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      console.log('join_get_fail', fail_json);
      res.json(fail_json);
    } else {
      if (result) {
        success_json.result = {};  //reset
        //console.log('join_info result-----' , result);
        //공백일 경우 채워넣기
        if (result.join_code == undefined) result.join_code = -1;
        if (result.phone == undefined) result.phone = "";
        if (result.user_gender == undefined) result.user_gender = "";
        if (result.user_req == undefined) result.user_req = -1;

        success_json.result.message = "가입정보조회 성공";
        success_json.result.items = {
          "join_code": result.join_code,
          "partner_phone": result.phone,
          "user_gender": result.user_gender,
          "user_req": result.user_req
        };
        console.log('join_get', success_json);
        res.json(success_json);
      }
    }
  });
});

//공통정보등록
router.post('/common', function (req, res, next) {
  var bodydata = req.body;

  var user_no = req.session.user_no;
  //세션체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  } else if (!req.body.user_birth) {
    fail_json.result.message = "사용자의 생일 입력값 없음";
    res.json(fail_json);
  }

  var couple_birth = bodydata.couple_birth;
  var user_birth = bodydata.user_birth;
  var data = {"user_no": user_no, "couple_birth": couple_birth, "user_birth": user_birth};

  console.log('data', data);
  db_user.common(data, function (err, result) {
    //console.log('result', result);
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = "공통정보등록 성공";
      console.log('common_post', success_json);
      res.json(success_json);
    }
  });
});

//여성정보등록
router.post('/woman', function (req, res, next) {
  var bodydata = req.body;

  var user_no = req.session.user_no;
  //세션체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }
  var period_start = bodydata.period_start;
  var period_end = bodydata.period_end;
  var period_cycle = bodydata.period_cycle;
  //todo 객체의 배열 받는 법?
  //var syndromes = bodydata.syndromes; //객체의 배열
  var user_pills = bodydata.user_pills; //현재에 약을 먹는지 안먹는지
  var pills_date = bodydata.pills_date;
  var pills_time = bodydata.pills_time;
  var period = {
    "user_no": user_no,
    "period_start": period_start,
    "period_end": period_end,
    "period_cycle": period_cycle
  };
  var reqSyndromes = bodydata.syndromes;
  var syndromes = {
    "user_no" : user_no,
    "items" : reqSyndromes
  };

  var pills = {"user_no": user_no, "user_pills": user_pills, "pills_date": pills_date, "pills_time": pills_time};

  console.log('period', period);
  console.log('pills', pills);
  db_user.woman(pills, period, syndromes, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if (result) {
        success_json.result = {};  //reset
        success_json.result.message = "여성정보등록 성공";
        res.json(success_json);
      }
    }
  });
});

//로그인
router.post('/login', function (req, res, next) {
  var bodydata = req.body;

  var user_id = bodydata.user_id;
  var user_pw = bodydata.user_pw;
  var user_phone = bodydata.user_phone;
  var user_regid = bodydata.user_regid;
  var data = {"user_id": user_id, "user_pw": user_pw, "user_phone": user_phone, "user_regid": user_regid};
  console.log('login data', data);
  db_user.login(data, function (err, result) {
    if (err) {
      var accept_json = {};
      accept_json.result = {};
      if(err == 'userphone changed') {
        accept_json.success = 2;
        accept_json.result = {};
        accept_json.result.items = result;
      }
      accept_json.result.message = err;
      res.json(accept_json);
    } else {
      if (result) {
        //TODO session setting
        //user_phone과 user_regid가 넘어오긴하지만 최신정보가 아니므로 사용하면 안됨!
        req.session.user_no = result.user_no;
        req.session.couple_no = result.couple_no;

        success_json.result = {};
        success_json.result.message = "로그인 성공";
        success_json.result.items = result;
        console.log('join_post', success_json);
        res.json(success_json);
      } else {
        fail_json.result.message = "로그인 실패";
        res.json(fail_json);
      }
    }
  });
});

router.post('/acceptlogin', function (req, res, next) {
  var bodydata = req.body;

  var user_no = bodydata.user_no;
  var user_phone_old = bodydata.user_phone_old;
  var user_regid_old = bodydata.user_regid_old;
  var user_phone = bodydata.user_phone;
  var user_regid = bodydata.user_regid;

  var data = {
    user_no : user_no,
    user_phone_old: user_phone_old,
    user_regid_old: user_regid_old,
    user_phone: user_phone,
    user_regid: user_regid
  };

  db_user.acceptlogin(data, function (err, result) {
    if (err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if (result) {
        // 업데이트도 완료, push 보내기도 완료 되었다면 세션을 생성하고 로그인 처리 완료
        req.session.user_no = result.user_no;
        req.session.couple_no = result.couple_no;
        success_json.result = {};
        success_json.result.message = '중복 로그인 처리 성공!';
        success_json.result.items = result;
        // TODO : 상대 regid에 push를 보내 로그아웃 시킨다.
        console.log('acceptlogin_post', success_json);
        res.json(success_json);

      } else {
        fail_json.result.message = "중복 로그인 처리 실패";
        res.json(fail_json);
      }
    }
  });
});

//로그아웃
router.post('/logout', function (req, res, next) {
  var user_no = req.session.user_no;
  //세션체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  } else {
    var data = {"user_no": user_no};

    db_user.logout(data, function (err, result) {
      if (err) {
        fail_json.result.message = err;
        res.json(fail_json);
      } else if (result) {
        //TODO redis세션 처리
        req.session.destroy(function (err) {
          if (err) {
            fail_json.result.message = err;
            res.json(fail_json);
          } else {
            success_json.result.message = "로그아웃 성공";
            res.json(success_json);
          }
        });
      } else {
        fail_json.result.message = '로그아웃 실패';
        res.json(fail_json);
      }
    });
  }
});

/*
   회원탈퇴
   1. 상대방의 user_no, regid를 조회한다.
   2. 그리고 자신과 상대방의 user_withdraw를 1로 업데이트한다.(탈퇴)
   3. couple_withdraw도 1로 한다.
   4. 상대방 regid로 탈퇴되었다고 push한다.
 */
router.post('/withdraw', function (req, res, next) {
  var user_no = req.session.user_no;
  //세션체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

  var couple_no = req.session.couple_no;
  var data = {
    user_no :user_no,
    couple_no : couple_no
  };

  db_user.withdraw(data, function (err, result) {
    if (err) {
      fail_json.result.message = "회원탈퇴 실패";
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '회원탈퇴 성공';
      success_json.result.data = result;
      // TODO : 상대방에게 push 보내기
      res.json = success_json;
    }
  });
});


module.exports = router;
