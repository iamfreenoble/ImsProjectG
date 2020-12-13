/*=================================================================================
 *	파 일 명		: IMS_Wsocket_template.js
 *	작성목적		: 웹소켓 template
 *	작 성 자		: 이상준
 *	최초작성일	: 2016.12.17
 *	최종작성일	:
 *	수정내역		:
 *				
 *
=================================================================================*/

var _IMS_WSOCKET_TEMP	=	"<section style='display:none'>"
						+	"<div id='ims_wsocket_template'>"
						+	"	<input type='hidden' name='sessionid'>"
						+	"	<input type='hidden' name='targetid'>"
						+	"	<div class='ims_chatting_frame'>"
						+	"		<div name='content'></div>"
						+	"		<div name='sendbox'>"
						+	"			<textarea name='message' onkeyup='control_imswsocket.enterchk(event,this)'></textarea>"
						+	"			<input type='button' value='send' onclick='control_imswsocket.send(this)'>"
						+	"		</div>"
						+	"	</div>"
						+	"</div>"
						+	"</section>";

document.write(_IMS_WSOCKET_TEMP);
