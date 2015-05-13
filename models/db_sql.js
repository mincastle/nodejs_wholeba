/**
 * Created by 장 한솔 on 2015-05-04.
 */

//****************************** USER ************************************//

//회원가입시, 아이디 중복 체크
exports.selectUserId = 'select count(*) as cnt from user where user_id=?';

//회원가입시, 사용자 생성
exports.insertUser = 'insert into user(user_id, user_pw, user_phone, user_regid) values(?, ?, ?, ?)';

//회원가입시, 사용자의 리워드 행 생성
exports.insertReward = 'insert into reward(user_no) values(?);';

//자동로그인
exports.selectAutologin =  "select couple_no, count(user_no) cnt from user where user_no=? and user_phone=?";

//로그인시, 입력 아이디와 패스워드와 같은 행이 있는지 조회
exports.selectLogin = 'select user_no, couple_no, user_phone, user_regid, user_islogin, count(*) as cnt from user where user_id=? and user_pw=?';

//로그인시, 사용자의 gcmid, user_phone 갱신
exports.updateUserRegIdandUserPhone = 'update user set user_regid=?, user_phone=? where user_no=?';

//로그인시, 사용자의 전화번호 갱신
exports.updateUserPhone = 'update user set user_phone=? where user_no=?';

//로그인 + 로그아웃시, user_islogin 갱신
exports.updateUserIsLogin = 'update user set user_islogin=? where user_no=?';

//가입정보조회시, 커플인증번호에 사용자 번호가 있는지 체크
exports.selectAuthPhone = 'select couple_no, count(*) as cnt from couple where auth_phone in (select user_phone from user where user_no=?) and couple_is = 0;';

//가입정보조회시, couple_no 존재할 때 couple_is 조회
exports.selectCoupleIs = 'select couple_is from couple where couple_no=?;';

//가입정보조회시, couple_is = 1일때, couple_withdraw 조회
exports.selectCoupleWithdraw = 'select couple_withdraw from couple where couple_no=?;';

//가입정보조회시, couple_is = 1일때, user_addition 조회
exports.selectUserAddition = 'select user_addition from user where user_no=?;';

//가입정보조회시, couple_is = 1 && user_addition = 0 일때, user_req, user_gender 조회, 공통정보등록시, 사용자의 요청자여부 조회
exports.selectUserReqandUserGender = 'select user_no, user_req, user_gender from user where user_no=?';

//가입정보조회시, couple_is = 0 && auth_phone.cnt = 1일때, 커플승인자이므로 상대방의 전화번호 조회
exports.selectPartnerPhone = 'select user_phone from user where couple_no=? and not(user_no=?);';

//가입정보조회시, join_code 세팅 완료후 성별 조회
exports.selectUserGender = 'select user_gender from user where user_no=?';

//사용자 기본값조회(user_no, couple_no, gender, condom(피임여부)
exports.selectUserInfo = 'select user_no, couple_no, user_gender, (select couple_condom from couple where couple_no in (select couple_no from user where user_no=?)) as condom from user where user_no = ?';

//공통정보등록시, 커플의 사귄날 등록
exports.updateCoupleBirth = 'update couple set couple_birth=? where couple_no in (select couple_no from user where user_no = ?);';

//공통정보등록시, 유저의 생일 등록
exports.updateUserBirth = 'update user set user_birth=? where user_no=?';

//여성정보등록시, 피임약 복용할 경우, pills 테이블에 행 추가
exports.insertPills = 'insert into pills(user_no, pills_date, pills_time) values(?, ?, ?);';

//여성정보등록시, user 테이블에 피임약복용여부 갱신
exports.updateUserPills = 'update user set user_pills=? where user_no=? and user_gender="F";';

//여성정보등록시, period 테이블에 행 추가
exports.insertPeriod = 'insert into period(user_no, period_start, period_end, period_danger, period_cycle) values(?, ?, ?, ?, ?);';

//여성정보등록시, syndrome 테이블에 행 추가
exports.insertSyndrome = 'insert into synlist(user_no, syndrome_no, syndrome_before, syndrome_after) values(?, ?, ?, ?);';

//추가정보입력 후, user_addition 업데이트
exports.updateUserAddition = 'update user set user_addition=1 where user_no=?';

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

exports.selectCoupleInfo =
  'select (select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_userno, ' +
  //'       (select user_level from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_level, ' +
  '       (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_condition, ' +
  '	      (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no and a.user_no=r.user_no)) m_reward, ' +
  '       (select user_no from user a where user_gender="F" and a.couple_no=u.couple_no) f_userno, ' +
  //'       (select user_level from user a where user_gender="F" and a.couple_no=u.couple_no) f_level, ' +
  '       (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where user_gender="F" and a.couple_no=u.couple_no) f_condition, ' +
  '	      (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender="F" and a.couple_no=u.couple_no and a.user_no=r.user_no)) f_reward, ' +
  '       (select couple_condom from couple c where c.couple_no=u.couple_no) couple_condom, ' +
  '       (select couple_birth from couple c where c.couple_no=u.couple_no) couple_birth ' +
  'from user u ' +
  'where u.couple_no=? ' +
  'and u.user_gender="M"';

/*
 select (select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_userno,
 (select user_level from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_level,
 (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_condition,
 (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no and a.user_no=r.user_no)) m_reward,
 (select user_no from user a where user_gender="F" and a.couple_no=u.couple_no) f_userno,
 (select user_level from user a where user_gender="F" and a.couple_no=u.couple_no) f_level,
 (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where user_gender="F" and a.couple_no=u.couple_no) f_condition,
 (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender="F" and a.couple_no=u.couple_no and a.user_no=r.user_no)) f_reward,
 (select couple_condom from couple c where c.couple_no=u.couple_no) couple_condom,
 (select couple_birth from couple c where c.couple_no=u.couple_no) couple_birth
 from user u
 where u.couple_no=1
 and u.user_gender="M";
 */

exports.updateMyCondition = 'update user set feel_no = ? where user_no = ?';

//****************************** D-DAY ************************************//

exports.selectDdayList = 'select dday_no, dday_name, dday_date from dday where couple_no=? and dday_delete=0';

exports.insertDday = 'insert into dday(couple_no, dday_name, dday_date) values(?, ?, ?)';

exports.updateDday = 'update dday set dday_name=?, dday_date=? where couple_no=? and dday_no=?';

exports.deleteDday = 'delete from dday where couple_no = ? and dday_no = ?';


//****************************** LOVE ************************************//

exports.selectLoves = function (data, callback) {

  // 정렬부분
  var orderby;
  switch (data.orderby) {
    case 0:
      orderby = 'loves_date';
      break;
    case 1:
      orderby = 'loves_pregnancy';
      break;
  }


  var sql = "select loves_no, loves_condom, loves_pregnancy, loves_date, loves_delete " +
            "from loves " +
            "where couple_no=? " +
            "and loves_date > ? " +
            "order by " + orderby + ' DESC';


  // 동적 sql을 작성한 후 콜백을 통해 값을 넘겨준다.
  callback(sql);
};

exports.insertLoves = function (date, callback) {
  var sql;

  if (date.loves_date){
    sql =  'insert into loves(couple_no, loves_condom, loves_date) values (?, ?, ?)';
  } else {
    sql = 'insert into loves(couple_no, loves_condom, loves_date) values (?, ?, now())';
  }

  // 동적 sql을 작성한 후 콜백을 통해 sql을 넘겨준다.
  callback(sql);
};

exports.updateLoves = 'update loves set loves_condom=?, loves_date=? where couple_no=? and loves_no=?';

exports.deleteLoves = 'update loves set loves_delete = 1 where couple_no=? and loves_no=?';

//****************************** MISSION ************************************//

//미션 생성시, 테마에 따라 랜덤으로 1개 미션 조회
exports.selectMissionTheme = 'select mission_no, mission_name, mission_reward, mission_expiration from mission where theme_no=? order by rand() limit 1';

//미션 생성시, 미션 수행할 유저와 그 유저가 가진 진행중인 미션갯수
exports.selectMissionPartner = 'select user_no as partner_no, user_regid as partner_regid, (select count(mlist_no) from missionlist where user_no=partner_no and ((mlist_state=2) or (mlist_state=3))) as mlist_cnt from user where couple_no=? and not(user_no=?)';

//미션 생성
exports.insertMissionlist = 'insert into missionlist(user_no, mission_no, mlist_name, mlist_reward, mlist_state, mlist_regdate)  values(?, ?, ?, ?, 2, now())';

//미션 생성시, 만들어진 미션 조회(푸시로 보낼 힌트 얻기 위함)
exports.selectOneMission = 'select mlist_name, mlist_regdate from missionlist where mlist_no=? and user_no=?';

//미션 생성시, 리워드 차감
exports.updateUserReward = 'update reward set reward_cnt=reward_cnt + ? where user_no=?';

//진행중인 미션조회
exports.selectRunningMission = 'select mlist_no, (select theme_no from mission m where m.mission_no=mlist.mission_no) as theme_no, mlist_name from missionlist mlist where user_no=? and mlist_state=3';

//미션 확인시, mission_expiration 조회
exports.selectMissionExpiration = 'select mission_expiration from mission where mission_no=(select mission_no from missionlist where mlist_no=?)';

//미션 확인시, state와 expiredate 갱신
exports.updateMissionConfirm =
  'update missionlist set mlist_state=3, mlist_expiredate=? '+
  'where user_no=? '+
  'and mlist_no=?';

//미션 확인시 푸시보낼 상대방과 보낼내용인 힌트조회
exports.selectMissionConfirmPushInfo =
  'select (select user_regid ' +
            'from user ' +
            'where couple_no=(select couple_no ' +
                              'from user ' +
                              'where user_no=mlist.user_no) ' +
                              'and not(user_no=mlist.user_no)) as partner_regid, ' +
          '(select mission_hint ' +
          'from mission m ' +
          'where m.mission_no=mlist.mission_no) as hint ' +
  'from missionlist mlist ' +
  'where user_no=? ' +
  'and mlist_state=3 ' +
  'and mlist_no=?';

//미션 성공시, mlist_state와 mlist_successdate 갱신
exports.updateMissionSuccess =
  'update missionlist set mlist_state=1, mlist_successdate=now() '+
  'where user_no=? '+
  'and mlist_no=?';

//미션 성공시, 줄 리워드 갯수 조회
exports.selectMissionReward =
  'select mlist_reward '+
  'from missionlist '+
  'where user_no=? '+
  'and mlist_no=?';

//리워드 변화시, 리워드와 user_regid 조회
exports.selectUserReward =
  'select user_regid, '+
          '(select reward_cnt '+
          'from reward '+
          'where user_no=u.user_no)as reward '+
  'from user u '+
  'where user_no=?';

//미션목록조회
exports.selectMissionList =
  'select mlist_no, user_no, mlist_name, mlist_successdate, mlist_expiredate, mlist_state, '+
          '(select mission_hint '+
          'from mission mi ' +
          'where mi.mission_no=m.mission_no) mission_hint, ' +
          '(select user_gender '+
          'from user u '+
          'where u.user_no=m.user_no) user_gender '+
          'from missionlist m '+
          'where user_no IN ((select user_no '+
                              'from user '+
                              'where couple_no=?))';
