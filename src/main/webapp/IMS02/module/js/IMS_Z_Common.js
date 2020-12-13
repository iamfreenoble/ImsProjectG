/*=================================================================================
 *	파 일 명		: IMS_Common.js
 *	작성목적		: 공통함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.04
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

var IDV_BROWSER	=	yGetBrowserVersion();
var IDV_MOBILE	=	yGetMobile();
var IDV_POPUPWIN	= 	null;

//===================================================================
//	브라우저 언어 설정
//===================================================================
function yGetBrowserLanguage() {
	return (navigator.appName === "Netscape" ? navigator.language : navigator.userLanguage); 
}

//===================================================================
// IE 브라우저  종류 및 버전 알아내기
//===================================================================
function yGetBrowserVersion() {
	var rv 	= 	-1;
	var ua	=	navigator.userAgent;
	var co	=	((navigator.vendor === null || navigator.vendor === undefined) ? "" : navigator.vendor.toLowerCase());
	
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	} else {
		
		//	Trident 로 다시 확인
		/*
		 IE6.0 = null
		 IE7.0 = null
		 IE8.0 = Trident/4.0
		 IE9.0 = Trident/5.0
		 IE10.0 = Trident/6.0
		 IE11.0 = Trident/7.0;
		*/
		var ieIdx = ua.indexOf("Trident/");
		if (ieIdx > -1){
			rv = Number(ua.substring(ieIdx+8).split(";")[0]) + 4;
		}
	}
	
	if (rv > -1){
		return {IE:"Y",VER:rv,NAME: "IE",RELEASE:"1"};
	} else {
		var ver = ua;
		
		//--**	edge chrome 버전 처리
		if (ua.toLowerCase().indexOf("edg/") > -1 ){ 
			ver	=	ver.substr(ua.toLowerCase().indexOf("edg/") +4).split(" ")[0];
			return {IE:"Y",VER:ver,NAME: "edge",RELEASE:"2"};
		}
		if (ua.toLowerCase().indexOf("edge") > -1 ){ 
			ver	=	ver.substr(ua.toLowerCase().indexOf("edge") +5).split(" ")[0];
			return {IE:"Y",VER:ver,NAME: "edge",RELEASE:"1"};
		}
		if (co.indexOf("google") > -1 && ua.toLowerCase().indexOf("chrome") > -1 ){
			if (ua.toLowerCase().indexOf("OPR") > -1){
				ver	=	ver.substr(ua.toLowerCase().indexOf("OPR") +4).split(" ")[0];
				return {IE:"N",VER:ver,NAME: "opera",RELEASE:"1"};
			} else {
				ver	=	ver.substr(ua.toLowerCase().indexOf("chrome") +7).split(" ")[0];
				return {IE:"N",VER:ver,NAME: "chrome",RELEASE:"1"};
			}
		}
		if (co.indexOf("apple") > -1 && ua.toLowerCase().indexOf("safari") > -1 ){
			ver	=	ver.substr(ua.toLowerCase().indexOf("safari") +7).split(" ")[0];
			return {IE:"N",VER:ver,NAME: "safari",RELEASE:"1"};
		}
		if (co.indexOf("naver") > -1 && ua.toLowerCase().indexOf("whale") > -1 ){
			ver	=	ver.substr(ua.toLowerCase().indexOf("whale") +6).split(" ")[0];
			return {IE:"N",VER:ver,NAME: "whale",RELEASE:"1"};
		}
		if (ua.toLowerCase().indexOf("firefox") > -1 ){
			ver	=	ver.substr(ua.toLowerCase().indexOf("firefox") +8).split(" ")[0];
			return {IE:"N",VER:ver,NAME: "firefox",RELEASE:"1"};
		}
	}
}

//===================================================================
//	MOBILE 체크
//===================================================================
function yGetMobile() {
	var ua = navigator.userAgent;
	try{
		
		if (ua.match(/Android/i)){
			return {WIDTH:"Android",NAME: "Android"};
			
		} else if (ua.match(/BlackBerry/i)){
			return {WIDTH:"BlackBerry",NAME: "BlackBerry"};
			
		} else if (ua.match(/iPhone|iPad|iPod/i)){
			return {WIDTH:"iOS",NAME: "iOS"};
		
		} else if (ua.match(/Opera Mini/i)){
			return {WIDTH:"Opera",NAME: "Opera"};
		
		} else if (ua.match(/IEMobile/i)){
			return {WIDTH:"Windows",NAME: "Windows"};
		}
		
		return {WIDTH:"NOMOBILE",NAME: "NOMOBILE"};

	} catch(e){
		alert("[yGetMobile]"+e);
	} finally {
		ua	=	null;
	}
}

//===================================================================
// 화면 사이즈 구하기
//===================================================================
function yGetWindowSize(){
	var winSize = {width:0, height:0};
	
	//----------------------------------------------
	//	Non-IE
	//----------------------------------------------
	if( IDV_BROWSER.IE === "N" ){
		winSize.width	= window.innerWidth;
		winSize.hiehgt	= window.innerHeight;
  
	} else {
		//----------------------------------------------
	    //	IE 6+ in 'standards compliant mode'
	    //----------------------------------------------
		if( document.documentElement && ( document.documentElement.offsetWidth || document.documentElement.offsetHeight ) ){
			winSize.width	= document.documentElement.offsetWidth;
			winSize.height 	= document.documentElement.offsetHeight;
  
		//----------------------------------------------
		//	IE 4 compatible
		//----------------------------------------------
		} else if( document.body && ( document.body.offsetWidth || document.body.offsetHeight ) ){
			winSize.width = document.body.offsetWidth;
			winSize.height = document.body.offsetHeight;
		}
	}
	return winSize;
}

//===================================================================
// 	POPUP 처리
//	-	vUrl		:	URL 정보
//	-	vWinName	:	윈도우 팝업 명
//	-	vWidth		:	윈도우 팝업 넓이
//	-	vHeight		:	윈도우 팝업 높이
//	-	vScrollYN	:	윈도우 스크롤바 여부
//	-	vResizeYN	:	윈도우 리사이즈 여부
//===================================================================
function yCenterPopup(vUrl,vWinName,vWidth,vHeight,vScrollYN,vResizeYN){
	var x 		= 	(screen.width) ? (screen.width-vWidth)/2 : 0;
	var y 		= 	(screen.height) ? (screen.height-vHeight)/2 : 0;
	var param	= 	"height="		+	vHeight	+
						",width="		+	vWidth	+
						",left="		+	x		+
						",top="		+	y		+
						",scrollbars="	+	($U.isNull(vScrollYN) ? "no" : vScrollYN)	+
						",resizable="	+	($U.isNull(vResizeYN) ? "no" : vResizeYN);
	IDV_POPUPWIN = window.open(vUrl,vWinName,param);
	setTimeout(
		function(){
			if ($U.isNull(IDV_POPUPWIN)){
				alert("해당 사이트의 팝업허용여부를 확인하세요.\r\nCheck whether the site allows pop-ups.")
			} else {
				IDV_POPUPWIN.focus();
			}
		}
	,1000);
	return IDV_POPUPWIN;
}

//===================================================================
//	현재 일자 가져오기	
//===================================================================
function yGetCurrentDate(div){
	var today = new Date(),dd,mm,yyyy;
	try{
		yyyy	= 	today.getFullYear();
		mm 		= 	today.getMonth()+1; //January is 0!
		dd 		= 	today.getDate();
		if(dd<10) {
		    dd='0'+dd
		} 
		if(mm<10) {
		    mm='0'+mm
		} 
		return yyyy + div + mm + div + dd;
	} catch(e){
		alert("[yGetCurrentDate]"+e);
	} finally{
		today 	= 	null;
		dd		=	null;
		mm		=	null;
		yyyy	=	null;
	}
}

//===================================================================
//현재 일자 가져오기	
//===================================================================
function yGetCurrentDateToJson(){
	var v = yGetCurrentDate("-");
	var ar = v.split("-");
	return {"year":ar[0],"month":ar[1],"day":ar[2]};
}

//===================================================================
//	현재 일자 가져오기	
//===================================================================
function yGetCurrentDateTime(div){
	var today = new Date(),dd,mm,yyyy,hh,mi,ss;
	try{
		yyyy	= 	today.getFullYear();
		mm 		= 	today.getMonth()+1; //January is 0!
		dd 		= 	today.getDate();
	    
		dd		= 	(dd<10 ? '0' : "") + dd;
		mm		=	(mm<10 ? '0' : "") + mm;
		
		hh 		= 	today.getHours();
		mi 		= 	today.getMinutes();
		ss 		= 	today.getSeconds();
		
		hh		= 	(hh<10 ? '0' : "") + hh;
		mi		=	(mi<10 ? '0' : "") + mi;
		ss		=	(ss<10 ? '0' : "") + ss;
		
		return yyyy + div + mm + div + dd + " " + hh + ":" + mi + ":"+ ss ;
	} catch(e){
		alert("[yGetCurrentDateTime]"+e);
	} finally{
		today 	= 	null;
		dd		=	null;
		mm		=	null;
		yyyy	=	null;
	}
}

//--**	년도별 몇주차인지 compute	
//--**	목요일이 포함된 첫번째 주"가 제1주차
function yGetWeeksOfYear(){
	var v = [];
	try{
		v.today	=	new Date();
		v.year	=	v.today.getFullYear();
		v.sdate	=	new Date(v.year,0,1);
		v.sdateWeek	= v.sdate.getDay();
		v.week	=	(v.today - v.sdate) / (1000*60*60*24);
		return Math.ceil(v.week/7) + (v.sdateWeek > 4 ? -1 : 0);
		
	} catch(e){
		alert("[ yGetWeeksOfYear ]"+e);
	} finally{
		v	=	null;
	}
}


//===================================================================
//	date 를 포맷 한 결과 전송 
//===================================================================
function yGetFormateDate(today,div){
	var dd,mm,yyyy;
	try{
		if (typeof(today) === "string"){
			yyyy	= 	Number(today.substr(0,4));
			mm 		= 	Number(today.substr(4,2));
			dd 		= 	Number(today.substr(6,2));
		} else {
			yyyy	= 	today.getFullYear();
			mm 		= 	today.getMonth()+1; //January is 0!
			dd 		= 	today.getDate();
		}
		
		if(dd<10) {
		    dd='0'+dd
		} 
		if(mm<10) {
		    mm='0'+mm
		} 
		return yyyy + div + mm + div + dd;
	} catch(e){
		alert("[yGetFormateDate]"+e);
	} finally{
		today 	= 	null;
		dd		=	null;
		mm		=	null;
		yyyy	=	null;
	}
}

//=======================================================================
//	CELL 병합
//	yTableRowSpanSet($D("report_page_detail_table"),[0,1,2,9,10],1);
//	와 같이 사용, 2번쨰 인자는 비교할 칼럼 idx를 Array로 넘겨준다.
//=======================================================================
function yTableRowSpanSet(tableObj, birow, rowStartNum ) {
	try{ //20060623 예외처리 추가
		
		 //var start = startCol != null ? startCol : 0;
		 //var end = endCol != null ? endCol : 3;
		 var rowStartNum = rowStartNum != null ? rowStartNum : 0;
		 
		 var rows = tableObj.rows;
		 if ($U.isNull(rows)){
			 rows = tableObj;
		 }
		 
		 var len = rows.length;
		 var col = null;
		 var iCnt    =   0;
		 var iCheckCnt   =   0;
		 var iCheckCnt2  =   0;
		 var fCheck  =   true;

		 var o	=	0;
		 for (var i=0; i<birow.length; i+=1){
		     o	=	birow[i];
		     
			 iCnt    =   0;
		     if (i != 0) {
		         var arrCnt = new Array();
		         for (j=rowStartNum;j<len;j++){
		             arrCnt[iCnt++] = getCell(rows,j,birow[i-1]).rowSpan;
		             j += (getCell(rows, j, birow[i-1]).rowSpan-1) ;
		         }
		     }
		             
		     iCnt    =   0;
		     for (j=rowStartNum;j<len;j++){
		         if (i != 0){
		             if (iCheckCnt == iCheckCnt2){
		                 iCheckCnt2  = arrCnt[iCnt++];
		                 fCheck  =   false;
		             }
		             iCheckCnt++;
		         }    
		         if (col != null && $U.text(col).trim()  === $U.text(getCell(rows, j, o )).trim() && fCheck && iCheckCnt <= iCheckCnt2){
		             getCell(rows, j, o).style.display = 'none';
		             col.rowSpan++;
		         } else {
		             col = getCell( rows, j, o);
		             fCheck  =   true;
		         }
		         if (i != 0){
		             if (iCheckCnt == iCheckCnt2){
		              iCheckCnt  = 0;
		              iCheckCnt2 =   0;
		             }
		         }    
		     }
		 } 
	
	} catch(e){
		alert(e);
	};  
}

//=======================================================================
//	CELL 병합	2
//	테이블이 틀린경우 처리 ( IMS_G2 )
//	yTableRowSpanSetForMulti(	[
//									{"tab" : object,	"col": 0}
//									{"tab" : object,	"col": 0}
//								]
//							,	1	->	rowstartnum
//							);
//=======================================================================
function yTableRowSpanSetForMulti(p, rn, cchk) {
	var bobj,obj, rows, brows, col, ncol;
	try{ 
		
		//--**	rowspan info null 
		if ($U.isNull(p) || p.length === 0){
			return;
		}
		
		//--**	rowspan info null 
		var rows = (p[0].tab).rows;
		if (rows.length === 0){
			return;
		}

		//--**	rowspan 초기화
		//--**	clear 인경우
		if (cchk === false){
		} else {
			
			for (var i=0, j=p.length; i<j; i+=1){
				obj		=	p[i];
				rows	=	(obj.tab).rows;
				for (var q=rn,qq=rows.length; q<qq; q+=1){
					col	=	getCell(rows,q,obj.col);
					col.style.display	=	"";
					col.rowSpan = 1;
				}	
			}
		
		}
		
		//--**	clear 인경우
		if (cchk === true){
			return;
		}
		
		//--**	rowspan 처리
		for (var i=0, j=p.length; i<j; i+=1){
			
			obj		=	p[i];
			rows	=	(obj.tab).rows;
			bobj 	= 	i === 0 ? null :  p[i-1];
			brows	=	i === 0 ? null :  (bobj.tab).rows;
			
			for (var q=rn,qq=rows.length; q<qq; q+=1){
				col	=	getCell(rows,q,obj.col);
				
				for (var w=q+1,ww=rows.length; w<ww; w+=1){
					ncol	=	getCell(rows,w,obj.col);
					
					if (i !== 0){	//--**	이전 로우 비교
						if (getCell(brows,w,bobj.col).style.display !== "none"){
							break;
						}
					}
					
					if (col != null && ncol != null && $U.text(col).trim()  === $U.text(ncol).trim() ){
						col.rowSpan = $U.nvl(col.rowSpan, 1) + 1;
						ncol.style.display	=	"none";
						q ++;
					} else {
						col.rowSpan = $U.nvl(col.rowSpan, 1);
						break;
					} 
				}
			}
		} 
	
	} catch(e){
		alert("[ yTableRowSpanSetForMulti ]" + e);
	
	} finally{
			bobj	=	null
		,	obj		=	null
		,	rows	=	null
		, 	brows	=	null
		, 	col		=	null
		, 	ncol	=	null;
	};  
}


function getCell(ro,r,c){
	return ( ro[r].cells[c] || ro(r).cells(c) );
}

//=======================================================================
//	CELL 병합 풀기
//=======================================================================
function yTableRowSpanDel(tableObj, startCol, endCol, rowStartNum) {
	var start = startCol != null ? startCol : 0;
	var end = endCol != null ? endCol : 3;
	var tb = tableObj.tBodies[0]||tableObj.tBodies(0);
	var rows = tb.rows;
	var pre = new Array();
	var len = rows.length - rowStartNum;
	for (var i = rowStartNum ; i < len ; i++) {
		for (var j = start ; j < end ; j++) {
			getCell(rows,i,j).rowSpan = 1;
			getCell(rows,i,j).style.display = 'block';
		}
	}
}
