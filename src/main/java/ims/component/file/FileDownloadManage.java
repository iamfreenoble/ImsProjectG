package ims.component.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ims.basic.bean.ImsClassDispatcher;
import org.springframework.stereotype.Component;

/**
 * 
 * author : 이상준 date : 2016. 4. 3. [description] FileDownload Servlet
 */
@WebServlet(name = "FileDownloadServlet", urlPatterns = { "/FileDownloadManage" })
@MultipartConfig(location = "C:/Temp", maxFileSize = -1L, fileSizeThreshold = 52428800, maxRequestSize = -1L)
public class FileDownloadManage extends HttpServlet {

	public static final Logger logger = LoggerFactory.getLogger(FileDownloadManage.class);

	private static final long serialVersionUID = 1L;
	private static FileDownloadManage instance;

	public FileDownloadManage() {
		super();
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 파일 다운로드함
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		HashMap<String, Object> hm = new HashMap<String, Object>();
		HashMap<String, Object> result = new HashMap<String, Object>();
		hm.put("f2_key", request.getParameter("f2_key"));
		Ims_F2Impl ImsF2Impl = (Ims_F2Impl) ImsClassDispatcher.applicationContext.getBean(Ims_F2Impl.class);
		try {
			result = (HashMap<String, Object>) ImsF2Impl.view("ims.f2", hm);
		} catch (Exception e) {
			logger.error("IMS FILE DOWNLOAD V2 ERROR -->  " + e.getMessage());
			response.sendError(400, "File Download Error!!!!");
			throw new IOException();
		}

		String filePath = (String) result.get("f2_save_file_path");
		File downloadFile = new File(filePath);

		response.setContentType("application/octet-stream; charset=UTF-8");
		response.setContentLength((int) downloadFile.length());
		response.setHeader("Content-Transfer-Encoding", "binary;");

		String fname = (String) result.get("f2_display_file_name");

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
					"attachment; filename=" + URLEncoder.encode(fname, "UTF-8").replaceAll("[+]", " ") + ";");
		} else if (request.getHeader("User-Agent").contains("Edge")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + URLEncoder.encode(fname, "UTF-8").replaceAll("[+]", " ") + ";");
		} else if (request.getHeader("User-Agent").contains("Firefox")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + new String(fname.getBytes("ISO-8859-1"), "UTF-8") + ";");
			response.setHeader("Connection", "close");
		} else if (request.getHeader("User-Agent").contains("Chrome")) {
			response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(fname, "UTF-8")
					.replaceAll("[+]", " ").replaceAll("%28", "(").replaceAll("%29", ")") + ";");
		} else if (request.getHeader("User-Agent").contains("Safari")) {
			response.setHeader("Content-Disposition",
					"attachment; filename=" + new String(fname.getBytes("UTF-8"), "ISO-8859-1") + ";");
		}

		FileInputStream inStream = new FileInputStream(downloadFile);
		OutputStream outStream = response.getOutputStream();

		try {
			byte[] buffer = new byte[4096];
			int bytesRead = -1;
			double current = 0;
			while ((bytesRead = inStream.read(buffer)) != -1) {
				outStream.write(buffer, 0, bytesRead);
				current += bytesRead;
				if (current > 1024 * 1024 * 10) { // flush after 10MB
					current = 0;
					outStream.flush();
				}
			}
			logger.info(filePath + ">>> FILE DOWNLOAD COMPLETE");
		} catch (Exception e) {
			logger.info(filePath + ">>> FILE DOWNLOAD ERROR >>>" + e.getMessage());
		} finally {
			try {
				outStream.close();
			} catch (Exception e) {
			}
			try {
				inStream.close();
			} catch (Exception e) {
			}
			logger.info(filePath + ">>> FILE DOWNLOAD FINAL");
		}

	}

	public static synchronized FileDownloadManage getInstance() {
		if (instance == null)
			instance = new FileDownloadManage();
		return instance;
	}

}
