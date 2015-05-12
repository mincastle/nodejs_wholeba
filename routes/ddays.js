var express = require('express');
var router = express.Router();
var db_ddays = require('../models/db_ddays');
var moment = require('moment');

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
  var bodydata = req.body;
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

      // TODO : moment를 이용하여 가져온 날짜형식 YYYY-MM-DD로 변경해준다.
      //success_json.result.items
      //var a = results.forEach(function (results, index, result) {
      //  result[index].dday_date = moment(result[index].dday_date).format('YYYY-MM-DD');
      //});
      res.json(success_json);
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

  //db_ddays.getlist(data, function (err, result) {
  //  if(err) {
  //    fail_json.result.message = err;
  //    res.json(fail_json);
  //  } else {
  //    success_json.result.message = 'D-day 조회성공';
  //    rse.json(success_json);
  //  }
  //});

  var couple_no = req.session.couple_no;


  //var dday_name = req.body.dday_name;
  //var dday_date = req.body.dday_date;
  //var dday_repeat = parseInt(req.body.dday_repeat);
  //var data = [dday_name, dday_date, dday_repeat];
  //
  //db_ddays.add(data, function (success) {
  //  if (success) {
  //    success_json(res, "디데이생성");
  //  } else {
  //    fail_json(res, "디데이생성");
  //  }
  //});
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
  //var dday_no = req.params.dday_no;
  //var dday_name = req.body.dday_name;
  //var dday_date = req.body.dday_date;
  //var dday_repeat = parseInt(req.body.dday_repeat);
  //var data = [dday_no, dday_name, dday_date, dday_repeat];
  //
  //db_ddays.modify(data, function (success) {
  //  if (success) {
  //    success_json(res, "디데이수정");
  //  } else {
  //    fail_json(res, "디데이수정");
  //  }
  //});
});


//디데이삭제
router.post('/:dday_no/delete', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;

  //var dday_no = req.params.dday_no;
  //var couple_no = req.session.couple_no | -1;
  ////var couple_no = 1;
  //var data = [couple_no, dday_no];
  //
  //db_ddays.delete(data, function (success) {
  //  if (success) {
  //    success_json(res, "디데이삭제");
  //  } else {
  //    fail_json(res, "디데이삭제");
  //  }
  //});
});

module.exports = router;