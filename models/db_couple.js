var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);


//Ŀ��������ȸ
exports.getinfo = function (data, callback) {
    var success = 1;
    callback(success);
};

//Ŀ�ÿ�û
exports.ask = function (data, callback) {
    var success = 1;
    callback(success);
};

//Ŀ�ý���
exports.answer = function (data, callback) {
    var success = 1;
    callback(success);
};

//����м���
exports.mycondition = function (data, callback) {
    var success = 1;
    callback(success);
};

//����ݷ��ϱ�
exports.yourcondition = function (data, callback) {
    var success = 1;
    callback(success);
};