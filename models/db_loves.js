var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//love목록조회
exports.getlist = function(data, callback){
    var success = 1;
    callback(success);
};

//love목록생성
exports.add = function(data, callback){
    var success = 1;
    callback(success);
};

//love목록수정
exports.modify = function(data, callback){
    var success = 1;
    callback(success);
};

//love목록삭제
exports.delete = function(data, callback){
    var success = 1;
    callback(success);
};
