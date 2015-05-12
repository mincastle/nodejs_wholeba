var express = require('express');
var router = express.Router();
var db_missions = require('../models/db_missions');

var fail_json = {
  "success": 0,
  "result": {}
}

var success_json = {
  "success": 1,
  "result": {}
};

//미션리스트조회
router.get('/:year/:month/:orderby', function (req, res, next) {
  var couple_no = req.session.couple_no;
  var orderby = parseInt(req.params.orderby);
  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);
  var data = {"couple_no" : couple_no, "year" : year, "month" : month, "orderby" : orderby};

  db_missions.getlist(data, function (datas) {
    if (!datas) {
      fail_json.result = {};
      fail_json.result.message = '미션리스트조회 실패';
      res.json(fail_json);
    } else {
      res.json({
        "success": 1,
        "result": {
          "message": "미션목록조회 성공",
          "orderby": 1,
          "item_cnt": 3,
          "items": {
            "m_total": 2,
            "m_completed": 0,
            "f_total": 1,
            "f_completed": 1,
            "item": [{
              "mlist_no": 2,
              "gender": "m",
              "theme": "애교",
              "content": "우쭈쭈",
              "hint": "#애교 #귀욤",
              "date": "2015-4-30",
              "state": 3
            }, {
              "mlist_no": 1,
              "gender": "f",
              "theme": "섹시",
              "content": "다음데이트에서 벽에 밀치고 키스하기",
              "hint": "#벽 #섹시",
              "date": "2015-4-20",
              "state": 1
            }, {
              "mlist_no": 0,
              "gender": "m",
              "theme": "첫만남",
              "content": "하루종일 손잡고 다니기",
              "hint": "#설렘 #첫만남",
              "date": "2015-4-10",
              "state": 0
            }]
          }
        }
      });
    }
  });
});

//미션하나조회
router.get('/:mlist_no', function (req, res, next) {
  var user_no = req.session.user_no;
  var mlist_no = req.params.mlist_no;
  var data = {"user_no" : user_no, "mlist_no" : mlist_no};

  db_missions.get(data, function (data) {
    if (!data) {
      fail_json.result = {};
      fail_json.result.message = '미션조회 실패';
      res.json(fail_json);
    } else {
      res.json({
        "success": 1,
        "result": {
          "message": "미션조회 성공",
          "item": {
            "mlist_no": 0,
            "gender": "m",
            "theme": "첫만남",
            "content": "하루종일 손잡고 다니기",
            "hint": "#설렘 #첫만남",
            "date": "2015-4-10",
            "state": 0
          }
        }
      });
    }
  });
});

//미션생성
router.post('/add', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;
  var couple_no = req.session.couple_no;
  var mission_theme = bodydata.theme;
  var data = {"user_no" : user_no, "couple_no" : couple_no, "mission_theme" : mission_theme};

  db_missions.add(data, function(err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션생성 성공';
      res.json(success_json);
    }
  });
});

//미션확인
router.post('/:mlist_no/confirm', function (req, res, next) {
  var user_no = req.session.user_no;
  var mlist_no = req.params.mlist_no;
  var data = {"user_no" : user_no, "mlist_no" : mlist_no};

  db_missions.confirm(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션생성 성공';
      res.json(success_json);
    }
  });
});

//미션성공
router.post('/:mlist_no/success', function (success) {
  var user_no = req.session.user_no | -1;
  var mlist_no = req.params.mlist_no;
  var data = [user_no, mlist_no];

  db_missions.success(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션생성 성공';
      res.json(success_json);
    }
  });
});

//미션삭제
//추후 구현 예정
router.post('/:mlsit_no/delete', function (req, res, next) {
  var user_no = req.session.user_no | -1;
  var mlist_no = req.params.mlist_no;
  var data = [user_no, mlist_no];

  db_missions.delete(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션생성 성공';
      res.json(success_json);
    }
  });
});

module.exports = router;