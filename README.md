# 홀딱반한바나나(홀바) 서버!
> 안드로이드 홀딱반한바나나 서버 

## Development Stack
> 개발 언어 및 스택 소개
  
- Language : Javascript
- Framework : [Node.js](https://nodejs.org/), [Express](http://expressjs.com/)	
- Use Modules : 일괄 업데이트,
- DataStores - MariaDB(MySQL OpenSource), MongoDB, Redis

## REST API 
> REST API Definition

| Feature |	Method	| Request URL |	Parameter	| Implement Date  |
| :------------ |	:-------:	| -----------------:|	:--------:	| :--------: |
| 회원가입 |	POST	| /users/join |	user_id, user_pw, GCM_ID, user_phone	| |
| 가입정보 조회 |	GET	| /users/join |		| |
| 커플 요청 |	POST	| /couple/ask |	auth_phone, user_gender	| |
| 커플 승인 |	POST	| /couple/answer |		| |
| 공통정보 등록 |	POST	| /users/common |	couple_birth, user_birth	| |
| 여성정보 등록 |	POST	| /users/woman |	"period_start, period_end, period_cycle,
syndromes[{syndrome_name, syndrome_before, syndrome_after}],
user_pills, pills_date, pills_time"	| |
| 로그인 |	POST	| /users/login |	user_id, user_pw, GCM_ID, user_phone	| |
| 기본값조회 |	GET	| /users/userinfo |		| |
| 커플정보 조회 |	GET	| /couple |		| |
| D-day 목록 조회 |	GET	| /ddays |		| |
| D-day 생성 |	POST	| /ddays/add |	dday_name, dday_date, dday_repeat	| |
| D-day 수정 |	POST	| /ddays/:dday_no/modify |	dday_no, dday_name, dday_date, dday_repeat	| |
| D-day 삭제 |	POST	| /ddays/:dday_no/delete |	dday_no(parameter)	| |
| Love 목록 조회 |	GET	| /loves/:year/:month/:orderby |	year, month, orderby (parameter, 0 is newest, 1 is risk)	| |
| Love 생성 |	POST	| /loves/add |	relation_condom	| |
| Love 수정 |	POST	| /loves/:relation_no/modify |	relation_no, relation_condom, relation_date	| |
| Love 삭제 |	POST	| /loves/:relation_no/delete |	relation_no	| |
| Mission 목록 조회 |	GET	| /missions/:year/:month/:orderby |	year, month, orderby (parameter, 0 is newest, 1 is level, 2 is man, 3 is woman)	| |
| Mission 확인 |	POST	| /missions/:mlist_no/confirm |	mlist_no(parameter)	| |
| Mission 생성 |	POST	| /missions/add |	mission_theme	| |
| Mission 삭제 |	POST	| /missions/:mlist_no/delete |	mlist_no(parameter)	| |
| Mission 조회 |	GET	| /missions/:mlist_no |	mlist_no(parameter)	| |
| Mission 성공 |	POST	| /missions/:mlist_no/success |	mlist_no(parameter)	| |
| 구매 가능한 아이템 조회 |	GET	| /items/buyinfo |	reward_cnt	| |
| 아이템 구매 |	POST	| /items/:item_no/buy |	item_no	| |
| 보유 아이템 조회 |	GET	| /items/own |		| |
| 보유 아이템 사용 |	POST	| /items/:item_no/apply/:mlist_no |	item_no, mlist_no (parameter)	| |
| 내기분 설정 |	POST	| /couple/mycondition |	user_condition	| |
| 상대방격려하기 |	POST	| /couple/yourcondition |	your_condition	| |
| 여성정보공개설정 |	POST	| /setting/public |	user_public	| |
| 여성정보 조회 |	GET	| /setting/herself |		| |
| 직전주기수정 |	POST	| /setting/herself/:period_no |	period_no	| |
| 로그아웃 |	POST	| /users/logout |		| |
| 회원 탈퇴 |	POST	| /users/withdraw |		| |