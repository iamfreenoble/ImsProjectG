package ims.basic.session;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import ims.common.Log;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 25.
 * @type_name ImsUserListener
 * @description 세션 바인딩을 통하여 IMS USER 정보를 담는다
 *
 */
@WebListener
public class ImsSessionListener
		implements HttpSessionListener, HttpSessionAttributeListener, HttpSessionBindingListener {

	public ImsSessionListener() {
	}

	// --* HttpSessionListener

	/**
	 * 세션이 생성되었을떄.
	 */
	@Override
	public void sessionCreated(HttpSessionEvent se) {
		HttpSession s = se.getSession();
		ImsSessionBean.setUser(s.getId());
		;
		Log.log("SESSION CREATE", s.getId());
	}

	/**
	 * 세션이 삭제되었을떄
	 */
	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		HttpSession s = se.getSession();
		ImsSessionBean.delUser(s.getId());
		Log.log("SESSION DELETE", s.getId());
	}

	// --* HttpSessionAttributeListener

	/**
	 * 세션 Attribute 가 Add 시
	 */
	@Override
	public void attributeAdded(HttpSessionBindingEvent event) {
		HttpSession s = event.getSession();
		ImsSessionBean.setUserAttribute(s.getId(), event.getName(), String.valueOf(s.getAttribute(event.getName())));
		Log.log("SESSION ADD ATTRIBUTE ID=" + s.getId(), event.getName());
	}

	/**
	 * 세션 Attribute 가 Remove 시
	 */
	@Override
	public void attributeRemoved(HttpSessionBindingEvent event) {
		HttpSession s = event.getSession();
		Log.log("SESSION REMOVE ATTRIBUTE ID=" + s.getId(), event.getName());
	}

	/**
	 * 세션 Attribute 가 Replace 시
	 */
	@Override
	public void attributeReplaced(HttpSessionBindingEvent event) {
		HttpSession s = event.getSession();
		Log.log("SESSION REPLACE ATTRIBUTE ID=" + s.getId(), event.getName());
	}

	// --* HttpSessionBindingListener

	/**
	 * 세션 binding 시
	 */
	@Override
	public void valueBound(HttpSessionBindingEvent event) {
		HttpSession s = event.getSession();
		Log.log("SESSION BINDING ID=" + s.getId(), event.getName());
	}

	/**
	 * 세션 unbinding 시
	 */
	@Override
	public void valueUnbound(HttpSessionBindingEvent event) {
		HttpSession s = event.getSession();
		Log.log("SESSION UNBINDING ID=" + s.getId(), event.getName());
	}

}
