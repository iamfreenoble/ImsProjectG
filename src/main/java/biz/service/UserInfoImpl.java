package biz.service;

import ims.common.ImsServiceBaseImpl;
import ims.security.encrypt.Aes;
import org.json.simple.JSONObject;
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
@Service("UserInfoImpl")
public class UserInfoImpl extends ImsServiceBaseImpl {

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(UserInfoImpl.class);

	private String mapper = "biz.userInfo";

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 3.
	 * @description 비밀번호를 암호화 하여 저장
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Object insert2(HashMap<String, Object> hm) throws Exception {
		hm.put("user_pw", Aes.encrypt((String) hm.get("user_pw")));
		return sqlSession.insert(mapper + ".insert", hm);
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 3.
	 * @description 비밀번호를 암호화 하여 수정한다
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Object update2(HashMap<String, Object> hm) throws Exception {
		hm.put("user_pw", Aes.encrypt((String) hm.get("user_pw")));
		return sqlSession.update(mapper + ".update", hm);
	}

	/**
	 * 
	 * @author : yoo
	 * @date : 2019. 8. 8.
	 * @description checkIdAndPw 조회
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Object checkDupId(HashMap<String, Object> hm) throws Exception {
		HashMap<String, Object> map01 = sqlSession.selectOne(mapper + ".checkDupId", hm);
		JSONObject jobj = new JSONObject();
		jobj.put("view", map01);
		return jobj;
	}

	/**
	 * 
	 * @author : yoo
	 * @date : 2019. 8. 8.
	 * @description checkIdAndPw 조회
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Object checkIdAndPw(HashMap<String, Object> hm) throws Exception {

		HashMap<String, Object> map01 = sqlSession.selectOne(mapper + ".checkIdAndPw", hm);

		JSONObject jobj = new JSONObject();
		jobj.put("view", map01);
		return jobj;
	}

	public Object updatePw(HashMap<String, Object> hm) throws Exception {
		hm.put("user_pw", Aes.encrypt((String) hm.get("user_pw")));

		return sqlSession.update(mapper + ".updatePw", hm);
	}

}
