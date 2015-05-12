/**
 * Created by ProgrammingPearls on 15. 5. 6..
 */
var request = require('supertest');
var app = require('../app');

describe('login', function () {
  it('login test', function (done) {
    request(app)
      .post('/users/login')
      .set('Accept', 'application/json')
      .send({
        user_id : 'aaaa',
        user_pw: 'aaaa',
        user_phone: '010-1111-1111',
        user_regid: 'zxczxq222'
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});


