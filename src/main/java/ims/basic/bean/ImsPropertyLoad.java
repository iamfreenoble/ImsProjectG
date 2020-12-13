package ims.basic.bean;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 25.
 * @type_name ImsProperty
 * @description property 설정
 */
public class ImsPropertyLoad extends HttpServlet {

	private static final long serialVersionUID = 1L;
	static final Logger logger = LoggerFactory.getLogger(ImsPropertyLoad.class);

	/**
	 * 
	 * ImsProperty.java ims.property iamfreeguy
	 *
	 */
	public ImsPropertyLoad(Environment env) {

		// --* property 파일 오픈
		ImsProperty.getInstance().load(env);
		logger.info(
				"[[ SERVER GUBUN ]]=================<<  " + ImsProperty.getInstance().getProperty("GUBUN") + "  >>");
	}

	public ImsPropertyLoad() {

		// --* property 파일 오픈
		ImsProperty.getInstance().load();
		logger.info(
				"[[ SERVER GUBUN ]]=================<<  " + ImsProperty.getInstance().getProperty("GUBUN") + "  >>");
	}

	/**
	 * get
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	/**
	 * post
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

}
