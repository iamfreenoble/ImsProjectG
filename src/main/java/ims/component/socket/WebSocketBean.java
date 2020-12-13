/**
 * 
 */
package ims.component.socket;

import org.json.simple.JSONObject;

import ims.common.Util;

/**
 * @author iamfreeguy
 * @date 2016. 12. 24.
 * @type_name WebSocketVo
 * @description
 *
 */
public class WebSocketBean {

	// ---* gubun : 'CONNECT' -> 사용자 로그인 여부 판별 및 알림에 사용
	// ---* 'ROOM_OPEN' -> 사용자가 상대방을 선택하여 채팅요구메시지를 전달
	// ---* 'MESSAGE_SEND' -> 메시지를 전달한다
	// ---* 'ALERT' -> 실시간 알림 메시지를 전송한다

	private String roomid; // ---* 채팅룸 아이디 >> 여러사람이 같음 채팅룸을 사용할수 있다
	private String userid; // ---* 사용자 아이디
	private String username; // ---* 사용자 명
	private String usercharac; // ---* 사용자 캐릭터
	private String sendtoid; // ---* 상대방 아이디 >> ROOM_OPEN 시 사용
	private String sendtoname; // ---* 상대방 명 >> ROOM_OPEN 시 사용
	private String gubun; // ---*
	private String message; // ---* 전달 메시지
	private String info; // ---* 전달 메시지 외 각종정보 전달
	private String sessionid; // ---* 웹소켓 세션 아이디
	private String datetime; // ---* 일자시간

	public String getRoomid() {
		return roomid;
	}

	public void setRoomid(String roomid) {
		this.roomid = roomid;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getSendtoid() {
		return sendtoid;
	}

	public void setSendtoid(String sendtoid) {
		this.sendtoid = sendtoid;
	}

	public String getSendtoname() {
		return sendtoname;
	}

	public void setSendtoname(String sendtoname) {
		this.sendtoname = sendtoname;
	}

	public String getGubun() {
		return gubun;
	}

	public void setGubun(String gubun) {
		this.gubun = gubun;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getSessionid() {
		return sessionid;
	}

	public void setSessionid(String sessionid) {
		this.sessionid = sessionid;
	}

	public String getDatetime() {
		return datetime;
	}

	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}

	public String getUsercharac() {
		return usercharac;
	}

	public void setUsercharac(String usercharac) {
		this.usercharac = usercharac;
	}

	/**
	 * 
	 * WebSocketVo.java ims.component.socket iamfreeguy
	 *
	 */
	public WebSocketBean(JSONObject j) {
		// ---* JSONdata를 읽어 data set
		this.roomid = Util.NVL(j.get("roomid"), "");
		this.userid = Util.NVL(j.get("userid"), "");
		this.username = Util.NVL(j.get("username"), "");
		this.usercharac = Util.NVL(j.get("usercharac"), "");
		this.sendtoid = Util.NVL(j.get("sendtoid"), "");
		this.sendtoname = Util.NVL(j.get("sendtoname"), "");
		this.gubun = Util.NVL(j.get("gubun"), "");
		this.message = Util.NVL(j.get("message"), "");
		this.info = Util.NVL(j.get("info"), "");
		this.sessionid = Util.NVL(j.get("sessionid"), "");
		this.datetime = Util.NVL(j.get("datetime"), "");

	}

	/**
	 * 
	 * @date 2016. 12. 24.
	 * @param j
	 * @return String
	 * @description json 데이타에 값을 세팅하고 String으로 변환한다.
	 */
	@SuppressWarnings("unchecked")
	public String votojson(JSONObject j) {
		// ---* vo data 를 json으로 변경함
		j.clear();
		j.put("roomid", this.roomid);
		j.put("userid", this.userid);
		j.put("username", this.username);
		j.put("sendtoid", this.sendtoid);
		j.put("sendtoname", this.sendtoname);
		j.put("gubun", this.gubun);
		j.put("message", this.message);
		j.put("info", this.info);
		j.put("sessionid", this.sessionid);
		j.put("datetime", this.datetime);
		return j.toJSONString();
	}

}
