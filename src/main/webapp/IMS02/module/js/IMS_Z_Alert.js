/*=================================================================================
 *	파 일 명		: 	IMS_XR_Alert.js
 *	작성목적		:	알림, 오류  함수
 *	작 성 자		: 	이상준
 *	상세설명		:	각 프로젝트에서 지정하는 알림, 오류 처리 화면.	
 *						Intergration 스크립트 임
 *	수정내역		:
=================================================================================*/

//	Alert, Error
var XAlert = {
	
	//-------------------------------------------------------
	//	alert
	//-------------------------------------------------------
	alert	:
			function(s){
				try{
					//var v = $U.format(IMS_config.alertfunc,s);
					//v	=	v.replace("\r"," ");
					//v	=	v.replace("\n"," ");
					window[IMS_config.alertfunc](s);
//					alert(s);
				} catch(e){
					alert(e);
				}
			}
	
	//-------------------------------------------------------
	//	error
	//-------------------------------------------------------
	,	error:
			function(s){
				try{
					//var v = $U.format(IMS_config.errorfunc,s);
					//v	=	v.replace("\r"," ");
					//v	=	v.replace("\n"," ");
					window[IMS_config.errorfunc](s);
//					alert(s);
				} catch(e){
					alert(e);
				}
			}

};	