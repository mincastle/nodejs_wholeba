var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);


//커플정보조회
exports.getinfo = function (data, callback) {
  var success = 1;
  callback(success);
};

//커플요청
exports.ask = function (data, callback) {
  var success = 1;
  callback(success);
};

//커플승인
exports.answer = function (data, callback) {
  var success = 1;
  callback(success);
};

//내기분변경
exports.mycondition = function (data, callback) {
  var success = 1;
  callback(success);
};

//상대방격려하기
exports.yourcondition = function (data, callback) {
  var success = 1;
  callback(success);
};