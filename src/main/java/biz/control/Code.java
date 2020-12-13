package biz.control;

import biz.service.CodeImpl;
import ims.common.Convert;
import ims.common.ImsControlBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 
 * @author : iamfreeguy-이상준
 * @description 코드 관리
 *
 */
@Controller
@RequestMapping(value = "/code")
public class Code extends ImsControlBase {

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(Code.class);

	@Resource(name = "CodeImpl")
	private CodeImpl codeImpl;

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @enclosing_type : UserInfo
	 * @description Constructor
	 *
	 */
	public Code() {
		super();
		super.mapper = "biz.code";
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 8.
	 * @description 코드리스트 조회
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@RequestMapping(value = "/codelist.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object codelist(HttpServletRequest r) throws Exception {
		return codeImpl.codelist(Convert.paramdecode(r));
	}

}
