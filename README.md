# 홀딱반한바나나(홀바) 서버!
> 안드로이드 홀딱반한바나나 서버 

## Development Stack
> 개발 언어 및 스택 소개
  
- Language : Javascript
- Framework : [Node.js](https://nodejs.org/), [Express](http://expressjs.com/)	
- Use Modules : 일괄 업데이트,
- DataStores - MariaDB(MySQL OpenSource), MongoDB, Redis

## REST API 
> REST API Definition  (26 completed / 5 Incompleted / 31 total)

| Feature |	Method	| Request URL | Todo Status | Date  |
| :---------- |	:-------:	| :-----------------| :--------: | :--------: |
| 회원가입 |	POST	| /users/join | complete | 2015-04-28  |
| 가입정보 조회 |	GET	| /users/join | complete | 2015-05-07  |
| 커플 요청 |	POST	| /couple/ask | complete | 2015-05-06  |
| 커플 승인 |	POST	| /couple/answer | complete | 2015-05-06  |
| 공통정보 등록 |	POST	| /users/common | complete | 2015-05-08 |
| 여성정보 등록 |	POST	| /users/woman | complete | 2015-05-08 |
| 로그인 |	POST	| /users/login | complete | 2015-05-09  |
| 중복로그인 수락 | POST | /users/acceptlogin | complete | 2015-05-10  |
| 커플정보 조회 |	GET	| /couple | complete | 2015-05-10  |
| 내기분 설정 |	POST	| /couple/mycondition | complete | 2015-05-11 |
| 아이템 목록 조회 |	GET	| /items/buyinfo | complete | 2015-05-14  |
| D-day 목록 조회 |	GET	| /ddays | complete | 2015-05-12 |
| D-day 생성 |	POST	| /ddays/add | complete | 2015-05-12 |
| D-day 수정 |	POST	| /ddays/:dday_no/modify | complete | 2015-05-12 |
| D-day 삭제 |	POST	| /ddays/:dday_no/delete | complete | 2015-05-12 |
| Love 목록 조회 |	GET	| /loves/:year/:month/:orderby | complete | 2015-05-14 |
| Love 생성 |	POST	| /loves/add | complete | 2015-05-13  |
| Love 수정 |	POST	| /loves/:relation_no/modify | complete | 2015-05-13 |
| Love 삭제 |	POST	| /loves/:relation_no/delete | complete | 2015-05-13 |
| Mission 진행중인 미션조회 |	GET	| /missions | complete | 2015-05-14 |
| Mission 목록 조회 |	GET	| /missions/:year/:month/:orderby | complete | 2015-05-14  |
| Mission 확인 |	POST	| /missions/:mlist_no/confirm | complete | 2015-05-14  |
| Mission 생성 |	POST	| /missions/add | complete | 2015-05-11  |
| Mission 성공 |	POST	| /missions/:mlist_no/success | complete | 2015-05-14  |
| 아이템 사용 |	POST	| /items/:item_no/use/:mlist_no | Incomplete |   |
| 여성정보공개 설정 |	POST	| /setting/public | Incomplete |   |
| 여성정보 조회 |	GET	| /setting/herself | Incomplete |   |
| 주기수정 |	POST	| /setting/herself/:period_no | Incomplete |   |
| 공지사항 조회 |	GET	| /setting/notice | Incomplete |   |
| 로그아웃 |	POST	| /users/logout | complete | 2015-05-07  |
| 회원탈퇴 |	POST	| /users/withdraw | complete | 2015-05-16  |