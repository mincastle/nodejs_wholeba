var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//회원가입
exports.join = function (data, callback) {
    var success = 1;
    callback(success);
};

//가입정보조회
exports.join_info = function (data, callback) {
    var success = 1;
    callback(success);
};

//공통정보등록
exports.common = function(data, callback) {
    var success = 1;
    callback(success);
};

//여성정보등록
exports.woman = function(data, callback) {
    var success = 1;
    callback(success);
};

//로그인
exports.login = function(data, callback) {
    var success = 1;
    callback(success);
};

//기본값 조회
exports.userinfo = function(data, callback) {
    var success = 1;
    callback(success);
};

//로그아웃
exports.logout = function(data, callback) {
    var success = 1;
    callback(success);
};

//회원탈퇴
exports.withdraw = function(data, callback) {
    var success = 1;
    callback(success);
};
