var express = require('express');
var router = express.Router();
var db_ddays = require('../models/db_ddays');
var util = require('../util/util');

var fail_json = {
  "success": 0,
  "result": {}
};

var success_json = {
  "success": 1,
  "result": {}
};

//dday목록조회
router.get('/', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;
  var data = {"couple_no" : couple_no};

  db_ddays.getlist(data, function (err, results) {
    if(err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = 'D-day 조회성공';
      success_json.result.item_cnt = results.length;

      success_json.result.items = results;

      util.each(results, "dday_date", util.dateFormat, function (err, result) {

        res.json(success_json);
      });
    }
  });
});


//디데이추가
router.post('/add', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;


  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;
  var data = {
    "couple_no" : couple_no,
    "dday_name" : bodydata.dday_name,
    "dday_date" : bodydata.dday_date
  };

  db_ddays.add(data, function (err, result) {
    if(err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = 'D-day 생성 성공';
      success_json.result.insertId = result;
      res.json(success_json);
    }
  });

  //var data = [dday_name, dday_date, dday_repeat];
});


//디데이수정
router.post('/:dday_no/modify', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;

  var data = {
    "couple_no" : couple_no,
    "dday_no" : req.params.dday_no,
    "dday_name" : bodydata.dday_name,
    "dday_date" : bodydata.dday_date
  };
  db_ddays.modify(data, function (err) {
    if(err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = 'D-day 수정 성공';
      res.json(success_json);
    }
  });

});


//디데이삭제
router.post('/:dday_no/delete', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }
  var couple_no = req.session.couple_no;

  var data = {
    "couple_no" : couple_no,
    "dday_no" : req.params.dday_no
  };

  db_ddays.delete(data, function (err) {
    if(err) {
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = 'D-day 삭제 성공';
      res.json(success_json);
    }
  });
});

module.exports = router;