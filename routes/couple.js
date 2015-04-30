var express = require('express');
var router = express.Router();
var db_couple = require('../models/db_couple');

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

//커플정보조회(메인)
router.get('/', function(req, res, next) {
    //var couple_no = req.session.couple_no;
    var couple_no = 1;
    var data = [couple_no];

    db_couple.getinfo(data, function(success) {
        if(success) {
            res.json({
                "success" : 1 ,
                "result" : {
                    "message" : "커플정보조회 성공",
                    "items" : {
                        "m_reward" : 0,
                        "m_condition" : "햄볶",
                        "m_level" : 1,
                        "m_mission_stage": 1,
                        "f_reward" : 1,
                        "f_condition" : "존좋",
                        "f_level" : 1,
                        "f_mission_stage" : 1,
                        "f_period": 2,
                        "f_contra" : 30,
                        "couple_birth" : "2014-10-01"
                }
            }
        } );
        } else {
            fail_json(res, "커플정보조회");
        }
    });
});


//커플요청
router.post('/ask', function (req, res, next) {
    var user_no = req.session.user_no | 1;
    var auth_phone = req.body.auth_phone;
    var user_gender = req.body.user_gender;

    var data = [user_no, auth_phone, user_gender];

    db_couple.ask(data, function (success) {
        if (success) {
            success_json(res, "커플요청");
        } else {
            fail_json(res, "커플요청");
        }
    });
});

//커플승인
router.post('/answer', function(req, res, next) {
    var user_no = req.session.user_no | -1;
    var couple_no = req.session.couple_no | -1;
    var data = [user_no, couple_no];

    db_couple.answer(data, function(success) {
        if(success) {
            success_json(res, "커플승인");
        } else {
            fail_json(res, "커플승인");
        }
    });
});

//내기분설정
router.post('/mycondition', function(req, res, next) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    var user_condition = req.body.user_condition;
    var data = [user_no, user_condition];

    db_couple.mycondition(data, function(success) {
        if(success) {
            success_json(res, "내기분설정");
        } else {
            fail_json(res, "내기분설정");
        }
    });
});

//상대방격려하기
router.post('/yourcondition', function(req, res, next) {
    //var user_no = req.session.user_no;
    var user_no = 1;
    //var couple_no = req.session.couple_no;
    var couple_no = 1;
    var your_condition = req.body.your_condition;
    var data = [user_no, couple_no, your_condition];

    db_couple.yourcondition(data, function(success) {
        if(success) {
            success_json(res, "상대방격려하기");
        } else {
            fail_json(res, "상대방격려하기");
        }
    });
});


module.exports = router;