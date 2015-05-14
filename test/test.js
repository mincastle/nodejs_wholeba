/**
 * Created by ProgrammingPearls on 15. 5. 6..
 */
var request = require('supertest');
//var app = require('../app');
var expect = require('expect.js');
var dday = require('../models/db_ddays');
var moment = require('moment');
var util = require('../util/util');
var love = require('../models/db_loves');

//var expect = require('chai').expect;
//
//describe('login', function () {
//  it('login test', function (done) {
//    request(app)
//      .post('/users/login')
//      .set('Accept', 'application/json')
//      .send({
//        user_id : 'aaaa',
//        user_pw: 'aaaa',
//        user_phone: '010-1111-1111',
//        user_regid: 'zxczxq222'
//      })
//      .expect('Content-Type', /json/)
//      .expect(a)
//      .expect(200, done);
//  });
//
//  function a(res) {
//    return res.body.success==1 ? false : res.body.result.message;
//  }
//});
//
//describe('mycondition', function () {
//  before(function(done) {
//      request(app)
//        .post('/users/login')
//        .set('Accept', 'application/json')
//        .send({
//          user_id : 'aaaa',
//          user_pw: 'aaaa',
//          user_phone: '010-1111-1111',
//          user_regid: 'zxczxq222'
//        })
//        .expect('Content-Type', /json/)
//        .expect(a)
//        .expect(200, done);
//  });
//
//  function a(res) {
//    return res.body.success==1?false : res.body.result.message;
//  }
//
//  it('mycondition test', function (done) {
//    request(app)
//      .post('/couple/mycondition')
//      .set('Accept', 'application/json')
//      .send({
//        condition_no : '3'
//      })
//      .expect('Content-Type', /json/)
//      .expect(b)
//      .expect(200, done);
//  });
//
//  function b(res) {
//    return res.body.success== 1 ? false : res.body.result.message;
//  }
//});
//
//describe('dday insert', function () {
//  it('dday insert test', function (done) {
//    var couple_no = 1;
//    var dday_name = '2년';
//    var dday_date = '2017-03-01';
//    var data = {
//      "couple_no" : couple_no,
//      "dday_name" : dday_name,
//      "dday_date" : dday_date
//    };
//
//    dday.add(data, function (err, result) {
//      if (err) {
//        throw err;
//      } else {
//        console.log('result', result);
//        done();
//      }
//    })
//  });
//});
//
//describe('dday update', function () {
//  it('dday update test', function (done) {
//    var dday_no = 2;
//    var couple_no = 1;
//    var dday_name = 'qweq';
//    var dday_date = '2022-03-01';
//    var data = {
//      "couple_no" : couple_no,
//      "dday_no" : dday_no,
//      "dday_name" : dday_name,
//      "dday_date" : dday_date
//    };
//
//    dday.modify(data, function (err, result) {
//      if (err) {
//        throw err;
//      } else {
//        console.log('update result', result);
//        done();
//      }
//    })
//  });
//});
//
//describe('dday delete', function () {
//  it('dday delete test', function (done) {
//    var dday_no = 14;
//    var couple_no = 1;
//    var data = {
//      "couple_no" : couple_no,
//      "dday_no" : dday_no
//    };
//
//    dday.delete(data, function (err, result) {
//      if (err) {
//        throw err;
//      } else {
//
//        console.log('result', result);
//        //expect(result[0].dday_no).to.be(1);
//        done();
//      }
//    })
//  });
//});
//
//describe('dday list', function () {
//  it('dday list test', function (done) {
//    var couple_no = 1;
//    var data = {couple_no : couple_no};
//    dday.getlist(data, function (err, result) {
//      if (err) {
//        throw err;
//      } else {
//        //console.log('result', result);
//        util.each(result, "dday_date", util.dateFormat, function () {
//          console.log('result', result);
//          //expect(result[0].dday_date).to.be(1);
//
//          done();
//        });
//
//        //result.forEach(function (element, index, r) {
//        //  console.log('index', index);
//        //  r[index].dday_date = moment(r[index].dday_date).format('YYYY-MM-DD');
//        //  console.log('r[' + index + ']', r[index]);
//        //});
//      }
//    })
//  });
//});

describe('love list', function () {
  it('love list test', function (done) {
    var couple_no = 4;
    var orderby = 0;
    var year = 2015;
    var month = 3;
    var data = {
      couple_no: couple_no,
      year: year,
      month: month,
      orderby: orderby
    };

    love.getlist(data, function (err, results) {
      if (err) {
        throw err;
      } else {
        //console.log('result', result);
        util.each(results, "loves_date", util.dateFormat, function (err, result) {
          console.log('result', result);
        });
        //expect(result).to.be(1);
        done();
      }
    })
  });
});

//describe('util', function () {
//  it('util test', function (done) {
//    var result = [{
//      loves_no: 1,
//      loves_condom: 1,
//      loves_pregnancy: 80,
//      loves_date: "Fri, 20 Mar 2015 00:00:00 GMT",
//      loves_delete: 1
//      },
//      {
//        loves_no: 2,
//        loves_condom: 1,
//        loves_pregnancy: 60,
//        loves_date: "Sun, 01 Mar 2015 00:00:00 GMT",
//        loves_delete: 1
//      },
//      {
//        loves_no: 4,
//        loves_condom: 1,
//        loves_pregnancy: 20,
//        loves_date: "Tue, 31 Mar 2015 23:59:59 GMT",
//        loves_delete: 0
//      }];
//
//    util.each(result,"loves_date", util.dateFormat, function (err, result) {
//      console.log('result', result);
//    })
//  });
//});




