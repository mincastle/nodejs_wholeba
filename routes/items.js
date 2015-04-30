var express = require('express');
var router = express.Router();
//var db_couple = require('../models/db_couple');

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

router.get('/buyinfo', function(req, res, next) {

});

module.exports = router;