package ims.component.file;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import ims.basic.bean.ImsClassDispatcher;
import ims.basic.bean.ImsProperty;
import ims.common.Convert;

/**
 * 
 * @author : LiSangJun
 * @description IE 10 이하 파일 업로드시 사용함
 *
 */
@Controller
@RequestMapping(value = "/ims/f2/ie/")
public class FileUploadManage2 {

	public static final Logger logger = LoggerFactory.getLogger(FileUploadManage2.class);

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 12. 18.
	 * @description 파일 업로드
	 * @param request
	 * @param param
	 * @param ufile
	 * @throws IOException
	 *
	 */
	@RequestMapping(value = "/fileupload.do", method = { RequestMethod.GET, RequestMethod.POST })
	public void fileupload(HttpServletRequest request, @RequestParam String F2_fgroupkey,
			@RequestParam MultipartFile F2_file_select) throws IOException {

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
			File fobj = null;
			long fsize = 0;

			// --** 파일 생성
			fname = F2_file_select.getOriginalFilename()
					.substring(F2_file_select.getOriginalFilename().lastIndexOf(File.separator) + 1);
			fext = fname.substring(fname.lastIndexOf(".") + 1);
			sname = dtime + "." + fext;
			fsize = F2_file_select.getSize();
			fgroupkey = F2_fgroupkey;

			logger.info("IMS FILE UPLOAD V2 FOR IE START [FILENAME=" + fname + "] [SAVE FILENAME=" + sname
					+ "] [GROUPKEY=" + fgroupkey + "] ------------------------->>>>>>  ");
			fobj = new File(path + File.separator + sname);
			F2_file_select.transferTo(fobj);
			logger.info("IMS FILE UPLOAD V2 FOR IR END [FILENAME=" + fname + "] [SAVE FILENAME=" + sname
					+ "] [GROUPKEY=" + fgroupkey + "] ------------------------->>>>>>  ");

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

			logger.info("IMS FILE UPLOAD V2 FOR IE DB SAVE [FILENAME=" + fname + "] [SAVE FILENAME=" + sname
					+ "] [GROUPKEY=" + fgroupkey + "] ------------------------->>>>>>  ");

		} catch (Exception e) {

			logger.error("IMS FILE UPLOAD V2 ERROR -->  " + e.getMessage());
			throw new IOException();

		} finally {

		}

	}

}
