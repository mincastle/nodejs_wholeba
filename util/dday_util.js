/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */

var moment = require('moment');

function each(arr, iterator, callback) {

  if(!arr.length) {
    return callback(null, arr);
  }

  var completed = 0;

  function done(err) {
    if (err) {
      callback(err);
    } else {
      completed++;
      if (completed >= arr.length) {
        callback(null, arr);
      }
    }
  }

  arr.forEach(function (element, index, array) {
    iterator(array, index, done);
  });
}

function dateFormat(array, index, callback) {
  array[index].dday_date = moment(array[index].dday_date).format('YYYY-MM-DD');
  callback();
}

exports.each = each;
exports.dateFormat = dateFormat;