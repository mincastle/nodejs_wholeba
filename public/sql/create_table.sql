
create table couple(
	couple_no int not null auto_increment comment'커플번호',
	couple_birth date comment'사귀기시작한날',
	couple_is int not null default 0 comment'커플승인여부',
	auth_phone char(13) comment'커플인증번호',
	couple_condom int not null default 0 comment'여성일경우 피임여부',
	couple_withdraw int not null default 0 comment'커플탈퇴여부',
	primary key(couple_no)
);

create table feel(
	feel_no int not null auto_increment comment'기분번호',
	feel_name varchar(20) not null comment'기분명',
	primary key(feel_no)
);

create table user(
	user_no int not null auto_increment comment'사용자번호',
	couple_no int comment'커플번호',
	user_id varchar(30) not null unique comment'아이디(이메일)',
	user_pw varchar(48) not null comment'비밀번호',
	user_regid varchar(600) not null comment 'GCM ID',
	user_phone char(13) not null comment'휴대폰번호',
	user_gender char(1) comment'성별',
	user_birth date comment'생일',
	user_req int comment'커플요청자여부',
	user_regdate datetime not null comment '회원 가입일',
	user_addition int not null default 0 comment'추가정보입력여부',
	feel_no int not null default 1 comment '내기분',
	user_level int not null default 1 comment'레벨',
	user_public int comment'여성일경우 정보공개여부',
	user_pills int comment'여성일경우 피임약복용여부',
	user_islogin int not null default 1 comment '현재 접속여부',
	user_withdraw int not null default 0 comment '회원탈퇴여부',
	primary key(user_no),
	foreign key(couple_no) references couple(couple_no),
	foreign key(feel_no) references feel(feel_no)
);

create table period(
	period_no int not null auto_increment comment'생리번호',
	user_no int not null comment'사용자번호',
	period_start date not null comment'생리시작일',
	period_end date not null comment'생리끝난일',
	period_danger date not null comment'배란일',
	period_cycle int not null comment'주기',
	primary key(period_no),
	foreign key(user_no) references user(user_no)
);

create table pills(
	pills_no int not null auto_increment comment'약번호',
	user_no int not null comment'사용자번호',
	pills_date date not null comment'먹기시작한날',
	pills_time time comment'알람시간',
	primary key(pills_no),
	foreign key(user_no) references user(user_no)
);

create table syndrome(
	syndrome_no int not null auto_increment comment'증후군번호',
	syndrome_name varchar(20) unique comment'증후군명',
	primary key(syndrome_no)
);

create table synlist(
	synlist_no int not null auto_increment comment'유저가 가진 증후군번호',
	user_no int not null comment'사용자번호',
	syndrome_no int not null comment'증후군번호',
	syndrome_before int not null comment'증후군시작일',
	syndrome_after int not null comment'증후군끝난일',
	primary key(synlist_no),
	foreign key(user_no) references user(user_no),
	foreign key(syndrome_no) references syndrome(syndrome_no)
);

create table reward(
	reward_no int not null auto_increment comment'리워드번호',
	user_no int not null comment'사용자번호',
	reward_cnt int unsigned not null default 0 comment'리워드갯수',
	primary key(reward_no),
	foreign key(user_no) references user(user_no)
);

create table theme(
	theme_no int not null auto_increment comment'미션테마',
	theme_name varchar(10) unique not null comment'테마명',
	primary key(theme_no)
);

create table mission(
	mission_no int not null auto_increment comment'미션번호',
	mission_season int comment'계절',
	theme_no int not null comment'미션테마',
	mission_name varchar(200) unique not null comment'미션이름',
	mission_expiration int not null comment'미션수행기간(day)',
	mission_hint varchar(50) not null comment'미션힌트',
	mission_level int comment'미션난이도',
	mission_reward int not null default 1 comment'성공시보상',
	primary key(mission_no),
	foreign key(theme_no) references theme(theme_no)
);

create table missionlist(
	mlist_no int not null auto_increment comment'미션리스트번호',
	mission_no int not null comment'미션번호',
	user_no int not null comment'사용자번호',
	mlist_name varchar(200) not null comment'미션이름,아이템사용시 변경가능',
	mlist_regdate datetime not null comment'미션생성날짜,상대방이보낸시간',
	mlist_confirmdate datetime comment'미션확인날짜,미션시작시간',
	mlist_successdate datetime comment'미션성공시간',
	mlist_expiredate datetime comment'미션만기날짜,아이템사용시 연장가능',
	mlist_reward int not null comment'미션성공시받는 리워드 갯수',
	mlist_state int not null default 2 comment'미션상태',
	mlist_delete int not null default 0 comment'미션삭제여부',
	primary key(mlist_no),
	foreign key(mission_no) references mission(mission_no),
	foreign key(user_no) references user(user_no)
);

create table item(
	item_no int not null auto_increment comment'아이템번호',
	item_name varchar(30) unique not null comment'아이템이름',
	item_exchange int not null comment'필요칩갯수',
	item_hintchanged int not null default 0 comment'아이템사용시, 힌트변경여부',
	primary key(item_no)
);

create table itemlist(
	itemlist_no int not null auto_increment comment'아이템리스트번호',
	item_no int not null comment'아이템번호',
	user_no int not null comment'사용자번호',
	item_usemission int comment'사용한 미션번호',
	item_usedate datetime comment'아이템사용시간',
	primary key(itemlist_no),
	foreign key(item_no) references item(item_no),
	foreign key(user_no) references user(user_no),
	foreign key(item_usemission) references missionlist(mlist_no)
);

create table loves(
	loves_no int not null auto_increment comment'성관계번호',
	couple_no int not null comment'커플번호',
	loves_condom int not null comment'피임여부',
	loves_pregnancy float not null comment'가임률',
	loves_date datetime not null comment'성관계일',
	loves_delete int not null default 0 comment'삭제여부',
	primary key(loves_no),
	foreign key(couple_no) references couple(couple_no)
);

create table dday(
	dday_no int not null auto_increment comment'디데이번호',
	couple_no int not null comment'커플번호',
	dday_name varchar(30) not null comment'디데이명',
	dday_date date not null comment'디데이',
	dday_repeat int not null default 0 comment'반복여부',
	dday_delete int not null default 0 comment'삭제여부',
	primary key(dday_no),
	foreign key(couple_no) references couple(couple_no)
);
