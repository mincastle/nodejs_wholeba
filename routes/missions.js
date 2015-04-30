var express = require('express');
var router = express.Router();
var db_missions = require('../models/db_missions');

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

//미션리스트조회
router.get('/', function(req, res, next) {
    //var couple_no = req.session.couple_no;
    var couple_no = 1;
    var orderby = parseInt(req.body.orderby);
    var year = parseInt(req.body.year);
    var month = parseInt(req.body.month);
    var data = [couple_no, year, month, orderby];

    db_missions.getlist(data, function(datas) {
        if(!datas) {
            fail_json(res, "미션목록조회");
        } else {
            res.json({
                "success" : 1,
                "result" : {
                    "message" : "미션목록조회 성공",
                    "orderby" : 1,
                    "item_cnt" : 3,
                    "items" : {
                        "m_total" : 2,
                        "m_completed" : 0,
                        "f_total" : 1,
                        "f_completed" : 1,
                        "item": [{
                            "mlist_no" : 2,
                            "gender" : "m",
                            "theme" : "애교",
                            "content" : "우쭈쭈",
                            "hint" : "#애교 #귀욤",
                            "date" : "2015-4-30",
                            "state" : 3
                        }, {
                            "mlist_no" : 1,
                            "gender" : "f",
                            "theme" : "섹시",
                            "content" : "다음데이트에서 벽에 밀치고 키스하기",
                            "hint" : "#벽 #섹시",
                            "date" : "2015-4-20",
                            "state" : 1
                        }, {
                            "mlist_no" : 0,
                            "gender" : "m",
                            "theme" : "첫만남",
                            "content" : "하루종일 손잡고 다니기",
                            "hint" : "#설렘 #첫만남",
                            "date" : "2015-4-10",
                            "state" : 0
                        }]
                    }
                }
            });
        }
    });
});

//미션하나조회
router.get('/:mlist_no', function (req, res, next) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    var mlist_no = req.params.mlist_no;
    var data = [user_no, mlist_no];

    db_missions.get(data, function(data) {
        if(!data) {
            fail_json(res, "미션조회");
        } else {
            res.json({
                "success" : 1,
                "result" : {
                    "message" : "미션조회 성공",
                    "item" : {
                        "mlist_no" : 0,
                        "gender" : "m",
                        "theme" : "첫만남",
                        "content" : "하루종일 손잡고 다니기",
                        "hint" : "#설렘 #첫만남",
                        "date" : "2015-4-10",
                        "state" : 0
                    }
                }
            });
        }
    });
});

//미션생성
router.post('/add', function(req, res, next) {
    //var user_no = req.session.user_no;
    //var couple_no = req.session.couple_no;
    var user_no = 1;
    var couple_no = 1;
    var mission_theme = req.body.theme;
    var data = [user_no, couple_no, mission_theme];

    db_missions.add(data, function(success) {
        if(success) {
            success_json(res, "미션생성");
        } else {
            fail_json(res, "미션생성");
        }
    });
});

//미션확인
router.post('/:mlist_no/confirm', function(req, res, next) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    var mlist_no = req.params.mlist_no;
    var data = [user_no, mlist_no];

    db_missions.confirm(data, function(success) {
        if(success) {
            success_json(res, "미션확인");
        }else {
            fail_json(res, "미션확인");
        }
    });
});

//미션성공
router.post('/:mlist_no/success', function(success) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    var mlist_no = req.params.mlist_no;
    var data = [user_no, mlist_no];

    db_missions.success(data, function(success) {
        if(success) {
            success_json(res, "미션성공등록");
        } else {
            fail_json(res, "미션성공등록");
        }
    });
});

//미션삭제
router.post('/:mlsit_no/delete', function(req, res, next) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    var mlist_no = req.params.mlist_no;
    var data = [user_no, mlist_no];

    db_missions.delete(data, function(success) {
        if(success) {
            success_json(res, "미션삭제");
        } else {
            fail_json(res, "미션삭제");
        }
    });
});

module.exports = router;