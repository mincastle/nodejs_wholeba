var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//missions�����ȸ
exports.getlist = function(data, callback){
    var success = 1;
    callback(success);
};

//missions��ȸ
exports.get = function(data, callback){
    var success = 1;
    callback(success);
};

//missions����
exports.add = function(data, callback){
    var success = 1;
    callback(success);
};

//missionsȮ��
exports.confirm = function(data, callback){
    var success = 1;
    callback(success);
};

//missions����
exports.delete = function(data, callback){
    var success = 1;
    callback(success);
};

//missions����
exports.success = function(data, callback){
    var success = 1;
    callback(success);
};