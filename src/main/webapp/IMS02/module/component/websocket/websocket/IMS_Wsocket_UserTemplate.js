/*=================================================================================
 *	파 일 명		: IMS_Wsocket_UserTemplate.js
 *	작성목적		: 웹소켓 사용자 template
 *	작 성 자		: 이상준
 *	최초작성일	: 2016.12.17
 *	최종작성일	:
 *	수정내역		:
 *				
 *
=================================================================================*/

var _IMS_WSOCKET_USER_TEMP	=	"<section id=\"frame_chatting_user_list\">"
							+	"<span onclick='control_imswsocket.chatuserlistclose()'>X</span>"
							+	"<div id='frame_chatting_user_list_detail'></div>"
							+	"</section>";

document.write(_IMS_WSOCKET_USER_TEMP);