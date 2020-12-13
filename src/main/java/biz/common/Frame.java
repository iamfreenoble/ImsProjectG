package biz.common;

import ims.basic.bean.ImsProperty;
import ims.common.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;

/**
 * 
 * author : iamfr date : 2016. 3. 13. [description] Go, Frame 서비스등 초기 및 공통 서비스
 */
@Controller
public class Frame {

	/**
	 * 
	 * date : 2016. 3. 12. return : String
	 * 
	 * @return [description] root
	 */
	@RequestMapping(value = "/")
	public ModelAndView frame(HttpServletRequest request) {
		ModelAndView m = new ModelAndView("/frame");
		String sacode = request.getParameter("session_auth_code") == null
				? (String) request.getSession().getAttribute("session_auth_code")
				: (String) request.getParameter("session_auth_code");
		request.getSession().setAttribute("session_auth_code", sacode);
		m.addObject("session_auth_code", sacode);


		return m;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description 로그인 페이지로 이동
	 * @param request
	 * @return
	 *
	 */
	@RequestMapping(value = "/login")
	public ModelAndView login(HttpServletRequest request) {
		ModelAndView m = new ModelAndView("/login");
		return m;
	}

	/**
	 * 
	 * date : 2016. 3. 13. return : String
	 * 
	 * @param go
	 * @return [description] 화면이동
	 */
	@RequestMapping(value = "go.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String go(HttpServletRequest request, @RequestParam(value = "go", required = true) String go) {

		// --** session 이 없으면 로그인으로 전환
		HttpSession session = request.getSession(false);
		if (session == null || Util.isNull(session.getAttribute(ImsProperty.getInstance().getProperty("ST.USER.ID")))) {
			return "/login";
		}

		Enumeration<String> keys = request.getParameterNames();
		while (keys.hasMoreElements()) {
			String key = keys.nextElement();
			request.setAttribute(key, request.getParameter(key));
		}
		return go;
	}

}
