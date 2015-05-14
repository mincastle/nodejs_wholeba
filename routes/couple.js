var express = require('express');
var router = express.Router();
var db_couple = require('../models/db_couple');
var moment = require('moment');
var util = require('../util/util');

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
  var bodydata = req.body;
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var auth_phone = bodydata.auth_phone;
  var user_gender = bodydata.user_gender;

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
      //TODO : 상대방이 이미 가입한 사람이라면 상대 regid 가져와서 push 보내기
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
        "user_gender" : result.other_gender,
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
      util.each([success], "couple_birth", util.dateFormat, function (err, result) {
        if (err) {
          fail_json.result.message = err;
          res.json(fail_json);
        } else {
          console.log('couple_birth success', success);
          success_json.result.message = '조회 성공';
          success_json.result.items = {
            "m_reward": result.m_reward,
            "m_condition": result.m_condition,
            "f_reward": result.f_reward,
            "f_condition": result.f_condition,
            "couple_condom" : result.couple_condom,
            "couple_birth": result.couple_birth
          };
          res.json(success_json);
        }
      });
    }
  });
});


//내기분설정
router.post('/mycondition', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  //var user_no = req.session.user_no;
  var user_no = req.session.user_no;
  var condition_no = bodydata.condition_no;
  var data = {user_no: user_no, condition_no: condition_no};

  db_couple.mycondition(data, function (err, success) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '내 기분 업데이트 성공';
      success_json.result.changedRows = success;
      res.json(success_json);
    }
  });
});


module.exports = router;