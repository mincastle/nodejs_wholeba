var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

//ȸ������
exports.join = function (data, callback) {
    var success = 1;
    callback(success);
};

//����������ȸ
exports.join_info = function (data, callback) {
    var success = 1;
    callback(success);
};

//�����������
exports.common = function(data, callback) {
    var success = 1;
    callback(success);
};

//�����������
exports.woman = function(data, callback) {
    var success = 1;
    callback(success);
};

//�α���
exports.login = function(data, callback) {
    var success = 1;
    callback(success);
};

//�⺻�� ��ȸ
exports.userinfo = function(data, callback) {
    var success = 1;
    callback(success);
};

//�α׾ƿ�
exports.logout = function(data, callback) {
    var success = 1;
    callback(success);
};

//ȸ��Ż��
exports.withdraw = function(data, callback) {
    var success = 1;
    callback(success);
};
