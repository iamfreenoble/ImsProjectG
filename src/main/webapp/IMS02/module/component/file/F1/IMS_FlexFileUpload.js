/*=================================================================================
 *	파 일 명		: IMS_FlexFileUpload.js
 *	작성목적		: Flex 파일 업로드 
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.10.26
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

//===================================================================
//	FlexFileUpload 
//===================================================================

var FileUploadByFlex = {
		
	//-------------------------------------------------------
	//		object 의 readystate 체크 및 콜백
	//-------------------------------------------------------
		make :	
			function(vWidth, vHeight){
				// IE일때와 FF일때 IE의 객체 오류로 인해 구분 삽입.
				var ffHTML	=	"";
				if(IDV_BROWSER.IE === "Y" ){
				  ffHTML	=	'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="'+vWidth+'" height="'+vHeight+'" id="flexFileUpload" align="middle">'
			        		+ 	'<param name="allowScriptAccess" value="always" />'       
			        		+	'<param name="movie" value="'+URL+'" />'
			        		+	'<param name="quality" value="high" />'
			        		+	'<param name="wmode" value="transparent" />'
			        		+	'<embed src="/WebIMS/flex/fileuploadX.swf" quality="high" wmode="transparent" style="width:'+vWidth+'px; height:'+vHeight+'px;" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ></embed>'
			        		+	'</object>';

				}else{
					ffHTML	= '<embed id="flexFileUpload" src="'+vURL+'" quality="high" wmode="transparent" style="width:'+vWidth+'px; height:'+vHeight+'px;" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ></embed>';
				}
				document.write(ffHTML);
			}
	
};	


