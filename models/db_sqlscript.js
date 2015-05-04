/**
 * Created by ProgrammingPearls on 15. 5. 1..
 */

exports.sqlClearUser = 'delete from user';
exports.sqlClearCouple = 'delete from couple';

// user_id 조회하는 쿼리문
exports.sqlFindUser = "select count(*) as cnt from user where user_id = ?";

// authphone을 조회하는 쿼리문
exports.sqlFindAuth = "select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is=0";

// couple을 생성하는 쿼리문
exports.sqlSaveCouple = 'insert into couple values()';

// 요청자인 user를 생성하는 쿼리문
exports.sqlSaveReqUser = 'insert into user(couple_no, user_id, user_pw, user_phone, user_regid)' +
  ' values(?, ?, ?, ?, ?)';

// 요청받은 user를 생성하는 쿼리문
exports.sqlSaveResUser = 'insert into user(couple_no, user_id, user_pw, user_req, user_phone, user_regid)' +
  ' values(?, ?, ?, 0, ?, ?)';

// 요청할때 update
exports.sqlUpdateAuth = 'update couple set auth_phone=? where couple_no = ?';

// is_couple update
exports.sqlUpdateIsCouple = 'update couple set couple_is=1 where couple_no = ?';
