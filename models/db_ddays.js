var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);


//���� �����ȸ
exports.getlist = function (data, callback) {
    var success = 1;
    callback(success);
};

//���̻���
exports.add = function(data, callback) {
    var success = 1;
    callback(success);
};

//���̼���
exports.modify = function(data, callback) {
    var success = 1;
    callback(success);
};

//���̻���
exports.delete = function(data, callback) {
    var success = 1;
    callback(success);
};
