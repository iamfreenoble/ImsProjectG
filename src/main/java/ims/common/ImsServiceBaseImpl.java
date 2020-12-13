package ims.common;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.SqlSession;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * 
 * @author : iamfreeguy-LiSangjun
 * @description ver2 를 적용한 프로젝트 관련 control
 *
 */
@Service("ImsServiceBaseImpl")
public class ImsServiceBaseImpl implements ImsServiceBase {

	@Autowired
	@Qualifier("sqlSession")
	protected SqlSession sqlSession;

	@Autowired
	protected DataSourceTransactionManager transactionManager;

	public ImsServiceBaseImpl() {
	}

	/*----------------------*/
	/* COMMON CONTROL AREA */

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 4. 7.
	 * @description list common control
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	@Transactional(readOnly = true)
	public Object list(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.selectList(mapper + ".list", hm);
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 4. 7.
	 * @description view common control
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object view(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.selectOne(mapper + ".view", hm);
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 4. 7.
	 * @description insert common control
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object insert(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.insert(mapper + ".insert", hm);
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 4. 7.
	 * @description update common control
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object update(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.update(mapper + ".update", hm);
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 4. 7.
	 * @description delete common control
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object delete(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.delete(mapper + ".delete", hm);
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 3. 17.
	 * @description 타입이 String 인 경우
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object delete2(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.delete(mapper + ".delete", hm);
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 11. 4.
	 * @description remove common control
	 * @param r
	 * @param m
	 * @return
	 * @throws Exception
	 *
	 */
	public Object remove(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.delete(mapper + ".remove", hm);
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 3. 17.
	 * @description String 타입인 경우
	 * @param r
	 * @return
	 * @throws Exception
	 *
	 */
	public Object remove2(String mapper, HashMap<String, Object> hm) throws Exception {
		return sqlSession.delete(mapper + ".remove", hm);
	}

	protected TransactionStatus getTransactionStatus() {
		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
		def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
		return transactionManager.getTransaction(def);
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 3. 16.
	 * @description XGrid 를 위한 resultX 추가
	 * @param req
	 * @param data
	 * @return
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 *
	 */
	protected JSONObject result(HttpServletRequest req, List<Object> data)
			throws IllegalArgumentException, IllegalAccessException {
		JSONObject jobj = Convert.resultX2(req, data);
		return jobj;
	}

	/**
	 * 
	 * date : 2016. 3. 12. return : JSONObject
	 * 
	 * @param data
	 * @param t
	 * @return [description] data 를 json 형태로 리턴하되 정해진 갯수만큼만 리턴한다
	 */
	protected JSONObject result2(HttpServletRequest req, List<Object> data, int t) {
		JSONObject jobj = Convert.result(req, data, t);
		return jobj;

	}

}
