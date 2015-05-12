/**
 * Created by ProgrammingPearls on 15. 5. 6..
 */
var request = require('supertest');
//var app = require('../app');
var expect = require('expect.js');
var dday = require('../models/db_ddays');
var moment = require('moment');
var util = require('../util/dday_util');
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

describe('dday insert', function () {
  it('dday insert test', function (done) {
    var couple_no = 1;
    var dday_name = '2년';
    var dday_date = '2017-03-01';
    var data = {
      "couple_no" : couple_no,
      "dday_name" : dday_name,
      "dday_date" : dday_date
    };

    dday.add(data, function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log('result', result);
        expect(result[0].dday_no).to.be(1);
        done();
      }
    })
  });
});

describe('dday list', function () {
  it('dday list test', function (done) {
    var couple_no = 1;
    var data = {couple_no : couple_no};
    dday.getlist(data, function (err, result) {
      if (err) {
        throw err;
      } else {
        //console.log('result', result);
        util.each(result, util.dateFormat, function () {
          console.log('result', result);
          expect(result[0].dday_no).to.be(1);

          done();
        });

        //result.forEach(function (element, index, r) {
        //  console.log('index', index);
        //  r[index].dday_date = moment(r[index].dday_date).format('YYYY-MM-DD');
        //  console.log('r[' + index + ']', r[index]);
        //});

      }
    })
  });
});


