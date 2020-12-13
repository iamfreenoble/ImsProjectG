package biz.control;

import com.aspose.slides.Presentation;
import com.aspose.slides.SaveFormat;
import ims.basic.bean.ImsProperty;
import ims.common.Convert;
import ims.common.ImsControlBase;
import ims.component.file.Ims_F2Impl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * 
 * @author : LiSangJun
 * @description Sample 처리
 *
 */
@Controller
@RequestMapping(value = "/sample")
public class Sample extends ImsControlBase {

	@Resource(name = "Ims_F2Impl")
	private Ims_F2Impl imsF2Impl;

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(Sample.class);

	public Sample() {
		super();
		super.mapper = "biz.sample";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/pdfopen.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object pdfopen(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {

		ArrayList<HashMap<String, String>> list2 = (ArrayList<HashMap<String, String>>) imsF2Impl
				.list2(Convert.paramdecode(r, m));
		String name = list2.get(0).get("f2_save_file_name");
		name = name.substring(0, name.lastIndexOf(".")) + ".pdf";
		String path2 = ImsProperty.getInstance().getProperty("PDF.path");

		logger.info("pdf open [file name] -> " + name);

		path2 = "D:\\Project\\AProject\\workspace2019_03\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp3\\wtpwebapps\\ImsProject\\resources\\";

		logger.info("pdf open [presentation convert ] -> open ");
		Presentation p = new Presentation(
				"D:\\Project\\AProject\\document\\202009 의정부시 평생학습원\\UI-네오 관리자화면 기준_v0.6_2020913_이상준_답변.pptx");

		logger.info("pdf open [presentation convert ] -> convert ");
		p.save(path2 + name, SaveFormat.Pdf);

		return name;

	}

}
