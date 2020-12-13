package biz.core;

import ims.basic.bean.ImsProperty;
import ims.common.Convert;
import ims.common.Util;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;

/**
 * 
 * author : 이상준 date : 2016. 3. 9. [description] interceptor 를 사용하여 공통처리
 */
public class Interceptor implements HandlerInterceptor {

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(Interceptor.class);

	private final static String nocheck = ",/login,/userInfo/logindo.do,/userInfo/checkId.do,/userInfo/checkDupId.do,/userInfo/checkPw.do,/userInfo/insertNoSess.do,";

	/**
	 * controller 호출전
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		String surl = request.getRequestURI();

		if ("/".equals(surl) || surl.lastIndexOf(".do") > -1 || ".do?".contains(surl)) {

			if (!nocheck.contains("," + surl + ",")) {
				// --** Session 여부를 확인한다.
				HttpSession session = request.getSession(false);

				if (session != null
						&& !Util.isNull(session.getAttribute(ImsProperty.getInstance().getProperty("ST.USER.ID")))) {
					String sKey = "";
					Enumeration<String> ie = session.getAttributeNames();
					while (ie.hasMoreElements()) {
						sKey = ie.nextElement().toString();
						request.setAttribute(sKey, session.getAttribute(sKey));
					}
				} else {

					// --** 로그인 화면으로 이동
					if ("/".equals(surl)) {
						RequestDispatcher dispatcher = request.getRequestDispatcher("/login");
						dispatcher.forward(request, response);
					} else {
						JSONObject j = Convert.jsonMessage("-999", "사용자 세션이 만료되었습니다\n로그인 페이지로 이동합니다", true);
						response.getWriter().write(j.toJSONString());
						response.setStatus(401);
					}
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Controller가 수행되고 View를 호출하기 전
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object obj,
			ModelAndView modelandview) throws Exception {
		// logger.info("POSTHAND >> " + request.getAttribute("id") + ">>" +
		// request.getRequestURL());
	}

	/**
	 * View 작업까지 완료된 후 호출. responseBody 를 이용할 경우 UI 에 이미 값을 전달후 해당 부분이 호출됨
	 */
	@Override
	public void afterCompletion(HttpServletRequest httpservletrequest, HttpServletResponse httpservletresponse,
			Object obj, Exception exception) throws Exception {
		// error 처리
		if (exception != null) {
			// httpservletrequest.setAttribute("except_messgae", exception.getMessage());
			String smsg = "Y".equals(httpservletrequest.getSession().getAttribute("super_user"))
					? exception.getMessage()
					: Convert.encode("시스템 장애가 발생했습니다.\n관리자에게 문의하세요", "UTF-8").replaceAll("[+]", " ");
			httpservletresponse.getWriter().print(smsg);
		}
	}
}
