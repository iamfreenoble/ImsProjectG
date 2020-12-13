package ims.common;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 
 * author : 이상준 date : 2016. 3. 12.
 * 
 * @param [description] 컨트롤 베이스 처리 DB 연결, return 값 처리 2018.03.15 XGrid 를 위한
 *                      resultX 추가 2018.10.28 vo 사용을 없앰
 */
@Repository
public class ImsControlBase {

	protected String mapper;

	public ImsControlBase() {
	}

	@Resource(name = "ImsServiceBaseImpl")
	protected ImsServiceBaseImpl imsServiceBaseImpl;

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
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	@RequestMapping(value = "/list.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object list(HttpServletRequest r) throws Exception {
		return result(r, (List<Object>) imsServiceBaseImpl.list(mapper, Convert.paramdecode(r)));
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
	@RequestMapping(value = "/view.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object view(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsServiceBaseImpl.view(mapper, Convert.paramdecode(r, m));
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
	@RequestMapping(value = "/insert.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object insert(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsServiceBaseImpl.insert(mapper, Convert.paramdecode(r, m));
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
	@RequestMapping(value = "/update.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object update(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsServiceBaseImpl.update(mapper, Convert.paramdecode(r, m));
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
	@RequestMapping(value = "/delete.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object delete(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsServiceBaseImpl.delete(mapper, Convert.paramdecode(r, m));
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
	@RequestMapping(value = "/delete2.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object delete2(HttpServletRequest r) throws Exception {
		return imsServiceBaseImpl.delete2(mapper, Convert.paramdecode(r));
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
	@RequestMapping(value = "/remove.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object remove(HttpServletRequest r, @RequestBody HashMap<String, Object> m) throws Exception {
		return imsServiceBaseImpl.remove(mapper, Convert.paramdecode(r, m));
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
	@RequestMapping(value = "/remove2.do", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object remove2(HttpServletRequest r) throws Exception {
		return imsServiceBaseImpl.remove2(mapper, Convert.paramdecode(r));
	}

	/* COMMON CONTROL AREA */
	/*----------------------*/

	/**
	 * 
	 * date : 2016. 8. 30. return : TransactionStatus
	 * 
	 * @return [description] tranaction status get annotation 으로 변경
	 */

	/*
	 * protected TransactionStatus getTransactionStatus(){
	 * //DefaultTransactionDefinition def = new DefaultTransactionDefinition();
	 * //def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
	 * //return transactionManager.getTransaction(def); return null; }
	 */

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
