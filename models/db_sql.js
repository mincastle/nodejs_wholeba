/**
 * Created by 장 한솔 on 2015-05-04.
 */

//****************************** USER ************************************//

//아이디 중복 체크
exports.selectUserId = 'select count(*) as cnt from user where user_id=?';

//커플인증번호에 사용자 번호가 있는지 체크
exports.selectAuthPhone = 'select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is = 0;';

//커플 생성
exports.insertCouple = 'insert into couple values();';

//사용자 생성
exports.insertUser = 'insert into user(user_id, user_pw, user_phone, user_regid) values(?, ?, ?, ?)';

//가입정보조회 (user의 커플요청여부와 요청받았을경우 상대방의 전화번호 조회)
//exports.selectUserJoinInfo = 'select distinct (select user_req from user where user_no=?) as user_req, (select user_phone from user where couple_no in (select couple_no from user where user_no=?) and not(user_no = ?) )as phone from user;';

//사용자 기본값조회(user_no, couple_no, gender, condom(피임여부)
exports.selectUserInfo = 'select user_no, couple_no, user_gender, (select couple_condom from couple where couple_no in (select couple_no from user where user_no=?)) as condom from user where user_no = ?';

//사용자의 요청자여부 조회
exports.selectUserReq = 'select user_req from user where user_no=?';

//커플의 사귄날 등록
exports.updateCoupleBirth = 'update couple set couple_birth=? where couple_no in (select couple_no from user where user_no = ?);';

//유저의 생일 등록
exports.updateUserBirth = 'update user set user_birth=? where user_no=?';

//로그인을 위해 입력값과 같은 행이 있는지 조회
exports.selectLogin = 'select user_no, couple_no, user_phone, user_regid, count(*) as cnt from user where user_id=? and user_pw=?';

//사용자의 gcmid 갱신
exports.updateUserRegId = 'update user set user_regid=? where user_no=?;';

//사용자의 전화번호 갱신
exports.updateUserPhone = 'update user set user_phone=? where user_no=?';

//****************************** COUPLE ************************************//

//커플 요청 시, couple 생성
exports.insertMakeCouple = 'insert into couple(auth_phone) values (?)';

//커플 요청 시, 요청 user의 user_gender, couple_no 업데이트
exports.updateUserGenderandCoupleNoandUserReq = 'update user set user_gender=?, couple_no=?, user_req=1 where user_no=?';

//커플 승인자가 맞는지 확인
exports.selectCheckAnswerCouple = 'select couple_no from couple where couple_is=0 and auth_phone=(select user_phone from user where user_no=?)';

//커플 승인 후, couple_is 업데이트
exports.updateCoupleIs = 'update couple set couple_is=1 where couple_no=?';

//커플 승인 시, 요청자 성별에 따른 승인자 성별 구하기
exports.selectOtherGender = 'select (case user_gender when "M" then "F" when "F" then "M" end) as other_gender from user where couple_no=? and user_no <> ?';

//커플 승인 후, 해당 user의 couple_no, gender 업데이트
exports.updateUserCoupleNoandGenderandUserReq = 'update user set couple_no=?, user_gender=?, user_req=0 where user_no=?';

// dday 추가하는 sql
exports.insertMakeDday = 'insert into dday(couple_no, dday_name, dday_date, dday_repeat) ' +
                         'values (?, ?, ?, ?)';