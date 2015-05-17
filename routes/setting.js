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
router.get('/herself', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var couple_no = req.session.couple_no | -1;
  var data = [user_no, couple_no];

  db_setting.herself(data, function (err, result) {
    if (result) {
      res.json({
        "success": 1,
        "result": {
          "message": "여성정보조회 성공",
          "items": {
            "period_cnt": 2,
            "syndrome_cnt": 1,
            "avg_cycle": 30,
            "period": [{
              "period_no": 1,
              "period_start": "2015-04-01",
              "period_end": "2015-04-05",
              "period_cycle": 29
            }, {
              "period_no": 0,
              "period_start": "2015-03-03",
              "period_end": "2015-03-09",
              "period_cycle": 30
            }],
            "syndrome": [{
              "syndrome_no": 1,
              "syndrome_name": "우울",
              "syndrome_start": "2015-"
            }],
            "is_pills": 1,
            "pills_date": "2015-04-15",
            "pills_time": "14:00"
          }
        }
      });
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