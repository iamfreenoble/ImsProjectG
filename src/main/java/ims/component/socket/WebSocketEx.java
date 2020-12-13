package ims.component.socket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;

import ims.common.Log;
import ims.common.Util;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 18.
 * @type_name WebSocketEx
 * @description - HTML5 웹소켓 구현 http://nowonbun.tistory.com/286 참조 - 2016.12.23
 *              json format으로 변경
 *
 */
@ServerEndpoint("/ims/wsocket")
public class WebSocketEx {

	private static final int STATUS_NOTLOGIN = 0;
	private static final int STATUS_CONNECTOR = 1;
	private static final int STATUS_OPEN = 2;

	// ---* 사용자 집합 리스트
	private static List<Session> sessionUsers = Collections.synchronizedList(new ArrayList<Session>());

	/**
	 * 
	 * @date 2017. 4. 4.
	 * @return List<String>
	 * @description sessionuser 로부터 CONNECTOR 정보를 리턴한다.
	 */
	public static List<String> getWebSocketConnector() {
		List<String> r = new ArrayList<String>();
		Iterator<Session> iterator = sessionUsers.iterator();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if ("CONNECTOR".equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				r.add(String.valueOf(s.getUserProperties().get("userid")));
			}
			;
		}
		return r;
	}

	/**
	 * 
	 * @date 2016. 12. 18.
	 * @param userSession void
	 * @description    웹 소켓이 접속되면 유저리스트에 세션을 넣는다.
	 */
	@OnOpen
	public void handleOpen(Session userSession) {
		sessionUsers.add(userSession);
		Log.log("WEBSOCKET", "USER_SESSION OPEN", userSession.getId());
	}

	/**
	 * 
	 * @date 2016. 12. 18.
	 * @param message
	 * @param userSession
	 * @throws IOException    void
	 * @throws ParseException
	 * @description 웹 소켓으로부터 메시지가 오면 호출한다. 메시지 구조 message = { roomid : 채팅룸 아이디 >>
	 *              여러사람이 같음 채팅룸을 사용할수 있다 , userid : 사용자 아이디 , username : 사용자 명 ,
	 *              usercharac : 사용자 캐릭터 , sendtoid : 상대방 아이디 >> ROOM_OPEN 시 사용 ,
	 *              sendtoname : 상대방 명 >> ROOM_OPEN 시 사용 , gubun : 'CONNECT' -> 사용자
	 *              로그인 여부 판별 및 알림에 사용 'ROOM_OPEN' -> 사용자가 상대방을 선택하여 채팅요구메시지를 전달
	 *              'MESSAGE_SEND' -> 메시지를 전달한다 'ALERT' -> 실시간 알림 메시지를 전송한다 ,
	 *              message : 전달 메시지 , info : 전달 메시지 외 각종정보 전달 , sessionid : 웹소켓 세션
	 *              아이디 , datetime : 일자시간 }
	 */
	@SuppressWarnings("unchecked")
	@OnMessage
	public void handleMessage(String message, Session userSession) throws IOException, ParseException {

		// ---* 메시지를 json으로 변경한다
		JSONObject j = (JSONObject) new JSONParser().parse(message);
		// ---* json 데이타를 vo에 담는다
		WebSocketBean w = new WebSocketBean(j);

		Log.log("WEBSOCKET", w.getGubun() + "|" + w.getUserid(), w.getMessage());

		// ---* 메시지 type이 USER_CREATE 인경우 userid를 create 하고 리턴한다
		// ---* 사용자가 웹소켓 로그인 상태이고, 알림,채팅을 받을수 있는 상태임
		// ---* roomid가 CONNECTOR이다 로그인 여부 확인 및 알림등을 받을떄 사용
		if (w.getGubun().equals("CONNECT")) {
			// 기존에 값이 있는지 여부를 확인하여 있는 경우 삭제한다.
			if (checkConnector(w.getUserid())) {
				Session s = getConnectorSession(w.getUserid());
				s.close();
			}
			userSession.getUserProperties().put("sessionid", userSession.getId());
			userSession.getUserProperties().put("userid", w.getUserid());
			userSession.getUserProperties().put("username", w.getUsername());
			userSession.getUserProperties().put("usercharac", w.getUsercharac());
			userSession.getUserProperties().put("roomid", "CONNECTOR");
			userSession.getUserProperties().put("gubun", w.getGubun());
			userSession.getUserProperties().put("message", w);

			Log.log("WEBSOCKET", "SESSIONUSERS",
					"--[START]------------------------------------------------------------------");
			for (Session sd : sessionUsers) {
				Log.log("WEBSOCKET", "SESSIONUSERS", sd.getId() + " // " + sd.getUserProperties().get("userid") + " // "
						+ sd.getUserProperties().get("roomid"));
			}
			Log.log("WEBSOCKET", "SESSIONUSERS",
					"--[ END ]------------------------------------------------------------------");

			return;
		}

		// ---* 사용자 세션에 해당값을 세팅한
		userSession.getUserProperties().put("sessionid", userSession.getId());
		userSession.getUserProperties().put("userid", w.getUserid());
		userSession.getUserProperties().put("username", w.getUsername());
		userSession.getUserProperties().put("usercharac", w.getUsercharac());
		userSession.getUserProperties().put("roomid", w.getRoomid());

		Log.log("WEBSOCKET", "SESSIONUSERS",
				"--[START]------------------------------------------------------------------");
		for (Session sd : sessionUsers) {
			Log.log("WEBSOCKET", "SESSIONUSERS", sd.getId() + " // " + sd.getUserProperties().get("userid") + " // "
					+ sd.getUserProperties().get("roomid"));
		}
		Log.log("WEBSOCKET", "SESSIONUSERS",
				"--[ END ]------------------------------------------------------------------");

		// ---* 메시지 type이 ROOM_OPEN 인경우
		// ---* 1. CONNECTOR 와 미존재하는 경우 상대방이 미로그인 상태임을 사용자에게 전달한다
		// ---* 2. CONNECTOR 가 존재하나 roomid가 같은것이 존재하지 않는 경우 상대방의 CONNECTOR에게 roomopen 을
		// 전달한다
		// ---* 3. CONNECTOR 가 존재하고 roomid가 같은것이 존재하는 경우 확인만 함
		// ---* 상대방을 선택하고 채팅룸을 만드는 경우
		if (w.getGubun().equals("ROOM_OPEN")) {
			// ---* 상대방의 상태를 확인한다.
			int status = getStatus(w);
			switch (status) {
			case STATUS_NOTLOGIN:
				j.put("roomid", w.getRoomid());
				j.put("sessionid", userSession.getId());
				j.put("message", ">>> 메시지를 전송할수 없습니다.상대방이 접속전입니다.");
				j.put("info", "<span>" + w.getUsername() + "</span>," + w.getSendtoname());
				userSession.getBasicRemote().sendText(j.toJSONString());
				break;
			case STATUS_CONNECTOR:
				Session s = getConnectorSession(w.getSendtoid());
				j.put("sessionid", s.getId());
				j.put("gubun", "ROOM_OPEN");
				j.put("info", "<span>" + s.getUserProperties().get("username") + "</span>," + w.getUsername());
				s.getBasicRemote().sendText(j.toJSONString());
				break;
			case STATUS_OPEN:
				List<Session> rs = getsend(j);
				j.put("message", "연결되었습니다");
				// ---* 송수신자 세팅

				String sb = "";
				for (Session sx : rs) {
					sb += sx.getUserProperties().get("usercharac") + ",";
				}

				String sbb = "";
				String[] sa = null;
				String sr = "";

				for (Session ss : rs) {
					sbb = sb.replace(ss.getUserProperties().get("usercharac") + ",", "");
					sbb = "".equals(sbb) ? "" : sbb.substring(0, sbb.length() - 1);
					sbb = ss.getUserProperties().get("usercharac") + ("".equals(sbb) ? "" : ",") + sbb;
					sa = sbb.split(",");
					sr = "";
					for (String sss : sa) {
						sr += "<img style='width:80px' src='" + sss.replaceAll("person", "person_sub") + "' >";
					}
					j.put("info", sr);
					ss.getBasicRemote().sendText(j.toJSONString());
				}
				break;

			}
			return;
		}

		// ---* 메시지 type이 MESSAGE_SEND 시 메시지를 상대방에 전송한다.
		// ---* 매시지를 전송시
		if (w.getGubun().equals("MESSAGE_SEND")) {
			List<Session> rs = getsend(j);
			if (rs.size() == 1) {
				j.put("message", j.get("message") + "<br> >>> 상대방에 문제가 있어 메시지를 전송할수 없습니다.");
			}

			// ---* 송수신자 세팅
			String sb = "";
			for (Session s : rs) {
				sb += s.getUserProperties().get("usercharac") + ",";
			}

			String sbb = "";
			String[] sa = null;
			String sr = "";
			for (Session s : rs) {
				sbb = sb.replace(s.getUserProperties().get("usercharac") + ",", "");
				sbb = "".equals(sbb) ? "" : sbb.substring(0, sbb.length() - 1);
				sbb = s.getUserProperties().get("usercharac") + ("".equals(sbb) ? "" : ",") + sbb;
				sa = sbb.split(",");
				sr = "";
				for (String sss : sa) {
					sr += "<img style='width:80px' src='" + sss.replaceAll("person", "person_sub") + "' >";
				}
				j.put("info", sr);
				s.getBasicRemote().sendText(j.toJSONString());
			}
			return;
		}

		// ---* 메시지 type이 ALERT, NOTICE 시 실시간 알림 메시지를 상대방에 전송한다.
		// ---* 상대방 아이디의 roomid 가 'CONNECTOR'로 보낸다
		// ---* 실시간 알림 처리시
		if (w.getGubun().equals("ALERT") || w.getGubun().equals("NOTICE")) {
			List<Session> s = getConnectors();
			for (Session ss : s) {
				if (w.getUserid().equals(ss.getUserProperties().get("userid")))
					continue;
				ss.getBasicRemote().sendText(j.toJSONString());
			}
			return;
		}
	}

	/**
	 * 
	 * @date 2016. 12. 18.
	 * @param userSession void
	 * @description 웹소켓을 닫으면 해당 유저를 유저리스트에서 뺀다.
	 */
	@OnClose
	public void handleClose(Session userSession) {
		sessionUsers.remove(userSession);
		Log.log("WEBSOCKET", "USER_SESSION CLOSE", userSession.getId());
	}

	/**
	 * 
	 * @date 2017. 3. 23.
	 * @param w
	 * @return int
	 * @description 웹소켓 빈 값을 인자로 받아 사용자 혹은 상대방의 상태를 리턴한다
	 */
	private int getStatus(WebSocketBean w) {
		int result = STATUS_NOTLOGIN;
		if (w.getGubun().equals("ROOM_OPEN")) {
			if (checkConnector(w.getSendtoid())) {
				result = STATUS_CONNECTOR;
			}
			if (checkOpen(w.getSendtoid(), w.getRoomid())) {
				result = STATUS_OPEN;
			}
		}
		return result;
	}

	/**
	 * 
	 * @date 2017. 3. 24.
	 * @param userid
	 * @return boolean
	 * @description 로그인 상태인지 여부를 확인한다.
	 */
	private boolean checkConnector(String userid) {
		Iterator<Session> iterator = sessionUsers.iterator();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if (userid.equals(String.valueOf(s.getUserProperties().get("userid")))
					&& "CONNECTOR".equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				return true;
			}
			;
		}
		return false;
	}

	/**
	 * 
	 * @date 2017. 3. 24.
	 * @param userid
	 * @param roomid
	 * @return boolean
	 * @description 채팅방이 오픈되었는지 여부를 확인한다
	 */
	private boolean checkOpen(String userid, String roomid) {
		Iterator<Session> iterator = sessionUsers.iterator();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if (userid.equals(String.valueOf(s.getUserProperties().get("userid")))
					&& roomid.equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				return true;
			}
			;
		}
		return false;
	}

	/**
	 * 
	 * @date 2017. 3. 24.
	 * @param userid
	 * @return Session
	 * @description 사용자 혹은 상대방의 CONNECTOR 세션정보를 리턴한다
	 */
	private Session getConnectorSession(String userid) {
		Iterator<Session> iterator = sessionUsers.iterator();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if (userid.equals(String.valueOf(s.getUserProperties().get("userid")))
					&& "CONNECTOR".equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				return s;
			}
			;
		}
		return null;
	}

	/**
	 * 
	 * @date 2017. 4. 8.
	 * @return List<Session>
	 * @description CONNECTOR LIST 를 리턴한다
	 */
	private List<Session> getConnectors() {
		List<Session> r = new ArrayList<Session>();
		Iterator<Session> iterator = sessionUsers.iterator();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if ("CONNECTOR".equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				r.add(s);
			}
			;
		}
		return r;
	}

	/**
	 * 
	 * @date 2017. 3. 26.
	 * @param j
	 * @return
	 * @throws IOException int
	 * @description 리턴값이 2 보다 작은경우 상대방에게 메시지를 보내지 못한 경우임....
	 */
	@Autowired
	private List<Session> getsend(JSONObject j) throws IOException {
		Iterator<Session> iterator = sessionUsers.iterator();
		String roomid = Util.NVL(j.get("roomid"), "");
		List<Session> result = new ArrayList<Session>();
		while (iterator.hasNext()) {
			Session s = iterator.next();
			if (roomid.equals(String.valueOf(s.getUserProperties().get("roomid")))) {
				result.add(s);
			}
			;
		}
		return result;
	}

}