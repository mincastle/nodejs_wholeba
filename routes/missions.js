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
//orderby (0:최신순, 1:남자순, 2:여자순)
router.get('/:year/:month/:orderby', function (req, res, next) {
  var user_no = req.session.user_no;
  var couple_no = req.session.couple_no;
  var orderby = parseInt(req.params.orderby);
  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);
  var date = year + '-' + month + '-' + '1';
  var data = {"user_no" : user_no, "couple_no" : couple_no, "date" : date, "orderby" : orderby};


  //세션 체크
  if (!user_no || !couple_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

  db_missions.getlist(data, function (err, result) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      //console.log('result----------', result);
      var m_total = 0;
      var m_completed = 0;
      var f_total = 0;
      var f_completed = 0;
      var items = [];
      var item = {};
      var len = result.length;

      //json setting
      for(var i in result) {
        item = {};
        item.mlist_no = result[i].mlist_no;
        item.user_gender = result[i].user_gender;
        item.theme_no = result[i].theme_no;
        item.mlist_name = result[i].mlist_name;
        item.mission_hint = result[i].mission_hint;
        item.mlist_state = result[i].mlist_state;
        item.mlist_regdate = result[i].mlist_regdate; //미션생성일자
        item.mlist_successdate = result[i].mlist_successdate; //미션성공일자
        item.item_usedate = result[i].item_usedate; //아이템사용일자
        item.mlistexpiredate = result[i].mlist_expiredate; //미션유효일자

        //gender mission value setting
        if(item.gender == 'M') {
          m_total++;
          if(item.state == 1) {
            m_completed++;
          }
        } else {
          f_total++;
          if(item.state == 1) {
            f_completed++;
          }
        }
        console.log('item' , item);
        items.push(item);
      }

      success_json.result = {};
      success_json.result.message = '미션목록조회 성공';
      res.json({
        "success": 1,
        "result": {
          "message": "미션목록조회 성공",
          "orderby": orderby,
          "item_cnt": items.length,
          "items": {
            "m_total": m_total,
            "m_completed": m_completed,
            "f_total": f_total,
            "f_completed": f_completed,
            "item": items
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
  var theme_no = bodydata.theme_no;
  var data = {"user_no" : user_no, "couple_no" : couple_no, "theme_no" : theme_no};

  //세션 체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

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

//진행중인 미션조회
router.get('/', function(req, res, next) {
  var user_no = req.session.user_no;
  var data = {"user_no" : user_no};
  //세션 체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

  db_missions.runningMission(data, function(err, results) {
    if(err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      if(results) {
        success_json.result = {};
        success_json.result.message = '진행중인 미션조회 성공';
        success_json.result.item_cnt = results.length;
        success_json.result.items = results;
        res.json(success_json);
      } else {
        fail_json.result = {};
        fail_json.result.message = '진행중인 미션조회 실패';
        res.json(fail_json)
      }
    }
  });

});

//미션확인
router.post('/:mlist_no/confirm', function (req, res, next) {
  var user_no = req.session.user_no;
  var mlist_no = req.params.mlist_no;
  var data = {"user_no" : user_no, "mlist_no" : mlist_no};

  //세션 체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

  db_missions.confirm(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션확인 성공';
      res.json(success_json);
    }
  });
});

//미션성공
router.post('/:mlist_no/success', function (req, res, next) {
  var user_no = req.session.user_no;
  var mlist_no = req.params.mlist_no;
  var data = {"user_no" : user_no, "mlist_no" : mlist_no};

  //세션 체크
  if (!user_no) {
    fail_json.result.message = "세션정보 없음";
    res.json(fail_json);
    return;
  }

  db_missions.success(data, function (err) {
    if (err) {
      fail_json.result = {};
      fail_json.result.message = err;
      res.json(fail_json);
    } else {
      success_json.result = {};
      success_json.result.message = '미션성공';
      res.json(success_json);
    }
  });
});

//todo 미션삭제
//추후 구현 예정
//router.post('/:mlsit_no/delete', function (req, res, next) {
//  var user_no = req.session.user_no | -1;
//  var mlist_no = req.params.mlist_no;
//  var data = [user_no, mlist_no];
//
//  db_missions.delete(data, function (err) {
//    if (err) {
//      fail_json.result = {};
//      fail_json.result.message = err;
//      res.json(fail_json);
//    } else {
//      success_json.result = {};
//      success_json.result.message = '미션삭제 성공';
//      res.json(success_json);
//    }
//  });
//});

module.exports = router;