/**
 * Created by ProgrammingPearls on 15. 5. 18..
 */
var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyBtz1plKo81Edizatu0vhhl9trNiFwtGb8'); //server key

//다른 dao에서 푸시 접근시 사용
function getSender() {
  return sender;
}

/*
   type : 전송타입 (number)
   datas : message에 담을 데이터 배열로 (array)
           [{ data_name : data_value }, {data_name : data_value}]
   gcmId : 전송할 gcm registrationID (array)
 */
//function sendPush(type, datas, gcmId, done){
//  var message = new gem.Message();
//  message.addData('type', parseInt(type) + '');
//
//  if (datas) {
//    async.each(datas, function (data, callback) {
//      message.addData(Object.keys(data.data_name), data.data_name);
//      callback();
//    }, callback);
//  } else {
//    callback();
//  }
//
//  function callback(err) {
//    if(err) {
//      done(err);
//    } else {
//      sender.sendNoRetry(message, gcmId, function (err, result) {
//        if (err) {
//          console.log('push err', err);
//          done(err);
//        } else {
//          console.log('reward push result', result);
//          //todo 안드랑 연결하면 주석풀기!!!!
//          //if (result.success) {
//          if (true) {
//            done(null, data);  //data 그대로
//          } else {
//            done(err);
//          }
//        }
//      });
//    }
//  }
//}

// 커플 요청 후 상대방에게 요청(ask)했다고 Push하기
function sendCoupleAskPush(data, done) {
  var message = new gcm.Message();
  message.addData('type', 2 + '');
  message.addData('partner_phone', data.partner_phone);

  var registrationIds = [];
  registrationIds.push(data.other_regid);
  console.log('reward push regid : ', data.other_regid);

  sender.sendNoRetry(message, registrationIds, function (err, result) {
    if (err) {
      console.log('push err', err);
      done(err);
    } else {
      console.log('reward push result', result);
      //todo 안드랑 연결하면 주석풀기!!!!
      //if (result.success) {
      if (true) {
        done(null, data);  //data 그대로
      } else {
        done(err);
      }
    }
  });
}


exports.getSender = getSender;
exports.sendCoupleAskPush = sendCoupleAskPush;