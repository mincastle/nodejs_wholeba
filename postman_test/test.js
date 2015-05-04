/**
 * Created by ProgrammingPearls on 15. 5. 1..
 */
var express = require('express');
var router = express.Router();
var db_model = require('../models/db_model');
var db_sqlscript = require('../models/db_sqlscript');


router.post('/findUser', function (req, res, next) {
  var user_id = req.body.user_id;
  var data = [user_id];

  db_model.selectOne(db_sqlscript.sqlFindUser, data, function (output) {

    res.json({"result" : output[0]});
  });
});


// 처음 가입자인지 아니면 요청 받은 사람인지 찾아보기 위해서 (0이면 새로운 가입자, 1이면 요청 받은 사람)
router.post('/findAuth', function (req, res, next) {
  var user_phone = req.body.user_phone;
  var data = [user_phone];

  db_model.selectOne(db_sqlscript.sqlFindAuth, data, function (output) {
    res.json({"result" : output[0]});
  });
});

router.post('/coupleinsert', function (req, res, next) {
  db_model.insert(db_sqlscript.sqlSaveCouple, [], function (output) {
      res.json({"result": output});
  });
});

router.post('/userinsert', function (req, res, next) {
  var data = [couple_no, user_id, user_pw, user_phone, user_regid];

  var couple_no = '15', user_id = req.body.user_id, user_pw = req.body.user_pw
    , user_phone = req.body.user_phone, user_regid = req.body.user_id.user_regid;
  db_model.insert(db_sqlscript.sqlSaveReqUser, data, function (output) {
    res.json({"result": output});
  });
});


module.exports = router;