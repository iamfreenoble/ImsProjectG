/*=================================================================================
 *	파 일 명		: 	IMS_XR_Loading.js
 *	작성목적		:	Loading Start, End, Process 함수
 *	작 성 자		: 	이상준
 *	상세설명		:	IMS_config 에 지정된 로딩등을 처리한다.	
 *	수정내역		:
=================================================================================*/

//===================================================================
//	Loading
//===================================================================
var LoadingControl = {
	
		target	:	null
		
	//-------------------------------------------------------
	//	start
	//-------------------------------------------------------
	,	start	:
			function(vurl){
				try{
					window[IMS_config.loadingon]();
				} catch(e){
				}
			}
	
	//-------------------------------------------------------
	//	end
	//-------------------------------------------------------
	,	end :
			function(vurl){
				try{
					window[IMS_config.loadingoff]();
				} catch(e){
				}
			}

	//-------------------------------------------------------
	//	force end
	//-------------------------------------------------------
	,	forceend :
			function(){
				try{
					window[IMS_config.loadingoff]();
				} catch(e){
				}
			}
};	

var topobj = top;
while(true){
	if (topobj.parent === null || topobj.parent ===  topobj){
		LoadingControl.target	=	top;
		break;
	} else {
		topobj = topobj.parent;
	} 
}

