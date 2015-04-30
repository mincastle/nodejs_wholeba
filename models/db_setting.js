var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//여성사용자가 공개여부설정
exports.public = function (data, callback) {
  var success = 1;
  callback(success);
};

//여성정보조회
exports.herself = function (data, callback) {
  var success = 1;
  callback(success);
};

//직전주기수정
exports.updatePeriod = function (data, callback) {
  var success = 1;
  callback(success);
};

//qna전송
exports.qna = function (data, callback) {
  var success = 1;
  callback(success);
};