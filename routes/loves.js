var express = require('express');
var router = express.Router();
var db_loves = require('../models/db_loves');

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

//성관계목록조회
router.get('/:year/:month/:orderby', function (req, res, next) {
  var couple_no = req.session.couple_no | -1;
  //var couple_no = 1;
  var orderby = req.params.orderby;
  var year = req.params.year;
  var month = req.params.month;
  var data = [couple_no, year, month, orderby];

  db_loves.getlist(data, function (datas) {
    if (!datas) {
      fail_json(res, "성관계목록조회");
    } else {
      res.json({
        "success": 1,
        "result": {
          "message": "성관계목록조회 성공",
          "item_cnt": 5,
          "items": {
            "today_condom": 35,
            "today_notcondom": 45,
            "item": [{
              "relation_no": 4,
              "date": "2015-04-29",
              "is_condom": 1,
              "pregnancy_rate": 35
            }, {
              "relation_no": 3,
              "date": "2015-04-20",
              "is_condom": 0,
              "pregnancy_rate": 55
            }, {
              "relation_no": 2,
              "date": "2015-04-19",
              "is_condom": 1,
              "pregnancy_rate": 70
            }, {
              "relation_no": 1,
              "date": "2015-03-29",
              "is_condom": 1,
              "pregnancy_rate": 15
            }, {
              "relation_no": 0,
              "date": "2015-02-20",
              "is_condom": 0,
              "pregnancy_rate": 23
            }]
          }
        }
      });
    }
  });
});


//성관계생성
router.post('/add', function (req, res, next) {
  var couple_no = req.session.couple_no | -1;
  //var couple_no = 1;
  var relation_condom = req.body.relation_condom;
  var data = [couple_no, relation_condom];

  db_loves.add(data, function (success) {
    if (success) {
      success_json(res, "성관계생성");
    } else {
      fail_json(res, "성관계생성");
    }
  });
});


//성관계수정
router.post('/:relation_no/modify', function (req, res, next) {
  var couple_no = req.session.couple_no | -1;
  //var couple_no = 1;
  var relation_no = req.params.relation_no;
  var relation_condom = req.body.relation_condom;
  var relation_date = req.body.relation_date;
  var data = [couple_no, relation_no, relation_condom, relation_date];

  db_loves.modify(data, function (success) {
    if (success) {
      success_json(res, "성관계수정");
    } else {
      fail_json(res, "성관계수정");
    }
  });
});


//성관계삭제
router.post('/:relation_no/delete', function (req, res, next) {
  var couple_no = req.session.couple_no | -1;
  //var couple_no = 1;
  var relation_no = req.params.relation_no;
  var data = [couple_no, relation_no];

  db_loves.delete(data, function (success) {
    if (success) {
      success_json(res, "성관계삭제");
    } else {
      fail_json(res, "성관계삭제");
    }
  });
});

module.exports = router;