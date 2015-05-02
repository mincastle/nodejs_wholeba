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

| Feature |	Method	| Request URL | Todo Status | Date  |
| :---------- |	:-------:	| :-----------------| :--------: | :--------: |
| 회원가입 |	POST	| /users/join | Incomplete |   |
| 가입정보 조회 |	GET	| /users/join | Incomplete |   | 
| 커플 요청 |	POST	| /couple/ask | Incomplete |   |
| 커플 승인 |	POST	| /couple/answer | Incomplete |   |
| 공통정보 등록 |	POST	| /users/common | Incomplete |   |
| 여성정보 등록 |	POST	| /users/woman | Incomplete |   |
| 로그인 |	POST	| /users/login | Incomplete |   |
| 기본값조회 |	GET	| /users/userinfo | Incomplete |   |
| 커플정보 조회 |	GET	| /couple | Incomplete |   |
| D-day 목록 조회 |	GET	| /ddays | Incomplete |   |
| D-day 생성 |	POST	| /ddays/add | Incomplete |   |
| D-day 수정 |	POST	| /ddays/:dday_no/modify | Incomplete |   |
| D-day 삭제 |	POST	| /ddays/:dday_no/delete | Incomplete |   |
| Love 목록 조회 |	GET	| /loves/:year/:month/:orderby | Incomplete |   |
| Love 생성 |	POST	| /loves/add | Incomplete |   |
| Love 수정 |	POST	| /loves/:relation_no/modify | Incomplete |   |
| Love 삭제 |	POST	| /loves/:relation_no/delete | Incomplete |   |
| Mission 목록 조회 |	GET	| /missions/:year/:month/:orderby | Incomplete |   |
| Mission 확인 |	POST	| /missions/:mlist_no/confirm | Incomplete |   |
| Mission 생성 |	POST	| /missions/add | Incomplete |   |
| Mission 삭제 |	POST	| /missions/:mlist_no/delete | Incomplete |   |
| Mission 조회 |	GET	| /missions/:mlist_no | Incomplete |   |
| Mission 성공 |	POST	| /missions/:mlist_no/success | Incomplete |   |
| 구매 가능한 아이템 목록조회 |	GET	| /items/buyinfo | Incomplete |   |
| 아이템 구매 |	POST	| /items/:item_no/buy | Incomplete |   |
| 보유 아이템 조회 |	GET	| /items/own | Incomplete |   |
| 보유 아이템 사용 |	POST	| /items/:item_no/apply/:mlist_no | Incomplete |   |
| 내기분 설정 |	POST	| /couple/mycondition | Incomplete |   |
| 상대방격려하기 |	POST	| /couple/yourcondition | Incomplete |   |
| 여성정보공개설정 |	POST	| /setting/public | Incomplete |   |
| 여성정보 조회 |	GET	| /setting/herself | Incomplete |   |
| 직전주기수정 |	POST	| /setting/herself/:period_no | Incomplete |   |
| 공지사항 조회 |	GET	| /setting/notice | Incomplete |   |
| 로그아웃 |	POST	| /users/logout | Incomplete |   |
| 회원 탈퇴 |	POST	| /users/withdraw | Incomplete |   |
