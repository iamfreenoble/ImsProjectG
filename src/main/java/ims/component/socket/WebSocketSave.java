package ims.component.socket;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author iamfreeguy
 * @date 2017. 3. 27.
 * @type_name WebSocketSave
 * @description 채팅 정보를 저장한다
 */
public class WebSocketSave extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger(WebSocketSave.class);

	private static final long serialVersionUID = 1L;

	public WebSocketSave() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 웹소켓 내용을 다운로드 한다
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String title = request.getParameter("wsTitle");
		String content = URLDecoder.decode(request.getParameter("wsContent"), "UTF-8");
		title = title + ".html";

		logger.info(" >>> WEB SOCKET CONTENT >>>" + content);

		// ---* content 를 html 형식으로 변경한다
		content = "<!doctype html><html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></head><body>"
				+ content + "</body></html>";

		response.setContentType("text/html; charset=UTF-8");
		response.setContentLength((int) content.length());
		// response.setHeader("Content-Transfer-Encoding", "binary;");

		// IE 11 Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
		// edge Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,
		// like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586
		// firefox Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101
		// Firefox/45.0
		// chrome Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like
		// Gecko) Chrome/49.0.2623.110 Safari/537.36
		// Safari Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like
		// Gecko) Version/5.1.7 Safari/534.57.2
		if (request.getHeader("User-Agent").contains("Trident")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + URLEncoder.encode(title, "UTF-8").replaceAll("[+]", " ") + ";");
		} else if (request.getHeader("User-Agent").contains("Edge")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + URLEncoder.encode(title, "UTF-8").replaceAll("[+]", " ") + ";");
		} else if (request.getHeader("User-Agent").contains("Firefox")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + new String(title.getBytes("ISO-8859-1"), "UTF-8") + ";");
			response.setHeader("Connection", "close");
		} else if (request.getHeader("User-Agent").contains("Chrome")) {
			response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(title, "UTF-8")
					.replaceAll("[+]", " ").replaceAll("%28", "(").replaceAll("%29", ")") + ";");
		} else if (request.getHeader("User-Agent").contains("Safari")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + new String(title.getBytes("UTF-8"), "ISO-8859-1") + ";");
		}

		OutputStream outStream = response.getOutputStream();

		try {

			DataOutputStream out = new DataOutputStream(outStream);
			OutputStreamWriter osw = new OutputStreamWriter(out);
			osw.write(content, 0, content.length());
			osw.close();
			out.close();

		} catch (Exception e) {
			logger.info(" >>> WEB SOCKET SAVE >>>" + e.getMessage());

		} finally {
			try {
				outStream.close();
			} catch (Exception e) {
			}
		}

	}

}
