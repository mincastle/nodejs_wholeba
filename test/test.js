/**
 * Created by ProgrammingPearls on 15. 5. 1..
 */
var express = require('express');
var router = express.Router();
var db_model = require('../models/db_model');

router.post('/findAuth', function (req, res, next) {
  var result = {
    "success" : "0",
    "result" : {}
  };
  var user_phone = req.body.user_phone;
  var sql = "select count(*) as cnt from couple where auth_phone=?";
  var data = [user_phone];
  db_model.selectOne(sql, data, function (output) {
    res.json({"result" : output[0]});
  });
});


router.post('/coupleinsert', function (req, res, next) {
  var result = {
    "success" : "0",
    "result" : {}
  };
  var sql = 'insert into couple values()';
  db_model.insert(sql, [], function (output) {
    // insert 성공시
    if (output.affectedRows == 1) {
      var insertId = output.insertId;
      result.success = "1";
      result.result.message = '커플 생성 성공';
      res.json(result);
    } else {
      result.success="0";
      res.json(result);
    }
  });
});

module.exports = router;