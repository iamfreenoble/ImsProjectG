package ims.component.file;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ims.basic.bean.ImsClassDispatcher;
import ims.basic.bean.ImsProperty;
import ims.common.Convert;
import org.springframework.stereotype.Component;

/**
 * 
 * author : 이상준 date : 2016. 4. 3. [description] File Upload 서블릿
 */
@WebServlet(name = "FileUploadServlet", urlPatterns = { "/FileUploadManage" })
@MultipartConfig(location = "", maxFileSize = -1L, fileSizeThreshold = 52428800, maxRequestSize = -1L)
public class FileUploadManage extends HttpServlet {

	public static final Logger logger = LoggerFactory.getLogger(FileUploadManage.class);

	private static final long serialVersionUID = 1L;
	private static FileUploadManage instance;

	public FileUploadManage() {
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
	 * 파일 생성함
	 */
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		final PrintWriter writer = response.getWriter();
		String path = "";
		try {

			// Create path components to save the file
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHH", Locale.KOREA);
			Date currentTime = new Date();
			String folder = formatter.format(currentTime);
			path = ImsProperty.getInstance().getProperty("FILE.defaultpath") + File.separator + folder;

			// --** save file name
			String dtime = Long.toString(System.currentTimeMillis());

			// 디렉토리가 없으면
			File dir = new File(path);
			if (!dir.isDirectory()) {
				dir.mkdirs();
			}

			String fname = "";
			String sname = "";
			String fgroupkey = "";
			String fext = "";
			Part fobj = null;
			long fsize = 0;

			Collection<Part> parts = request.getParts();
			Iterator<Part> iter = parts.iterator();

			// --** form data를 분석하여 fgroupid, fname 과 file 을 구한다
			while (iter.hasNext()) {
				final Part part = iter.next();
				if (part.getName().equals("file")) {
					fobj = part;
				}
				if (part.getName().startsWith("filename=")) {
					fname = part.getName().substring(9);
					if (fname.lastIndexOf(File.separator) != -1) {
						fname = fname.substring(fname.lastIndexOf(File.separator) + 1);
					}
					if (fname.lastIndexOf(".") != -1) {
						fext = fname.substring(fname.lastIndexOf(".") + 1);
						sname = dtime + "." + fext;
					} else {
						sname = dtime;
					}
				}
				if (part.getName().startsWith("fgroupkey=")) {
					fgroupkey = part.getName().substring(10);
				}

			}

			// --** fname 의 경우 톰캣등에서는 파일정보만 가져오나
			// --** 웹로직 서버에서는 파일의 로컬 Fullpath 를 가져온다.
			// --** Fi;e.seperator 로 substring 처리

			logger.info("IMS FILE UPLOAD V2 START [FILENAME=" + fname + "] [SAVE FILENAME=" + sname + "] [GROUPKEY="
					+ fgroupkey + "] ------------------------->>>>>>  ");

			// --** file write
			if (fobj != null) {

				try {
					fsize = fobj.getSize();
					fobj.write(path + File.separator + sname);
					fobj.delete();

				} catch (Exception e) {

					OutputStream out = null;
					BufferedInputStream bufferedInputStream = null;
					BufferedOutputStream bufferedOutputStream = null;
					fsize = fobj.getSize();

					try {
						out = new FileOutputStream(new File(path + File.separator + sname));
						bufferedOutputStream = new BufferedOutputStream(out);
						bufferedInputStream = new BufferedInputStream(fobj.getInputStream());

						int read = 0;
						final byte[] bytes = new byte[1024 * 1024 * 50]; // 1GB
						while ((read = bufferedInputStream.read(bytes)) != -1) {
							bufferedOutputStream.write(bytes, 0, read);
							logger.info("IMS FILE UPLOAD V2 WRITE [FILENAME=" + fname + "] [SAVE FILENAME=" + sname
									+ "] [GROUPKEY=" + fgroupkey + "] ------------------------->>>>>>  ");
						}

					} finally {
						if (out != null) {
							out.close();
						}
						if (bufferedInputStream != null) {
							bufferedInputStream.close();
						}
						if (bufferedOutputStream != null) {
							bufferedOutputStream.close();
						}
					}

				}

				/*
				 * FileInputStream inputStream = fobj.write(fileName);; FileOutputStream
				 * outputStream = new FileOutputStream(new File(path + File.separator+ sname));
				 * 
				 * FileChannel fcin = inputStream.getChannel(); FileChannel fcout =
				 * outputStream.getChannel();
				 * 
				 * fsize = fcin.size(); fcin.transferTo(0, fsize, fcout);
				 * 
				 * fcout.close(); fcin.close();
				 * 
				 * outputStream.close(); inputStream.close();
				 */

				/*
				 * OutputStream out = null; BufferedInputStream bufferedInputStream = null;
				 * BufferedOutputStream bufferedOutputStream = null; fsize = fobj.getSize();
				 * 
				 * try { out = new FileOutputStream(new File(path + File.separator+ sname));
				 * bufferedOutputStream = new BufferedOutputStream(out); bufferedInputStream =
				 * new BufferedInputStream(fobj.getInputStream());
				 * 
				 * int read = 0; final byte[] bytes = new byte[1024*1024*1024]; // 1GB while
				 * ((read = bufferedInputStream.read(bytes)) != -1) {
				 * bufferedOutputStream.write(bytes, 0, read);
				 * logger.info("IMS FILE UPLOAD V2 WRITE [FILENAME="+fname+"] [SAVE FILENAME="
				 * +sname+"] [GROUPKEY="+fgroupkey+"] ------------------------->>>>>>  "); }
				 * 
				 * } finally{ if (out != null) { out.close(); } if (bufferedInputStream != null)
				 * { bufferedInputStream.close(); } if (bufferedOutputStream != null) {
				 * bufferedOutputStream.close(); } }
				 */

			}

			logger.info("IMS FILE UPLOAD V2 END [FILENAME=" + fname + "] [SAVE FILENAME=" + sname + "] [GROUPKEY="
					+ fgroupkey + "] ------------------------->>>>>>  ");

			// --** DB 에 저장한다..
			HashMap<String, Object> hm = new HashMap<String, Object>();
			hm.put("f2_group_key", fgroupkey);
			hm.put("f2_display_file_name", fname);
			hm.put("f2_save_file_name", sname);
			hm.put("f2_save_file_path", path + File.separator + sname);
			hm.put("f2_file_extension", fext);
			hm.put("f2_file_size", fsize);
			Ims_F2Impl imsF2Impl = (Ims_F2Impl) ImsClassDispatcher.applicationContext.getBean(Ims_F2Impl.class);
			imsF2Impl.insert("ims.f2", Convert.paramdecode(request, hm));

			logger.info("IMS FILE UPLOAD V2 DB SAVE [FILENAME=" + fname + "] [SAVE FILENAME=" + sname + "] [GROUPKEY="
					+ fgroupkey + "] ------------------------->>>>>>  ");

		} catch (Exception e) {

			logger.error("IMS FILE UPLOAD V2 ERROR -->  " + e.getMessage());
			response.sendError(400, "File Upload Error!!!!");
			throw new IOException();

		} finally {
			if (writer != null) {
				writer.close();
			}
		}

	}

	/**
	 * 
	 * @Method : getInstance
	 * @date : 2014. 5. 26.
	 * @author : IAMSKY
	 * @Desc : Singleton 처리
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public static synchronized FileUploadManage getInstance() {
		if (instance == null)
			instance = new FileUploadManage();
		return instance;
	}

}
