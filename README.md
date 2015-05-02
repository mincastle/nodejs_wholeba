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

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell


| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |


| Feature |	Method	| Request URL |
| :------------ |	:-------:	| :-----------------|
| 회원가입 |	POST	| /users/join |
| 가입정보 조회 |	GET	| /users/join |
| 커플 요청 |	POST	| /couple/ask |
| 커플 승인 |	POST	| /couple/answer |
| 공통정보 등록 |	POST	| /users/common |
| 여성정보 등록 |	POST	| /users/woman |
| 로그인 |	POST	| /users/login |
| 기본값조회 |	GET	| /users/userinfo |
| 커플정보 조회 |	GET	| /couple |
| D-day 목록 조회 |	GET	| /ddays |
| D-day 생성 |	POST	| /ddays/add |
| D-day 수정 |	POST	| /ddays/:dday_no/modify |
| D-day 삭제 |	POST	| /ddays/:dday_no/delete |
| Love 목록 조회 |	GET	| /loves/:year/:month/:orderby |
| Love 생성 |	POST	| /loves/add |
| Love 수정 |	POST	| /loves/:relation_no/modify |
| Love 삭제 |	POST	| /loves/:relation_no/delete |
| Mission 목록 조회 |	GET	| /missions/:year/:month/:orderby |
| Mission 확인 |	POST	| /missions/:mlist_no/confirm |
| Mission 생성 |	POST	| /missions/add |
| Mission 삭제 |	POST	| /missions/:mlist_no/delete |
| Mission 조회 |	GET	| /missions/:mlist_no |
| Mission 성공 |	POST	| /missions/:mlist_no/success |
| 구매 가능한 아이템 목록조회 |	GET	| /items/buyinfo |
| 아이템 구매 |	POST	| /items/:item_no/buy |
| 보유 아이템 조회 |	GET	| /items/own |
| 보유 아이템 사용 |	POST	| /items/:item_no/apply/:mlist_no |
| 내기분 설정 |	POST	| /couple/mycondition |
| 상대방격려하기 |	POST	| /couple/yourcondition |
| 여성정보공개설정 |	POST	| /setting/public |
| 여성정보 조회 |	GET	| /setting/herself |
| 직전주기수정 |	POST	| /setting/herself/:period_no |
| 공지사항 조회 |	GET	| /setting/notice |
| 로그아웃 |	POST	| /users/logout |
| 회원 탈퇴 |	POST	| /users/withdraw |
