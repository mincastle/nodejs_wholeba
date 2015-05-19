var express = require('express');
var router = express.Router();
var db_setting = require('../models/db_setting');

var fail_json = {
  "success": 0,
  "result": {}
}

var success_json = {
  "success": 1,
  "result": {}
};

//여성정보공개설정
router.post('/public', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;
  var user_public = parseInt(bodydata.user_public);
  var data = {
    "user_no" : user_no,
    "user_public" : user_public
  };
  //세션체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }
  db_setting.setPublic(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = '여성정보공개설정 성공';
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '여성정보공개설정 실패';
      res.json(success_json);
    }
  });
});

//여성정보조회
router.get('/herself/:user_gender', function (req, res, next) {
  var user_no = req.session.user_no;
  var couple_no = req.session.couple_no;
  var user_gender = req.params.user_gender;
  var data = {
    "user_no" : user_no,
    "couple_no" : couple_no,
    "user_gender" : user_gender
  };
  //세션체크
  if (!user_no) {
    fail_json.result = {};
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  } else if(!couple_no) {
    fail_json.result = {};
    fail_json.result.message = "커플세션정보 없음";
    res.json(fail_json);
  }

  //result = [] 안에, 생리주기(객체의배열)와 피임약복용여부(객체)가
  //순서를 모른채 들어있음
  db_setting.herself(data, function (err, result) {
    if (result) {
      var pills = {};
      var periods = [];
      if(result[0].user_pills != undefined) {
        pills = result[0];
        periods = result[1];
      } else {
        pills = result[1];
        periods = result[0];
      }
      //기본값세팅
      if(pills.user_pills == 0) {
        pills.pills_date = '';
        pills.pills_time = '';
        pills.pills_no = -1;
      }
      //평균주기 계산
      var cycleSum = 0;
      for(i in periods) {
        cycleSum += periods[i].period_cycle;
      }
      var avg_cycle = cycleSum / periods.length;
      success_json.result = {};
      success_json.result.message = '여성정보조회 성공';
      success_json.result.items = {
        "period_cnt" : periods.length,
        "avg_cycle" : avg_cycle,
        "period" : periods,
        "pills_no" : pills.pills_no,
        "user_pills" : pills.user_pills,
        "pills_date" : pills.pills_date,
        "pills_time" : pills.pills_time
      }
      res.json(success_json);
    } else {
      fail_json.result = {};
      fail_json.result.message = '여성정보조회 실패';
      res.json(fail_json);
    }
  });
});


//주기수정
router.post('/herself/:period_no', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var period_no = req.params.period_no;
  var data = [user_no, period_no];

  db_setting.updatePeriod(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = '여성정보공개설정 성공';
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '여성정보공개설정 실패';
      res.json(success_json);
    }
  });
});


//공지사항조회
router.get('/notice', function (req, res, next) {
  res.json({
    "success": 1,
    "result": {
      "message": "공지사항조회 성공",
      "item_cnt": 1,
      "items": [{
        "notice_no": 0,
        "notice_date": "2015-04-30",
        "notice_title": "홀딱바나나 런칭!!",
        "notice_content": "<p>홀바의 첫번째 공지사항</p>"
      }]
    }
  });
});



module.exports = router;