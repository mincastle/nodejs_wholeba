/**
 * Created by 장 한솔 on 2015-05-04.
 */

//아이디 중복 체크
exports.selectUserId = 'select count(*) as cnt from user where user_id=?';

//커플인증번호에 사용자 번호가 있는지 체크
exports.selectAuthPhone = 'select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is = 0;';

//커플 생성
exports.insertCouple = 'insert into couple values();';

//사용자 생성
exports.insertUser = 'insert into user(user_id, user_pw, user_phone, user_regid, couple_no, user_req) values(?, ?, ?, ?, ?, ?)';

//가입정보조회 (user의 커플요청여부와 요청받았을경우 상대방의 전화번호 조회)
exports.selectUserJoinInfo = 'select distinct (select user_req from user where user_no=?) as user_req, (select user_phone from user where couple_no in (select couple_no from user where user_no=?) and not(user_no = ?) )as phone from user;';

//사용자 기본값조회(user_no, couple_no, gender, condom(피임여부)
exports.selectUserInfo = "select user_no, couple_no, user_gender, (select user_condom from user where couple_no in (select couple_no from user where user_no=?)and user_gender='f') as user_condom from user where user_no = ?;";

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

