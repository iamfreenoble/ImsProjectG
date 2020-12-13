/*=================================================================================
 *	파 일 명		: IMS_Wsocket.js
 *	작성목적		: 웹소켓
 *	작 성 자		: 이상준
 *	최초작성일	: 2016.12.17
 *	최종작성일	:
 *	수정내역		:
 *				
 *
=================================================================================*/

var _IMS_WSOCKETCONNECTOR;
var _IMS_WSOCKETCONNECTOR_INTERVAL;

//===================================================================
//	Web Socket
//===================================================================
var Wsocket = {
		
		//---*	gubun		:	'CONNECT'			->	사용자 로그인 여부 판별 및 알림에 사용		
		//---*					'ROOM_OPEN'			->	사용자가 상대방을 선택하여 채팅요구메시지를 전달
		//---*					'MESSAGE_SEND'		->	메시지를 전달한다
		//---*					'ALERT'				->	실시간 알림 메시지를 전송한다
		
		wsurl	:	""	
	,	target	:	null	
	,	poo		:	null
	,	w		:	null		
	,	womsg	:	{		
							roomid : ""			//---*	채팅룸 아이디 >> 여러사람이 같음 채팅룸을 사용할수 있다                    
						,	userid : ""			//---*	사용자 아이디                                             
				 		,	username : ""      	//---*	사용자 명                                               
				 		,	sendtoid : ""	    //---*	상대방 아이디 	>> 	ROOM_OPEN 시 사용                      
				 		,	sendtoname : "" 	//---*	상대방 명		>>	ROOM_OPEN 시 사용	                    
				 		,	gubun : ""			//---*	                                                    
				 		,	message : ""    	//---*	전달 메시지                                              
				 		,	info : ""	    	//---*	전달 메시지 외 각종정보 전달                                    
				 		,	sessionid : ""		//---*	웹소켓 세션 아이디                                          
				 		,	datetime : ""		//---*	일자시간                                                  
					}			
		
	//-------------------------------------------------------
	//	iconmake
	//		-	웹소켓 접근 icon을 생성한다
	//-------------------------------------------------------
	,	iconmake	:
			function(){
				var sobj,simg,t01=false,t02=false,t03=false,t04=false;
				try{
					sobj	=	document.createElement("section");
					sobj.setAttribute("id","frame_chatting");
					simg	=	document.createElement("img");
					simg.setAttribute("src", IMS_config.chattingimg );	//	 "/WebIMS/images/chatting/ims_chatting.png"
					simg.onclick	=	function(){
						
						//---*	서버의 websocket 라이브러리에서 사용자 정보를 읽어온다
						$A.call({loading:false, url:"/websocket/getuser.do"},function(r){
							var h = "";
							var c = "";
							for( var i=0,ro; ro=r.rows[i]; i+=1){
								if (ro.userConnect === "Y"){
									h	+=	"<li><img onclick='control_imswsocket.call(this)' src='" + ($U.isNullOrEmpty(ro.character) ? "/WebIMS/images/websocket/nocharacter.jpg" : ro.character) + "' title='"+ro.name+"' id='"+ro.id+"'></li>";
									if (ro.team === "T01") t01= true;
									if (ro.team === "T02") t02= true;
									if (ro.team === "T03") t03= true;
									if (ro.team === "T04") t04= true;
								}
							
							}
							
							//---*	팀정보 세팅
							//if (t01 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_s.png' title='세레나팀' id='T01'></li>";
							//if (t02 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_k.png' title='티게이팀' id='T02'></li>";
							//if (t03 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_r.png' title='해티팀' id='T03'></li>";
							//if (t04 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_z.png' title='Z팀' id='T04'></li>";
							
							
							$hD('#frame_chatting_user_list #frame_chatting_user_list_detail').innerHTML	=	h; 
						})
						$hD('#frame_chatting_user_list').style.display='block';
						
						ims_websocket_fusercheck();
						
					};
					sobj.appendChild(simg);
					document.body.appendChild(sobj);
				} catch(e){
					alert("[webocket iconmake] " + e);
				} finally {
						sobj	=	null
					,	simg	=	null
					,	t01		=	null
					,	t02		=	null
					,	t03		=	null
					,	t04		=	null;
				}
			}
	//-------------------------------------------------------
	//	connect
	//		-	웹소켓 connector 정보를 구성한다
	//		-	CONNECTOR 정보 생성
	//-------------------------------------------------------
	,	connect	:
			function(url){
				this.wsurl	=	url;
				this.w		=	new WebSocket(this.wsurl);
				this.w.po	=	this;
				this.w.onopen	=	function(e){
					this.po.womsg.userid	=	IMS_config.userid;		//---*	사용자 정보를 미리 담는다 ID
					this.po.womsg.username	=	IMS_config.username;	//---*	사용자 정보를 미리 담는다 name
					this.po.womsg.usercharac=	IMS_config.usercharac;	//---*	사용자 정보를 미리 담는다 character
					this.po.womsg.gubun		=	"CONNECT";				//---*	사용자 정보 생성
					this.send(JSON.stringify(this.po.womsg));
				}
				this.w.onmessage	=	function(e){
					this.po.connectormessage(e);
				}
				this.w.onerror	=	function(e){
					this.po.error(e);
				}
			}
	//-------------------------------------------------------
	//	close
	//-------------------------------------------------------
	,	close	:
			function(){
				this.w.close();
			}
	//-------------------------------------------------------
	//	message
	//-------------------------------------------------------
	,	connectormessage	:
			function(e){
				
				console.log("CONNECTOR = " + e.data);
				
				var m = JSON.parse(e.data);
				
				//---*	ROOM을 오픈한다
				if (m.gubun === "ROOM_OPEN"){
					control_imswsocket.open(m.userid,m.username,m.roomid);
				
				} else if (m.gubun === "NOTICE"){	//---*	공지사항 알림
					alert(m.message);
				
				} else if (m.gubun === "ALERT"){	//---*	알림
					alert(m.message);
				
				}
				
			}
	//-------------------------------------------------------
	//	connector send message
	//-------------------------------------------------------
	,	connectorsend	:
			function(o){
				
			}
	//-------------------------------------------------------
	//	roomopen
	//		-	채팅 윈도우팝업을 오픈한다
	//-------------------------------------------------------
	,	roomopen	:
			function(url,sid,sname,roomid){
				this.wsurl	=	url;
				this.w		=	new WebSocket(this.wsurl);
				this.w.po	=	this;
				this.womsg.roomid		=	$U.isNullOrEmpty(roomid) ? (IMS_config.userid + "*" + (new Date()).getTime()) : roomid;
				this.womsg.sendtoid		=	sid;					//---*	상대방 아이디
				this.womsg.sendtoname	=	sname;					//---*	상대방 명

				//---*	송수신자 보이기
				$hA("#userframe div")[0].innerHTML	=	"<span>" + IMS_config.username + "</span>," + sname;
				
				this.w.onopen	=	function(e){
					
					this.po.womsg.userid		=	IMS_config.userid;		//---*	사용자 정보를 미리 담는다 ID
					this.po.womsg.username		=	IMS_config.username;	//---*	사용자 정보를 미리 담는다 name
					this.po.womsg.usercharac	=	IMS_config.usercharac;	//---*	사용자 정보를 미리 담는다 character
					this.po.womsg.gubun			=	"ROOM_OPEN";			//---*	사용자 룸 오픈
					this.po.womsg.datetime		=	yGetCurrentDateTime(IMS_config.calendardiv);
					
					this.send(JSON.stringify(this.po.womsg));
				}
				this.w.onmessage	=	function(e){
					this.po.roommessage(e);
				}
				this.w.onerror	=	function(e){
					this.po.error(e);
				}
			}
	//-------------------------------------------------------
	//	room message
	//-------------------------------------------------------
	,	roommessage	:
			function(e){
				
				console.log("ROOM = " + e.data);
				
				var m = JSON.parse(e.data);
				
				$hD("#roomid").value		=	m.roomid;
				$hD("#userid").value		=	m.userid;
				$hD("#username").value		=   m.username;
				$hD("#usercharac").value	=   m.usercharac;
				$hD("#sendtoid").value		=   m.sendtoid;
				$hD("#sendtoname").value	=   m.sendtoname;
				$hD("#gubun").value			=   m.gubun;
				$hD("#message").value		=   m.message;
				$hD("#info").value			=   m.info;
				$hD("#sessionid").value		=   m.sessionid;
				$hD("#datetime").value		=	m.datetime;
				
				//---*	송수신자 보이기
				$hA("#userframe div")[0].innerHTML	=	m.info;
				
				//---*	칼라를 구분
				var c = IMS_config.userid === m.userid ? "#0101DF" : "#04B404"; 
				
				//---*	메시지 내에 http:// 나 https:// 로 시작하는 경우 href 를 붙여준다...
				//---*	1.	' '로 split 한다
				//---*	2.	split 된 array 중에서 http:// https:// 로 시작하는 단어를 찾아서 href 추가한다
				//---*	3.	메시지를 다시 join 한다.
				var ma = m.message.split(" ");
				for (var i =0,o; o=ma[i]; i+=1){
					if (o.toUpperCase().indexOf("HTTP://") > -1 || o.toUpperCase().indexOf("HTTPS://") > -1){
						ma[i] = "<a target='_new' href='"+ma[i]+"'>" + ma[i] + "</a>";
					}
					if (o.toUpperCase().indexOf("WWW.") > -1){
						ma[i] = "<a target='_new' href='http://"+ma[i]+"'>" + ma[i] + "</a>";
					}
				}
				m.message	=	ma.join(" ");
				
				console.log(m.message);
				
				//---*	데이타를 화면에 표현
				$hD("#content").innerHTML	+=	"<h3 style='color:"+c+"'>" + m.username + " / " + m.datetime + "</h3>"
											+	"<div class='wmessage'>" + m.message  + "</div>";
				
				//---*	scroll 바 이동
				$hD("#content").scrollTop	=	$hD("#content").scrollHeight;
				
				window.open("","_self").focus();
				self.window.open("","_self").focus();
				
				//---*	팝업창에 focus.........
				//window.innerWidth = screen.width;
				//window.innerHeight = screen.height;
				//window.screenX = 0;
				//self.screenY = 0;
				
				//self.resizeBy(100,100);
				
				
			}
	//-------------------------------------------------------
	//	room send message
	//-------------------------------------------------------
	,	roomsend	:
			function(o){
				if ($U.isNullOrEmpty(o.value)) return;
				this.womsg.roomid		=	$hD("#roomid").value	
				this.womsg.userid		=	IMS_config.userid;		//---*	사용자 정보를 미리 담는다 ID
				this.womsg.username		=	IMS_config.username;	//---*	사용자 정보를 미리 담는다 name
				this.womsg.usercharac	=	IMS_config.usercharac;	//---*	사용자 정보를 미리 담는다 charac
				this.womsg.sendtoid		=	$hD("#sendtoid").value	
				this.womsg.sendtoname	=	$hD("#sendtoname").value
				this.womsg.gubun		=	"MESSAGE_SEND";		
				this.womsg.sessionid	=	$hD("#sessionid").value
				this.womsg.datetime		=	yGetCurrentDateTime(IMS_config.calendardiv);
				this.womsg.message		=	o.value;
				this.w.send(JSON.stringify(this.womsg));
				o.value		=	"";
				o.focus();
			}
	//-------------------------------------------------------
	//	room user call	//-------------------------------------------------------
	,	roomadduser	:
			function(sid,sname,roomid){
				this.womsg.roomid		=	roomid;
				this.womsg.sendtoid		=	sid;					//---*	상대방 아이디
				this.womsg.sendtoname	=	sname;					//---*	상대방 명
				this.womsg.userid		=	IMS_config.userid;		//---*	사용자 정보를 미리 담는다 ID
				this.womsg.username		=	IMS_config.username;	//---*	사용자 정보를 미리 담는다 name
				this.womsg.usercharac	=	IMS_config.usercharac;	//---*	사용자 정보를 미리 담는다 charac
				this.womsg.gubun		=	"ROOM_OPEN";			//---*	사용자 룸 오픈
				this.womsg.datetime		=	yGetCurrentDateTime(IMS_config.calendardiv);
				this.w.send(JSON.stringify(this.womsg));
			}
	//-------------------------------------------------------
	//	error
	//-------------------------------------------------------
	,	error	:
			function(e){
			}
		
};	


var ims_websocket_fusercheck	=	function(){
	
	$A.call({loading:false, url:"/websocket/getuser.do"},function(r){
		var h = "",c = "",t01=false,t02=false,t03=false,t04=false;
		for( var i=0,ro; ro=r.rows[i]; i+=1){
			if (ro.userConnect === "Y"){
				h	+=	"<li><img onclick='control_imswsocket.call(this)' src='" + ($U.isNullOrEmpty(ro.character) ? "/WebIMS/images/websocket/nocharacter.jpg" : ro.character) + "' title='"+ro.name+"' id='"+ro.id+"'></li>"
				if (ro.team === "T01") t01= true;
				if (ro.team === "T02") t02= true;
				if (ro.team === "T03") t03= true;
				if (ro.team === "T04") t04= true;
			}
		
		}

		//---*	팀정보 세팅
		//if (t01 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_s.png' title='세레나팀' id='T01'></li>";
		//if (t02 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_k.png' title='티게이팀' id='T02'></li>";
		//if (t03 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_r.png' title='해티팀' id='T03'></li>";
		//if (t04 === true) h	+=	"<li><img onclick='control_imswsocket.teamcall(this)' src='/html/img/person/team_z.png' title='Z팀' id='T04'></li>";
		
		$hD('#frame_chatting_user_list #frame_chatting_user_list_detail').innerHTML	=	h; 
		if ($hD('#frame_chatting_user_list').style.display !== "none"){
			setTimeout(function(){
				ims_websocket_fusercheck();
			},5000);
		}
	}, function(){
		//---*	error 발생시
		clearTimeout(_IMS_WSOCKETCONNECTOR_INTERVAL);
		$hD('#frame_chatting_user_list').style.display	=	'none';		
	})
	
} 
