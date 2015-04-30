var express = require('express');
var router = express.Router();
var db_ddays = require('../models/db_ddays');

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

//dday목록조회
router.get('/', function(req, res, next) {
    var couple_no = req.session.couple_no | -1;

    db_ddays.getlist([couple_no], function(datas) {
        if(!datas) {
            fail_json(res, "디데이목록조회");
        } else {
            res.json({
                "success" : 1,
                "result" : {
                    "message" : "D-day 목록 조회 성공",
                    "item_cnt" : 2,
                    "items" : [{
                        "dday_no" : 1,
                        "dday_name" : "100일",
                        "dday_date" : "2015-04-01"
                    },{
                        "dday_no" : 0,
                        "dday_name" : "처음만난날",
                        "dday_date" : "2015-01-01"
                    }]
                }
            });
        }
    });
});


//디데이추가
router.post('/add', function (req, res, next) {
    var dday_name = req.body.dday_name;
    var dday_date = req.body.dday_date;
    var dday_repeat = parseInt(req.body.dday_repeat);
    var data = [dday_name, dday_date, dday_repeat];

    db_ddays.add(data, function (success) {
        if(success) {
            success_json(res, "디데이생성");
        } else {
            fail_json(res, "디데이생성");
        }
    });
});


//디데이수정
router.post('/:dday_no/modify', function (req, res, next) {
    var dday_no = req.params.dday_no;
    var dday_name = req.body.dday_name;
    var dday_date = req.body.dday_date;
    var dday_repeat = parseInt(req.body.dday_repeat);
    var data = [dday_no, dday_name, dday_date, dday_repeat];

    db_ddays.modify(data, function(success) {
        if(success) {
            success_json(res, "디데이수정");
        } else {
            fail_json(res, "디데이수정");
        }
    });
});


//디데이삭제
router.post('/:dday_no/delete', function(req, res, next) {
    var dday_no = req.params.dday_no;
    var couple_no = req.session.couple_no | -1;
    //var couple_no = 1;
    var data = [couple_no, dday_no];

    db_ddays.delete(data, function (success) {
        if (success) {
            success_json(res, "디데이삭제");
        } else {
            fail_json(res, "디데이삭제");
        }
    });
});

module.exports = router;