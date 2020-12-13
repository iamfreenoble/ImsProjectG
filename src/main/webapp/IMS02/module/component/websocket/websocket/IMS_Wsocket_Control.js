/*=================================================================================
 *	파 일 명		:	IMS_Wsocket_control.js
 *	작성목적		: 	IMS WebSocket Controller
 *	작 성 자		:	이상준
 *	수정내역		:
=================================================================================*/

var control_imswsocket	=	{
		
	//---------------------------------
	//	connect
	//---------------------------------
		connect	:
			function(){
				//---*	socket connector
				if ($U.isNullOrEmpty(IMS_config.userid)) return;
				if ($U.isNull(_IMS_WSOCKETCONNECTOR)){
					_IMS_WSOCKETCONNECTOR	=	$U.cloneext(Wsocket);
					_IMS_WSOCKETCONNECTOR.iconmake();
					_IMS_WSOCKETCONNECTOR.connect(IMS_config.wsocketurl);
				}
			}
	//---------------------------------
	//	call
	//---------------------------------
	,	call	:
			function(o){
				control_imswsocket.open(o.id,o.title);
			}
	//---------------------------------
	//	open
	//---------------------------------
	,	open	:
			function(tid,tnm,roomid){
				control_imswsocket.chatuserlistclose();
				//---*	웹채팅 팝업을 오픈하고 웹채팅을 수행한다.
				var p	=	encodeURIComponent(tid + "||" + tnm+ "||" + $U.nvl(roomid,"") + "||" + IMS_config.userid + "||" + IMS_config.username + "||" + IMS_config.usercharac);
				var w 	= 	yCenterPopup(IMS_config.path + "/WebIMS/js_progress/websocket/IMS_Wsocket_Template.html?p="+p,new Date(),600,700,"Y","Y");
				$T("title", w.document)[0].innerHTML	=	tnm;
		
			}
	//---------------------------------
	//	close
	//---------------------------------
	,	close	:	
			function(){
				if ($U.isNull(_IMS_WSOCKETCONNECTOR)){
					try{
						_IMS_WSOCKETCONNECTOR.close();
					}catch(e){
					}
				}
			}
	//---------------------------------
	//	채팅 사용자 리스트를 닫는다
	//---------------------------------
	,	chatuserlistclose	:
			function(){
				clearTimeout(_IMS_WSOCKETCONNECTOR_INTERVAL);
				$hD('#frame_chatting_user_list').style.display	=	'none';
			}
	//---------------------------------
	//	messagealert
	//---------------------------------
	,	messagealert	:
			function(g,s){
				_IMS_WSOCKETCONNECTOR.womsg.userid		=	IMS_config.userid;	//---*	사용자 정보를 미리 담는다 ID
				_IMS_WSOCKETCONNECTOR.womsg.gubun		=	g;					//---*	NOTICE : 공지사항,	ALERT :	알림
				_IMS_WSOCKETCONNECTOR.womsg.message		=	s;		
				_IMS_WSOCKETCONNECTOR.w.send(JSON.stringify(_IMS_WSOCKETCONNECTOR.womsg));
			}
	
	
}

/*	begin	*/
$U.ready($hD("#ims_wsocket_template"),function(){
});

