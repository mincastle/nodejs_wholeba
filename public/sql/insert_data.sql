//mission_theme
insert into theme(theme_name) values('악마');
insert into theme(theme_name) values('처음');
insert into theme(theme_name) values('섹시');
insert into theme(theme_name) values('애교');
insert into theme(theme_name) values('천사');

//섹시
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('5분동안 꽉 안고있기', 10, '포옹',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('공공장소에서 백허그 하기', 10, '뒤',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('귀속말로 "넌 정말 섹시해"라고 말하기', 10, '귀',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 가해자, 너는 피해자', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 경찰, 너는 범인', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 군인, 너는 의사(간호사)', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 선생님, 너는 학생', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 의사(간호사), 너는 환자', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 주인, 너는 하인', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('나는 회장, 너는 비서', 15, '롤플레이',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('남자 옷 여자가 입기', 10, '옷',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('눈 마주칠 때마다 뽀뽀하기', 10, '눈',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('드라마 속 역할 나눠하기', 10, '연기',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('등에 키스마크 만들기', 10, '마크',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('머리채 쥐고 키스하기', 10, '머리카락',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('멱살잡고 키스하기', 10, '목',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('목캔디 물고 애무 해주기', 10, '목캔디',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('몸에 키스마크 만들기', 10, '마크',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('벽으로 밀쳐서 키스하기', 10, '벽',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('비밀 1개 공유하기', 5, '고해',(select theme_no from theme where theme_name='섹시'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('빨간 입술 자국 내기', 10, '자국',(select theme_no from theme where theme_name='섹시'));

//애교
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('2시간동안 팔장 꼬옥 끼고 다니기', 10, '팔장',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('XX♡YY 낙서하기', 10, '낙서',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('공공장소에서 애교부리기', 10, '공공장소',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('귀여운 목소리 녹음 메시지 보내기', 5, '녹음',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('귀요미송(1+1은 귀요미~) 율동과 함께 불러주기', 10, '노래',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('깜찍한 사진 보내기', 5, '찰칵',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('꽃반지 만들어 주기', 10, '꽃',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('눈썹 정리 해주기', 10, '칼',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('두시간동안 손 놓지 않기', 10, '손',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('등에 사랑한다고 써주기', 10, '손가락',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('딱따구리 뽀뽀 해주기(뽀뽀를 계속)', 10, '딱따구리',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('마스크팩 해주기', 10, '피부',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('머리 쓰담쓰담 해주기', 10, '머리',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('면도(턱수염 or 다리) 해주기', 10, '칼',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('목마 태워주기', 10, '목',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('볼 꼬집기', 10, '볼',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('비행기 태워주기', 10, '비행기',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('사랑스러운 눈빛으로 3분동안 바라보기', 10, '눈',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('상대방 사진 귀엽게 낙서해서 선물하기', 5, '낙서',(select theme_no from theme where theme_name='애교'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('소매 걷어주기', 10, '소매',(select theme_no from theme where theme_name='애교'));


//천사
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('감동의 편지 써주기',10 , '편지',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('건강주스 갈아주기',10 , '건강',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('과거에 미안했던거 사과해보기',5 , '과거',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('귀 파주기',5 , '귀',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('꽃 선물하기',10 , '꽃',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('다리 마사지 해주기',10 , '다리',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('데이트 풀 코스 준비하기',10 , '풀코스',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('도시락 싸주기',10 , '음식',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('드라마 속 멘트 연습해서 말해주기',10 , 'TV',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('등 마사지 해주기',10 , '등',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('머리 감겨주기',10 , '머리',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('머리 마사지 해주기',10 , '머리',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('머리 손질해주기',10 , '머리',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('목,어깨 마사지 해주기',10 , '어깨',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('무릎에 눕힌 후 책읽어주기',10 , '무릎',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('발 마사지 해주기',10 , '발',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('발 싯겨주기',10 , '발',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('사랑명언 보내주기',5 , '명언',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('살포시 백허그 하기',10 , '뒤',(select theme_no from theme where theme_name='천사'));
insert into mission(mission_name, mission_expiration, mission_hint, theme_no) values ('새치 뽑아주기',10 , '머리카락',(select theme_no from theme where theme_name='천사'));

//아이템
insert into item(item_name, item_exchange) values('미션다시뽑기',1);
insert into item(item_name, item_exchange) values('미션 유효기간 늘리기',1);
insert into item(item_name, item_exchange) values('악마미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('섹시미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('천사미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('애교미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('처음미션으로 다시 뽑기',2);
insert into item(item_name, item_exchange) values('미션패스',3);
insert into item(item_name, item_exchange) values('미션 내마음대로 쓰기',5);