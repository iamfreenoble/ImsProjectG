package ims.extend;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import ims.basic.bean.ImsProperty;

/**
 * 
 * @author : iamfreeguy-이상준
 * @description SqlSessionTemplate 을 상송받아 session 값등을 미리 세팅함
 *
 */
public class ImsSqlSessionTemplate extends SqlSessionTemplate {

	public ImsSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
		super(sqlSessionFactory);
	}

	@Override
	public int insert(String statement, Object parameter) {
		// 인서트시에 공통으로 넣을 값들을 parameter에 추가함
		return super.insert(statement, parameter);
	}

	@Override
	public int update(String statement, Object parameter) {
		setSqlSessionTemplateFromObject(parameter);
		return super.update(statement, parameter);
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description SqlSessinonTemplate 객체에 세션의 사용자 아이디 등을 세팅
	 * @param session
	 * @param fromObj
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 *
	 */
	@SuppressWarnings("unchecked")
	private void setSqlSessionTemplateFromObject(Object fromObj) {

		String userId = ImsProperty.getInstance().getProperty("ST.USER.ID");
		if (userId == null) {
			return;
		}

		Class<?> c = fromObj.getClass();

		if ("java.util.HashMap".equals(c.getName())) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
					.getRequest();
			HttpSession session = request.getSession(false);
			if (session == null)
				return;
			((HashMap<String, Object>) fromObj).put(userId, session.getAttribute(userId));

		}
	}

}
