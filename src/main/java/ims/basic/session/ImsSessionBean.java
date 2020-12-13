/**
 * 
 */
package ims.basic.session;

import java.util.Hashtable;

import ims.basic.bean.ImsProperty;
import ims.basic.user.ImsUserBean;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 26.
 * @type_name ImsSessionBean
 * @description 세션빈에 세션정보를 관리한다.
 */
public class ImsSessionBean {

	private volatile static ImsSessionBean instance;
	private static Hashtable<String, Object> u; // ---* 사용자 bean session id , userinfo
	private static Hashtable<String, String> siu; // ---* 사용자 session interface userid , session id

	private ImsSessionBean() {

	}

	/**
	 * 
	 * @date 2016. 12. 26.
	 * @return ImsSessionBean
	 * @description 싱글톤 선언
	 */
	private static synchronized ImsSessionBean getInstance() {
		if (instance == null) {
			instance = new ImsSessionBean();
			u = new Hashtable<String, Object>();
			siu = new Hashtable<String, String>();
		}
		return instance;
	}

	/**
	 * 
	 * @date 2016. 12. 26.
	 * @param sid
	 * @description 사용자 정보를 생성한다.
	 */
	public static void setUser(String sid) {
		if (instance == null)
			getInstance();
		u.put(sid, new ImsUserBean());
	}

	/**
	 * 
	 * @date 2016. 12. 26.
	 * @param sid void
	 * @description 사용자 정보를 삭제한다.
	 */
	public static void delUser(String sid) {
		if (instance == null)
			getInstance();
		ImsUserBean user = (ImsUserBean) u.get(sid);
		if (user == null || user.getId() == null)
			return;
		siu.remove(user.getId());
		u.remove(sid);

	}

	/**
	 * 
	 * @date 2016. 12. 26.
	 * @param sid
	 * @param key
	 * @param v   void
	 * @description 사용자 attribute 정보를 등록한다.
	 */
	public static void setUserAttribute(String sid, String key, String v) {
		if (instance == null)
			getInstance();
		if (u.get(sid) == null)
			setUser(sid);

		ImsUserBean user = (ImsUserBean) u.get(sid);
		ImsProperty p = ImsProperty.getInstance();

		// --* key
		String pv = p.getProperty("USER.key");
		if (key.equals(pv)) {
			user.setKey(v);
			u.put(sid, user);
			siu.put(v, sid); // ---* 사용자 is, session id 링크 정보 등록....
			return;
		}

		// --* id
		pv = p.getProperty("USER.id");
		if (key.equals(pv)) {
			user.setId(v);
			u.put(sid, user);
			return;
		}

		// --* pw
		pv = p.getProperty("USER.pw");
		if (key.equals(pv)) {
			user.setPw(v);
			u.put(sid, user);
			return;
		}

		// --* username
		pv = p.getProperty("USER.username");
		if (key.equals(pv)) {
			user.setUsername(v);
			u.put(sid, user);
			return;
		}

		// --* phone
		pv = p.getProperty("USER.phone");
		if (key.equals(pv)) {
			user.setPhone(v);
			u.put(sid, user);
			return;
		}

		// --* email
		pv = p.getProperty("USER.email");
		if (key.equals(pv)) {
			user.setEmail(v);
			u.put(sid, user);
			return;
		}

		// --* logindate
		pv = p.getProperty("USER.logindate");
		if (key.equals(pv)) {
			user.setLogindate(v);
			u.put(sid, user);
			return;
		}

		// --* loginip
		pv = p.getProperty("USER.loginip");
		if (key.equals(pv)) {
			user.setLoginip(v);
			u.put(sid, user);
			return;
		}

		// --* team
		pv = p.getProperty("USER.team");
		if (key.equals(pv)) {
			user.setTeam(v);
			u.put(sid, user);
			return;
		}

		// --* teamname
		pv = p.getProperty("USER.teamname");
		if (key.equals(pv)) {
			user.setTeamname(v);
			u.put(sid, user);
			return;
		}

	}

}
