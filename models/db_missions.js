var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//missions목록조회
exports.getlist = function (data, callback) {
  var success = 1;
  callback(success);
};

//mission하나조회
exports.get = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions생성
exports.add = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions확인
exports.confirm = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions삭제
exports.delete = function (data, callback) {
  var success = 1;
  callback(success);
};

//missions성공
exports.success = function (data, callback) {
  var success = 1;
  callback(success);
};