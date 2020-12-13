package biz.service;

import ims.common.ImsServiceBaseImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;

/**
 * 
 * @author : iamfreeguy-LiSangjun
 * @description 사용자 서비스
 *
 */
@Service("CodeImpl")
public class CodeImpl extends ImsServiceBaseImpl {

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(CodeImpl.class);

	private String mapper = "biz.code";

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 8.
	 * @description codelist 조회
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Object codelist(HashMap<String, Object> hm) throws Exception {
		return sqlSession.selectList(mapper + ".codelist", hm);
	}

}
