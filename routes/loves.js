var express = require('express');
var router = express.Router();
var db_loves = require('../models/db_loves');

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


//성관계목록조회
router.get('/:year/:month/:orderby', function (req, res, next) {
  var couple_no = req.session.couple_no;
  var orderby = req.params.orderby;
  var year = req.params.year;
  var month = req.params.month;
  var data = {
    couple_no: couple_no,
    year : year,
    month: month,
    orderby: orderby
  };

  db_loves.getlist(data, function (err, result) {

  });
});


//성관계생성
router.post('/add', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;
  var relation_condom = req.body.relation_condom;
  var relation_date = req.body.relation_date;

  var data = {
    couple_no: couple_no,
    loves_condom: relation_condom,
    loves_date: relation_date
  };

  db_loves.add(data, function (err, result) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '러브생성 성공';
      success_json.result.insertId = result.insertId;
      res.json(success_json);
    }
  });
});


//성관계수정
router.post('/:relation_no/modify', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;

  var relation_no = req.params.relation_no;
  var relation_condom = req.body.relation_condom;
  var relation_date = req.body.relation_date;
  var data = {
    couple_no: couple_no,
    loves_no: relation_no,
    loves_condom: relation_condom,
    loves_date: relation_date
  };

  db_loves.modify(data, function (err) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '러브수정 성공';
      res.json(success_json);
    }
  });
});


//성관계삭제
router.post('/:relation_no/delete', function (req, res, next) {
  var user_no = req.session.user_no;

  // Session 검사
  if (!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  var couple_no = req.session.couple_no;
  ////var couple_no = 1;
  var relation_no = req.params.relation_no;
  var data = {
    couple_no: couple_no,
    loves_no : relation_no
  };

  db_loves.delete(data, function (err) {
    if(err){
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result.message = '러브삭제 성공';
      res.json(success_json);
    }
  });
});

module.exports = router;