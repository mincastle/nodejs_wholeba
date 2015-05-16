//1. 미션 테마 데이터 등록 하기
insert into theme(theme_name) values('악마');
insert into theme(theme_name) values('처음');
insert into theme(theme_name) values('섹시');
insert into theme(theme_name) values('애교');
insert into theme(theme_name) values('천사');

//2. 미션 데이터 파일로 등록하기
LOAD DATA LOCAL INFILE '/Users/ProgrammingPearls/Desktop/mission-devil.csv'
INTO TABLE mission
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(theme_no, mission_name, mission_hint, mission_expiration);

//3. 기분 데이터 등록하기
insert into feel(feel_name) values ('보통');
insert into feel(feel_name) values ('화가난다');
insert into feel(feel_name) values ('마이아파');
insert into feel(feel_name) values ('음흉음흉');
insert into feel(feel_name) values ('기분좋아');

//4. 아이템 데이터 등록하기
insert into item(item_name, item_exchange) values('미션다시뽑기',1);
insert into item(item_name, item_exchange) values('미션 유효기간 늘리기',1);
insert into item(item_name, item_exchange) values('악마미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('섹시미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('천사미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('애교미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('처음미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('미션패스',3);
insert into item(item_name, item_exchange) values('미션 내마음대로 쓰기',5);

//5. 생리증후군 데이터 등록하기
insert into syndrome(syndrome_name) values('식욕');
insert into syndrome(syndrome_name) values('분노');
insert into syndrome(syndrome_name) values('예민');
insert into syndrome(syndrome_name) values('변비');
insert into syndrome(syndrome_name) values('복통');
insert into syndrome(syndrome_name) values('우울');
insert into syndrome(syndrome_name) values('설사');
insert into syndrome(syndrome_name) values('여드름');
insert into syndrome(syndrome_name) values('짜증');
insert into syndrome(syndrome_name) values('유방통증');
insert into syndrome(syndrome_name) values('빈혈');
insert into syndrome(syndrome_name) values('무기력');
insert into syndrome(syndrome_name) values('불면증');
insert into syndrome(syndrome_name) values('두통');
insert into syndrome(syndrome_name) values('성욕');
insert into syndrome(syndrome_name) values('식욕저하');
insert into syndrome(syndrome_name) values('소화불량');

