/**
 * Created by ProgrammingPearls on 15. 5. 6..
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');

// postman test
router.get('/moment', function (req, res) {
  res.json({"result" : moment('Sun Mar 01 2015 00:00:00 GMT+0000 (UTC)').format('YYYY-MM-DD')});
});


module.exports = router;