package ims.basic.bean;

import java.lang.reflect.Field;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 
 * @Type : Core
 * @Date : 2014. 4. 14.
 * @Author : IAMSKY
 * @Desc : --------------------------------------
 * @변경이력 2018.04.15 super class extends 앤 경우 처리 추가
 */
public final class Core {

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @param session
	 * @param request
	 * @param fromObj
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException   void
	 * @description 세션값 세팅
	 *
	 */
	public static void setSessionAttributeFromObject(HttpSession session, HttpServletRequest request, Object fromObj)
			throws IllegalArgumentException, IllegalAccessException {
		Class<?> c = fromObj.getClass();
		do {
			for (Field f : c.getDeclaredFields()) {
				f.setAccessible(true);
				if (f.get(fromObj) == null)
					continue;
				session.setAttribute(f.getName(), f.get(fromObj));
				request.setAttribute(f.getName(), f.get(fromObj));
			}
		} while ((c = c.getSuperclass()) != null);
	}

}