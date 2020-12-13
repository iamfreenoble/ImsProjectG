package biz.control;

import biz.common.Gmail;
import biz.service.UserInfoImpl;
import ims.basic.bean.ImsProperty;
import ims.common.Convert;
import ims.common.ImsControlBase;
import ims.security.encrypt.Aes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Random;

/**
 * 
 * @author : iamfreeguy-이상준
 * @description 사용자 관리
 *
 */
@Controller
@RequestMapping(value = "/userInfo")
public class UserInfo extends ImsControlBase {

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(UserInfo.class);

	/**
	 * 서비스 선언
	 */
	@Resource(name = "UserInfoImpl")
	protected UserInfoImpl userInfoImpl;

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @enclosing_type : UserInfo
	 * @description Constructor
	 *
	 */
	public UserInfo() {
		super();
		super.mapper = "biz.userInfo";
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @description 비밀번호를 암호화 하여 저장한다
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@Override
	@RequestMapping(value = "/insert.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object insert(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return userInfoImpl.insert2(Convert.paramdecode(r, m));
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @description 비밀번호를 암호화 하여 수정한다
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@Override
	@RequestMapping(value = "/update.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object update(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return userInfoImpl.update2(Convert.paramdecode(r, m));
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description 로그인 확인
	 * @param r
	 * @param m
	 * @return
	 * @throws Exception
	 *
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/logindo.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object logindo(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		HashMap<String, Object> result = (HashMap<String, Object>) userInfoImpl.view(mapper, m);
		String rv = "ERROR";
		String msg = "";

		if (result != null) {
			if ("Y".equals(result.get("is_del"))) {
				msg = "사용정지중인 사용자입니다\r\n관리자에게 문의하세요!!";
			} else {
				String pw = Aes.decrypt((String) result.get("user_pw"));
				if (pw.equals(m.get("user_pw"))) {
					rv = "OK";
					// --** session create...
					HttpSession session = r.getSession(true);
					session.setAttribute(ImsProperty.getInstance().getProperty("ST.USER.ID"), result.get("user_id"));
					session.setAttribute("auth_code", result.get("p_gubun"));
					session.setAttribute("session_auth_code", result.get("p_gubun"));
					session.setAttribute("auth_name", result.get("auth_name"));
					session.setAttribute("user_nm", result.get("user_nm"));
					session.setAttribute("super_user", result.get("super_user"));
					session.setAttribute("userInfo", result);
				} else {
					msg = "인증에 실패했습니다\r\n아이디나 [비밀번호]를 확인하여주십시요!!";
				}
			}
		} else {
			msg = "인증에 실패했습니다\r\n[아이디]나 비밀번호를 확인하여주십시요!!";
		}
		return Convert.jsonMessage(rv, msg);
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 2.
	 * @description 로그아웃 처리
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/logoutdo.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object logoutdo(HttpServletRequest r) throws Exception {
		HttpSession session = r.getSession();
		session.invalidate();
		return Convert.jsonMessage("OK", "");
	}

	/**
	 * 
	 * @author : 유종훈
	 * @date : 2019. 07. 21.
	 * @description 패스워드복호화 처리
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/convertPw.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object convertPw(HttpServletRequest r) throws Exception {
		// HttpSession session = r.getSession();
		// String pw = Aes.decrypt(r.getParameter("user_pw"));
		// HashMap<String,Object> h = new HashMap<String,Object>();
		// h.put("user_pw", Aes.decrypt(r.getParameter("user_pw")));
		return Aes.decrypt(r.getParameter("user_pw"));
	}

	/**
	 * 
	 * @author : yoo
	 * @date : 2019. 8. 8.
	 * @description 코드리스트 조회
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/checkDupId.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object checkDupId(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return userInfoImpl.checkDupId(Convert.paramdecode(r, m));
	}

	/**
	 * 
	 * @author : yoo
	 * @date : 2019. 8. 8.
	 * @description id체크 조회
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/checkId.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object checkId(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {

		return userInfoImpl.checkIdAndPw(Convert.paramdecode(r, m));
	}

	/**
	 * 
	 * @author : yoo
	 * @date : 2019. 8. 8.
	 * @description pw체크 조회
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/checkPw.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object checkPw(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		HashMap<String, Object> result = (HashMap<String, Object>) userInfoImpl.checkIdAndPw(Convert.paramdecode(r, m));
		String rv = "ERROR";
		String msg = "";
		Random rd = new Random();

		if (result.get("view") == null) {
			msg = "입력한 정보에 맞는 정보가 없습니다.";

		} else {
			String pw = rd.nextInt(1000000) + "";
			m.put("user_pw", pw);
			Gmail.sendEmail("패스워드변경", (String) m.get("email"), "변경 패스워드입니다  -->" + pw);
			userInfoImpl.updatePw(Convert.paramdecode(r, m));
			msg = "새로운패스워드를 메일로 전송하였습니다. ";
			rv = "OK";
		}
		return Convert.jsonMessage(rv, msg);
	}

	/**
	 * 
	 * @author : "yoo"
	 * @description 비밀번호를 암호화 하여 저장한다,세션체크회피
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/insertNoSess.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object insertNoSess(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {

		return userInfoImpl.insert2(Convert.paramdecode(r, m));
	}

}
