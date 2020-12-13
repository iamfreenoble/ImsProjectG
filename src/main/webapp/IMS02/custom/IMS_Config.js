/*=================================================================================
 *	파 일 명		: IMS_Config.js
 *	작성목적		: Config 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2014.11.06
 *	최종작성일		:
 *	수정내역		:
 *					2018.03.15	이상준	xgrid default row count 추가
=================================================================================*/

var IMS_config = {
			path		:	""
		,	calendardiv	:	"-"		
		,	templateloadsection	:	""		
		,	loadingon	:	"fadeinout('out')"
		,	loadingoff	:	"fadeinout('in')"	
		,   alertfunc   :   "ims_message_alert"	
		,   errorfunc   :   "ims_error_alert"
		,	wsocketurl	:	""				//	"ws://localhost:8088/ims/wsocket"	
		,	userid		:	""	
		,	username	:	""			
		,	usercharac	:	""	
		,	chattingimg	:	"/IMS02/module/html/images/chatting/ims_chatting.png"	
		,   encode 		: 	true			//--**	web.xml 에서 encoding filter 작동되므로 false 처리
		,	messageType : 	"json"			//--**	Ajax 의 메시지 타입 정의
		,	gologin		: 	"/login"				
		,	seperator	: 	"§Å§"
		,	shutdowntime:	"2019/10/02 12:00:00"		
		,	gov_key_holiday	:	"FkQoD3PimwnQrj6%2F%2F8M%2FFwIQHkAfLf7Wnb2t4pupT6DDBK%2BmU0hVvdyMspHCzg8LbujYynPV7CXP%2BhxbpMz6oA%3D%3D"	//--**	공공포탈 공류일 조회 key
		,	language	:	"kor"					//--**	X2 Grid 다국어 관련 메시지 처리		
		,	G2_defaultrowcnt	:	100				//--**	X2 Grid default row count
		,	G2_defaultscrollcnt	:	5 				//--**	X2 Grid	default scroll count 
		,	dbnullType	: 	"NVL({0},'NULL')"		//--**	X2 Grid	default scroll count			
		,	dbupperType	: 	"UPPER({0})"			//--**	X2 Grid	db uppercase		
		,	dbconcatType: 	"CONCAT({0},{1},{2})"	//--**	X2 Grid	db concat		
		,	defaultCase	: 	""				//--**	X2 Grid	default db case sensitive
};

//--**	message alert
function ims_message_alert(m){
	alert(m);
}

//--**	error alert
function ims_error_alert(m){
	alert(m);
}

//--**	shutdown check
var _ims_shutdown_template = "<div id='ims_shutdown_template' style='display:none;position:absolute;top:0px;left:37%;overflow:hidden;font-weight:bolder;color:#d56a00'></div>";
setInterval(function(){
	
	//--**	template 가 없는 경우 template insert
	var sobj = $hD("#ims_shutdown_template");
	if ($U.isNull(sobj)){
		document.body.insertAdjacentHTML("beforeend", _ims_shutdown_template);
		sobj = $hD("#ims_shutdown_template");
	}
	
	//--**	ims_config 에 값이 없으면 return
	if ($U.isNullOrEmpty(IMS_config.shutdowntime)){
        sobj.style.display	=	"none";
		return;
	}
	
	//--**	ims_config 와 값을 비교하여 30분 이내면 화면 출력함
	var diffDate_1 = new Date();
    var diffDate_2 = new Date(IMS_config.shutdowntime);
    
    var time01	=	diffDate_1.getTime();
    var time02	=	diffDate_2.getTime();
    
    //--**	시간이 지나면 삭제함
    if (time01 > time02){
        sobj.style.display	=	"none";
		return;
    }
    
    var diff = Math.abs(time02 - time01);
    diff = Math.ceil( diff / (1000 * 60));	//--	분
    
    //--**	30 분전에 나타남
    if (diff > 30){
        sobj.style.display	=	"none";
		return;
    }
    
    sobj.style.display	=	"block";
    sobj.innerHTML		=	$U.format(	"현재시간은 {0}입니다.<br/>[ {1} ] 분후 서버가 다운됩니다.<br/>주의하시기 바랍니다"
    									,	diffDate_1
    									,	diff
    									);	
	
},3000);
