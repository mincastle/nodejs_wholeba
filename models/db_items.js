var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//아이템구매가능목록조회
exports.buyinfo = function(data, callback){
    var success = 1;
    callback(success);
};

//아이템구매
exports.buy = function(data, callback){
    var success = 1;
    callback(success);
};

//보유아이템조회
exports.own = function(data, callback){
    var success = 1;
    callback(success);
};

//아이템사용
exports.apply = function(data, callback){
    var success = 1;
    callback(success);
};