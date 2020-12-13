package biz.common;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 * author : asus date : 2016. 4. 5. [description] 오류처리
 */
@SuppressWarnings("serial")
public class ErrorServlet extends HttpServlet {

	@Override
	@SuppressWarnings("unused")
	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
		// You can log the exception, send to email, etc
	}

}