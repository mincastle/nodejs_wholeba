var express = require('express');
var router = express.Router();
var db_items = require('../models/db_items');

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

//구매가능아이템 목록조회
router.get('/buyinfo', function(req, res, next) {
    var user_no = req.session.user_no | -1;
    var reward_cnt = req.body.reward_cnt;
    var data = [user_no, reward_cnt];

    db_items.buyinfo(data, function(datas) {
        if(!datas) {
            fail_json(res, "구매가능아이템 목록조회");
        } else {
            res.json({
                "success" : 1,
                "result" : {
                    "message" : "구매가능아이템 목록조회 성공",
                    "item_cnt" : 3,
                    "items" : [{
                        "item_no" : 0,
                        "item_name" : "미션패스 사용권",
                        "item_exchange" : 2
                    },{
                        "item_no" : 1,
                        "item_name" : "미션다시긁기 사용권",
                        "item_exchange" : 2
                    },{
                        "item_no" : 2,
                        "item_name" : "떠넘기기 사용권",
                        "item_exchange" : 3
                    }]
                }
            });
        }
    });
});

//아이템구매
router.post('/:item_no/buy', function(req, res, next) {
    var user_no = req.session.user_no | -1;
    var item_no = req.params.item_no;
    var data = [user_no, item_no];

    db_items.buy(data, function(success) {
        if(success) {
            success_json(res, "아이템구매");
        } else {
            fail_json(res, "아이템구매");
        }
    });
});

//보유아이템조회
router.get('/own', function(req, res, next) {
    var user_no = req.session.user_no | -1;

    db_items.own([user_no], function(datas) {
        if(!datas) {
            res.json({
                "success" : 1,
                "result" : {
                    "message" : "보유아이템조회 성공",
                    "item_cnt" : 4,
                    "item" : [{
                        "item_no" : 0,
                        "item_name" : "미션패스사용권"
                    }, {
                        "item_no" : 0,
                        "item_name" : "미션패스사용권"
                    }, {
                        "item_no" : 1,
                        "item_name" : "미션다시긁기 사용권"
                    }, {
                        "item_no" : 2,
                        "item_name" : "떠넘기기 사용권"
                    }]
                }
            });
        } else {
            fail_json(res, "보유아이템조회");
        }
    });
});

//보유아이템사용
router.post('/:item_no/apply/:mlist_no', function (req, res, next) {
    var user_no = req.session.user_no | -1;
    var item_no = req.params.item_no;
    var mlist_no = req.params.mlist_no;
    var data = [user_no, item_no, mlist_no];

    db_items.apply(data, function(success) {
        if(success) {
            success_json(res, "아이템사용");
        } else {
            fail_json(res, "아이템사용");
        }
    });
});


module.exports = router;