var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//missions�����ȸ
exports.getlist = function(data, callback){
    var success = 1;
    callback(success);
};
