/**
 * Created by ProgrammingPearls on 15. 5. 12..
 */

var moment = require('moment');

function each(arr, field, iterator, callback) {

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
    iterator(array, field, index, done);
  });
}

// field 매개변수 : 변환할 field
function dateFormat(array, field, index, callback) {
  array[index][field] = moment(array[index][field]).format('YYYY-MM-DD');
  callback();
}

exports.each = each;
exports.dateFormat = dateFormat;