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
router.post('/public', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var public = req.body.public;
  var data = [user_no, public];

  db_setting.public(data, function (success) {
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


module.exports = router;