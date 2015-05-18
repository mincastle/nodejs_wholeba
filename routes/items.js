var express = require('express');
var router = express.Router();
var db_items = require('../models/db_items');

var fail_json = {
  "success": 0,
  "result": {}
};

var success_json = {
  "success": 1,
  "result": {}
};

//아이템 목록조회
router.get('/', function (req, res, next) {
  var user_no = req.session.user_no;
  var data = {"user_no" : user_no};
  if(!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  db_items.getlist(data, function (err, result) {
    if(err) {
      fail_json.result = {};
      fail_json.result.message = '아이템목록조회 실패';
      res.json(fail_json);
    } else if(result) {
      success_json.result = {};
      success_json.result.message = '아이템목록조회 성공';
      success_json.result.item_cnt = result.length;
      success_json.result.items = result;
      res.json(success_json);
    } else {
      fail_json.result = {};
      fail_json.result.message = '아이템목록조회 실패';
      res.json(fail_json);
    }
  });
});


//아이템사용
router.post('/:item_no/use/:mlist_no', function (req, res, next) {
  var bodydata = req.body;
  var user_no = req.session.user_no;
  var item_no = parseInt(req.params.item_no);
  var mlist_no = parseInt(req.params.mlist_no);
  var mission_name = bodydata.mission_name;
  var item_usedate = new Date(bodydata.item_usedate);
  var data = {
    "user_no" : user_no,
    "item_no" : item_no,
    "item_usedate" : item_usedate,
    "mlist_no" : mlist_no,
    "mission_name" : mission_name
  };

  //세션체크
  if(!user_no) {
    fail_json.result.message = '세션정보 없음';
    res.json(fail_json);
  }

  db_items.use(data, function (err, result) {
    if(err) {
      fail_json.result = {};
      if(err.code == "ER_DATA_OUT_OF_RANGE") {
        fail_json.result.message = '리워드 갯수 부족';
      } else {
        fail_json.result.message = err;
      }
      res.json(fail_json);
    } else if(result) {
      success_json.result = {};
      success_json.result.message = '아이템 사용 성공';
      res.json(success_json);
    } else {
      fail_json.result = {};
      fail_json.result.message = '아이템 사용 실패';
      res.json(fail_json);
    }
  });
});


//아이템구매
//추후 구현 예정
//router.post('/:item_no/buy', function (req, res, next) {
//  var user_no = req.session.user_no;
//  var item_no = req.params.item_no;
//  var data = {"user_no" : user_no, "item_no" : item_no};
//
//  db_items.buy(data, function (err, result) {
//    if(err) {
//      fail_json.result = {};
//      fail_json.result.message = '아이템 사용 실패';
//      res.json(fail_json);
//    } else if(result) {
//      success_json.result = {};
//      success_json.result.message = '아이템 사용 성공';
//      res.json(success_json);
//    } else {
//      fail_json.result = {};
//      fail_json.result.message = '아이템 사용 실패';
//      res.json(fail_json);
//    }
//  });
//});




/*
 보유아이템조회
 추후 구현 예정
 */
//router.get('/own', function (req, res, next) {
//  var user_no = req.session.user_no | -1;
//
//  db_items.own([user_no], function (datas) {
//    if (!datas) {
//      res.json({
//        "success": 1,
//        "result": {
//          "message": "보유아이템조회 성공",
//          "item_cnt": 4,
//          "item": [{
//            "item_no": 0,
//            "item_name": "미션패스사용권"
//          }, {
//            "item_no": 0,
//            "item_name": "미션패스사용권"
//          }, {
//            "item_no": 1,
//            "item_name": "미션다시긁기 사용권"
//          }, {
//            "item_no": 2,
//            "item_name": "떠넘기기 사용권"
//          }]
//        }
//      });
//    } else {
//      fail_json(res, "보유아이템조회");
//    }
//  });
//});

module.exports = router;