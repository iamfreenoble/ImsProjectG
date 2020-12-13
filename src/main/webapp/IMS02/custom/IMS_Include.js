/*=================================================================================
 *	파 일 명	: IMS_Include.js
 *	작성목적	: 공통 INclude 함수
 *	작 성 자	: 이상준
 *	최초작성일	: 2013.08.04
 *	최종작성일	:
 *	수정내역	:
=================================================================================*/

//===================================================================
//	INCLUDE  
//===================================================================

/*
//---*	make 방식 사용시
function IMSIncludeMake(src){
	var script	=	document.createElement("script");
	script.setAttribute("type","text/javascript");
	script.setAttribute("src",IMS_config.path + src);
	document.head.appendChild(script);
}
*/
function XyGetCurrentDateTime(div){
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

var t = XyGetCurrentDateTime("-").replace(" ","_");

/*
IMSIncludeMake("/IMS02/module/js/json3.js?ver="+t);
IMSIncludeMake("/IMS02/module/js/IMS_Z_Selector.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_Common.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_$U.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_Loading.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_Alert.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_Common.js?ver="+t); 
IMSIncludeMake("/IMS02/module/js/IMS_Z_Cookie.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_DragDrop.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_$A.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_$P.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_$H.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_$V.js?ver="+t);  
IMSIncludeMake("/IMS02/module/js/IMS_Z_EventBinding.js?ver="+t); 
IMSIncludeMake("/IMS02/module/js/IMS_Z_Prototype.js?ver="+t); 
IMSIncludeMake("/IMS02/module/html/font-awesome/5.5.0/js/all.js?ver="+t);
IMSIncludeMake("/IMS02/module/component/file/F2/IMS_F2.js?ver="+t); 
IMSIncludeMake("/IMS02/module/component/calendar/calendar.js?ver="+t); 
IMSIncludeMake("/IMS02/module/component/grid/G2/IMS_G2.js?ver="+t);  
IMSIncludeMake("/html/js/common.js?ver="+t);  
*/

document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/json3.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_ApplicationCache.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Selector.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Common.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$U.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$G.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Loading.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Alert.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Common.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Cookie.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_DragDrop.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$A.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$P.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$H.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_$V.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_EventBinding.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_Prototype.js?ver="+t+"\"></script>"); 
/*document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/html/font-awesome/5.9.0/js/all.js?ver="+t+"\"></script>");*/
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/file/F2/IMS_F2.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/calendar/v01/calendar.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/grid/G2/IMS_G2.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/file/F2/IMS_F2.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/business/common/common.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/business/common/frame.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/chart/tui.chart/3.10/tui-chart-all.min.js?ver="+t+"\"></script>");	//--**	chart   


/*
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/w3data.js?ver="+t+"\"></script>");  
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/js/IMS_Z_LocalStorage.js?ver="+t+"\"></script>");  
*/


//--**	V1 버전
//--**	document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/grid/G1/IMS_Grid.js?ver="+t+"\"></script>");  
//--**	document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/grid/G1/IMS_Grid_data.js?ver="+t+"\"></script>");  
//--**	document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/grid/G1/IMS_Grid_extend.js?ver="+t+"\"></script>");  
//--**	document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/grid/G1/IMS_Grid_formatter.js?ver="+t+"\"></script>");  
//--**	document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/file/F1/IMS_FileManage.js?ver="+t+"\"></script>"); 



/*	웹소켓 사용시
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/websocket/websocket/IMS_Wsocket.js?ver="+t+"\"></script>"); 
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/websocket/websocket/IMS_Wsocket_Control.js?ver="+t+"\"></script>"); 
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/websocket/websocket/IMS_Wsocket_Template.js?ver="+t+"\"></script>"); 
document.write("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+	IMS_config.path	+"/IMS02/module/component/websocket/websocket/IMS_Wsocket_UserTemplate.js?ver="+t+"\"></script>"); 
*/
