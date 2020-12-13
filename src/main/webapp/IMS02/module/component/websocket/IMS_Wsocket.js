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

//===================================================================
//	Web Socket
//===================================================================
var Wsocket = {
		
		wsurl	:	""		
	,	target	:	null	
	,	poo		:	null
	,	w		:	null		
		
	//-------------------------------------------------------
	//	init
	//-------------------------------------------------------
	,	init	:
			function(vArr,t){
				this.wsurl	=	vArr.url;
				this.w		=	new WebSocket(this.wsurl);
				this.w.onopen	=	function(e){
					Wsocket.open(e);
					//---*	초기 세션값에 id를 매치하기 위하여 수행한다.
					var uid	=	$hD("input[name=userid]").value;
					Wsocket.first(uid+":"+uid+"::<<USERID CREATE>>");
				}
				this.w.onmessage	=	function(e){
					Wsocket.message(e);
				}
				this.w.onerror	=	function(e){
					Wsocket.error(e);
				}
			}
	//-------------------------------------------------------
	//	set
	//-------------------------------------------------------
	,	set	:
			function(vArr,t){
				this.wsurl	=	vArr.url;
				this.w		=	new WebSocket(this.wsurl);
				this.target	=	t;
				this.w.onopen	=	function(e){
					Wsocket.open(e);
				}
				this.w.onmessage	=	function(e){
					Wsocket.message(e);
				}
				this.w.onerror	=	function(e){
					Wsocket.error(e);
				}
			}
	//-------------------------------------------------------
	//	open
	//-------------------------------------------------------
	,	open	:
			function(e){
			}
	//-------------------------------------------------------
	//	message
	//-------------------------------------------------------
	,	message	:
			function(e){
				
				console.log(e.data);
				
				//---*	메시지의 구조는 from:to:targetsessionid:message 임
				var msg	= 	e.data.split(":");
				var f	=	msg[0];
				var t	=	msg[1];
				var s	=	msg[2];
				var	m	=	e.data.substring(f.length+t.length+s.length+3);
				
				//---*	메시지중에 <<OPEN IMS CHATTING WINDOW>>을 포함하는 경우는 메시지 창이 없는 경우임
				//---*	메시지창 세팅
				if (m.indexOf("<<OPEN IMS CHATTING WINDOW>>")>-1){
					control_webchatting.open(f,null,s,"CREATE",m.replace("<<OPEN IMS CHATTING WINDOW>>",""));
					return;
				}
				
				//---*	메시지중에 <<TARGET SESSION CREATE>>을 포함하는 경우는 TARGET OPEN 된후 그 id를 전송하는 경우임
				//---*	target id 세팅...
				if (m.indexOf("<<TARGET SESSION CREATE>>")>-1){
					$hD("input[name=targetid]",this.poo).value = s;
					control_webchatting.wobj[control_webchatting.wobj.match(t+":undefined")].id = t + ":" + s;
					return;
				}
				
				this.target.innerHTML	+=	"<div class='from'>" + m + "</div>";
				this.target.scrollTop	=	this.target.scrollTop	+	200;
			}
	//-------------------------------------------------------
	//	error
	//-------------------------------------------------------
	,	error	:
			function(e){
		
		
			}
	//-------------------------------------------------------
	//	first message
	//-------------------------------------------------------
	,	first	:
			function(m){
				this.w.send(m);
			}
	//-------------------------------------------------------
	//	send message
	//-------------------------------------------------------
	,	send	:
			function(sid,ssid,po){
				var uid	=	$hD("input[name=userid]").value;
				var	t	=	$hD("div[name=content]",po);
				var	m	=	$hD("textarea[name=message]",po);
				t.innerHTML	+=	"<div class='to'>" + m.value + "</div>";
				this.target	=	t;
				this.poo	=	po;
				this.w.send(uid + ":" + sid+":" + ssid+":"+ m.value);
				m.value		=	"";
			}
	//-------------------------------------------------------
	//	close
	//-------------------------------------------------------
	,	close	:
			function(){
				this.w.close();
			}
		
};	

