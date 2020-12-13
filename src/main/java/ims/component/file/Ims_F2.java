package ims.component.file;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import ims.common.Convert;
import ims.common.ImsControlBase;

/**
 * 
 * @author : LiSangJun
 * @description 파일 데이타 처리를 위한 공통 컨트롤러
 *
 */
@Controller
@RequestMapping(value = "/ims/f2")
public class Ims_F2 extends ImsControlBase {
	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(Ims_F2.class);

	@Resource(name = "Ims_F2Impl")
	private Ims_F2Impl imsF2Impl;

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @enclosing_type : UserInfo
	 * @description Constructor
	 *
	 */
	public Ims_F2() {
		super();
		super.mapper = "ims.f2";
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 11. 19.
	 * @description group key 로 파일 정보를 읽어온다
	 * @param r
	 * @param m
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/list2.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object list(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsF2Impl.list2(Convert.paramdecode(r, m));
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 그룹 key get
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/getgroupkey.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object getgroupkey(HttpServletRequest r) throws Exception {
		return imsF2Impl.getgroupkey(Convert.paramdecode(r));
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 사용여부 정보를 업데이트 한다
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/updateuseyn.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object updateuseyn(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		imsF2Impl.updateuseyn(Convert.paramdecode(r, m));
		return "OK";
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 삭제대기를 삭제로 확정함
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/updateuseynall.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object updateuseynall(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		imsF2Impl.updateuseynall(Convert.paramdecode(r, m));
		return "OK";
	}

}
