var express = require('express');
var router = express.Router();
var db_couple = require('../models/db_couple');
var moment = require('moment');

var fail_json = {
  "success": 0,
  "result": {
  }
};

var success_json = {
  "success": 1,
  "result": {
  }
};

/*
 커플요청 Parameter { user_no, auth_phone, user_gender }
 1. 커플 요청을 하면 couple을 생성(auth_phone) 한다.
 2. 요청한 user_no의 couple_no와 gender, user_req를 업데이트해준다. (요청 했음을 기억하기 위해서)
 */


router.post('/ask', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var auth_phone = req.body.auth_phone;
  var user_gender = req.body.user_gender;

  var data = {
    user_no : user_no,
    auth_phone : auth_phone,
    user_gender : user_gender
  };

  db_couple.ask(data, function (err, result) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '커플요청 성공';
      success_json.result.insertId = result;
      req.session.couple_no = result;
      //console.log('req.session.couple_birth', req.session.couple_birth);
      res.json(success_json);
    }
  });
});

/*
 커플승인 Parameter [user_no]
 1. 커플 요청을 받은 사람인지 확인한 후, 조회한 couple_id를 갖고 온다.
 2. 해당 couple_no에 couple_is를 1로 변경해준다.
 3. 승인한 user의 couple_no, user_gender(남->여, 여->남), user_req를 업데이트 해준다.
 */
router.post('/answer', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var data = {
    user_no: user_no
  };

  db_couple.answer(data, function (err, result) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '커플승인 성공';
      success_json.result.items = {
        "couple_no" : result.couple_no,
        "gender" : result.other_gender,
        "user_req" :  result.user_req
      };
      res.json(success_json);
    }
  });
});


//커플정보조회(메인)
router.get('/', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;
  var data = {couple_no : couple_no};

  db_couple.getinfo(data, function (err, success) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '조회 성공';
      success_json.result.items = {
        "m_reward": success.m_reward,
        "m_condition": success.m_condition,
        "m_level": success.m_level,
        //"m_mission_stage": 1,
        "f_reward": success.f_reward,
        "f_condition": success.f_condition,
        "f_level": success.f_level,
        //"f_mission_stage": 1,
        //"f_period": 2,
        //"f_pregnancy": 30,
        "couple_birth": moment(success.couple_birth).format('YYYY-MM-DD')
      };
      res.json(success_json);
    }
  });
});


//내기분설정
router.post('/mycondition', function (req, res, next) {
  //var user_no = req.session.user_no;
  var user_no = req.session.user_no | -1;
  var user_condition = req.body.user_condition;
  var data = [user_no, user_condition];

  db_couple.mycondition(data, function (success) {
    if (success) {
      //success_json(res, "내기분설정");
    } else {
      //fail_json(res, "내기분설정");
    }
  });
});

//상대방격려하기
router.post('/yourcondition', function (req, res, next) {
  //var user_no = req.session.user_no;
  var user_no = req.session.user_no | -1;
  var couple_no = req.session.couple_no | -1;
  var your_condition = req.body.your_condition;
  var data = [user_no, couple_no, your_condition];

  db_couple.yourcondition(data, function (success) {
    if (success) {
      //success_json(res, "상대방격려하기");
    } else {
      //fail_json(res, "상대방격려하기");
    }
  });
});


module.exports = router;