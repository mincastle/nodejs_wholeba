/**
 * Created by 장 한솔 on 2015-05-04.
 */

//가입정보조회 (user의 커플요청여부와 요청받았을경우 상대방의 전화번호 조회)
exports.selectUserJoinInfo = 'select distinct (select user_req from user where user_no=?) as user_req, (select user_phone from user where couple_no in (select couple_no from user where user_no=?) and not(user_no = ?) )as phone from user;';
