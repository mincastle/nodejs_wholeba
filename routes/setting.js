var express = require('express');
var router = express.Router();
var db_setting = require('../models/db_setting');

function fail_json(res, str) {
  res.json({
    "success": 0,
    "result": {
      "message": str + " 실패"
    }
  });
}

function success_json(res, str) {
  res.json({
    "success": 1,
    "result": {
      "message": str + " 성공"
    }
  });
}

//여성정보공개설정
router.post('/user_public', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var user_public = req.body.user_public;
  var data = [user_no, user_public];

  db_setting.user_public(data, function (success) {
    if (success) {
      success_json(res, "여성정보공개설정");
    } else {
      fail_json(res, "여성정보공개설정");
    }
  });
});

//여성정보조회
router.get('/herself', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var couple_no = req.session.couple_no | -1;
  var data = [user_no, couple_no];

  db_setting.herself(data, function (datas) {
    if (!datas) {
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
      fail_json(res, "여성정보조회");
    }
  });
});


//직전주기수정
router.post('/herself/:period_no', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var period_no = req.params.period_no;
  var data = [user_no, period_no];

  db_setting.updatePeriod(data, function (datas) {
    if (!datas) {
      success_json(res, "직전주기수정");
    } else {
      fail_json(res, "직전주기수정");
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