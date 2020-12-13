package ims.common;

import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
//import org.json.simple.JSONObject;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import ims.basic.bean.ImsProperty;

/**
 * 
 * @Type : Convert
 * @Date : 2014. 5. 4.
 * @Author : IAMSKY
 * @Desc : 변환 --------------------------------------
 * @변경이력 2018.03.15 XGrid 추가
 */
public class Convert {

	/**
	 * 
	 * @Method : mapToJsonObject
	 * @date : 2014. 5. 4.
	 * @author : IAMSKY
	 * @Desc : HashMap 을 JsonObject 로 전환
	 * @param map
	 * @return
	 * @throws JSONException ----------------------------------
	 * @변경이력
	 *
	 */
	@SuppressWarnings("unchecked")
	public static JSONObject mapToJsonObject(HashMap<String, Object> map) {
		JSONObject json = new JSONObject();
		json.put("json", map);
		return json;
	}

	/**
	 * 
	 * @Method : mapToJsonString
	 * @date : 2014. 5. 4.
	 * @author : IAMSKY
	 * @Desc : HashMap 을 JsonString 로 전환
	 * @param map
	 * @return
	 * @throws JSONException ----------------------------------
	 * @변경이력
	 *
	 */
	public static String mapToJsonString(HashMap<String, Object> map) {
		return mapToJsonObject(map).toString();
	}

	/**
	 * 
	 * @Method : jsonToMap
	 * @date : 2014. 5. 4.
	 * @author : IAMSKY
	 * @Desc : json 을 map으로 전환
	 * @param json
	 * @return ----------------------------------
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 * @변경이력
	 *
	 */
	@SuppressWarnings("unchecked")
	public static HashMap<String, Object> jsonToMap(JSONObject json) throws Exception {
		HashMap<String, Object> map = new HashMap<String, Object>();
		map = new ObjectMapper().readValue(json.toJSONString(), HashMap.class) ;
		return map;
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 12. 29.
	 * @description ja to list map
	 * @param ja
	 * @return
	 * @throws Exception 
	 *
	 */
	public static List<HashMap<String, Object>> jsonarrayToListMap(JSONArray ja) throws Exception {
		List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
		if( ja != null ){
	    	
			int jsonSize = ja.size();
	        for( int i = 0; i < jsonSize; i++ ){
	       		HashMap<String, Object> map = Convert.jsonToMap( ( JSONObject ) ja.get(i) );
	           	list.add( map );
	       }
		}		
		return list;
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @param o
	 * @return JSONObject
	 * @description 결과 데이타를 생성한다
	 *
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static JSONObject result(HttpServletRequest r, List o) {

		String page = Util.NVL(r.getParameter("page"), "1");
		String limit = Util.NVL(r.getParameter("limit"), "999999");
		String pageYN = Util.NVL(r.getParameter("PAGENAVIYN"), "N");
		String pagetotal = "1";
		List oo = o;

		if (pageYN.equalsIgnoreCase("Y")) {
			Long pt = Math.round(Math.ceil(o.size() / Double.parseDouble(limit)));
			pagetotal = pt.toString();
			int f = (Integer.parseInt(page) - 1) * Integer.parseInt(limit);
			int t = f + Integer.parseInt(limit);
			if (t > o.size())
				t = o.size();
			oo = o.subList(f, t);
		}

		JSONObject j = new JSONObject();
		j.put("rows", oo);
		j.put("records", oo == null ? 0 : oo.size());
		j.put("total", o == null ? 0 : o.size());
		j.put("limit", limit);
		j.put("page", page);
		j.put("pagetotal", pagetotal);
		return j;
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 3. 16.
	 * @description XGrid 를 위한 resultX 추가함 List 가 Vo 인 경우
	 * @param r
	 * @param o
	 * @return
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 *
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static JSONObject resultX(HttpServletRequest r, List o)
			throws IllegalArgumentException, IllegalAccessException {

		String page = Util.NVL(r.getParameter("page"), "1");
		String pageRowCnt = Util.NVL(r.getParameter("pageRowCnt"), "1000");
		String total = "0";
		String pagetotal = "0";
		List oo = o;
		JSONObject j = new JSONObject();

		if (o.size() != 0) {

			// --** 총합값을 구한다
			// --** row 0 에서 total 값을 읽는다.
			Class<?> c = o.get(0).getClass();
			do {
				for (Field f : c.getDeclaredFields()) {
					if (f.getName().equalsIgnoreCase("g2total")) {
						f.setAccessible(true);
						total = Util.NVL(f.get(o.get(0)), "");
						break;
					}
				}
			} while ((c = c.getSuperclass()) != null);

			pagetotal = Long.toString(Math.round(Math.ceil(Long.parseLong(total) / Double.parseDouble(pageRowCnt))));

		}

		j.put("rows", oo);
		j.put("total", total);
		j.put("page", page);
		j.put("pagetotal", pagetotal);

		return j;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 11. 4.
	 * @description XGrid2 의 인자가 HashMap 인 경우
	 * @param r
	 * @param o
	 * @return
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 *
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static JSONObject resultX2(HttpServletRequest r, List<Object> o)
			throws IllegalArgumentException, IllegalAccessException {

		String page = Util.NVL(r.getParameter("page"), "1");
		String pageRowCnt = Util.NVL(r.getParameter("pageRowCnt"), "1000");
		String total = "0";
		String pagetotal = "0";
		List oo = o;
		JSONObject j = new JSONObject();

		if (o.size() != 0) {

			// --** 총합값을 구한다
			// --** row 0 에서 total 값을 읽는다.
			HashMap result0 = (HashMap) o.get(0);
			total = Util.NVL(result0.get("g2total"), Util.NVL(result0.get("G2TOTAL"), "0"));
			pagetotal = Long.toString(Math.round(Math.ceil(Long.parseLong(total) / Double.parseDouble(pageRowCnt))));

		}

		j.put("rows", oo);
		j.put("total", total);
		j.put("page", page);
		j.put("pagetotal", pagetotal);

		return j;
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @param o
	 * @param t
	 * @return JSONObject
	 * @description 결과 데이타를 생성한다 mass 인경우 페이지 보이기는 적용되지 않는다
	 *
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static JSONObject result(HttpServletRequest r, List o, int t) {
		String page = Util.NVL(r.getParameter("page"), "1");
		String limit = Util.NVL(r.getParameter("limit"), "999999");
		// String pageYN = Util.NVL(r.getParameter("PAGENAVIYN"), "N");
		String pagetotal = "1";
		List oo = o;

		JSONObject j = new JSONObject();
		j.put("rows", oo);
		j.put("records", oo == null ? 0 : oo.size());
		j.put("total", o == null ? 0 : o.size());
		j.put("limit", limit);
		j.put("page", page);
		j.put("pagetotal", pagetotal);
		j.put("masstotal", t);
		return j;

	}

	/**
	 * 
	 * @date 2016. 11. 6.
	 * @param o
	 * @param v
	 * @return
	 * @throws Exception Hashtable<String,Object>
	 * @description 결과값을 HashMap 로 변환하여 전송
	 */
	public static HashMap<String, Object> paramdecode(Object o) throws Exception {
		HashMap<String, Object> h = new HashMap<String, Object>();
		Class<?> c = o.getClass();
		do {
			for (Field f : c.getDeclaredFields()) {
				f.setAccessible(true);
				if (f.get(o) == null)
					continue;
				h.put(f.getName(), ConvertToC(Convert.decode(Util.NVL(f.get(o), ""), "UTF-8"), false));

				// try{
				// } catch(Exception e){
				// h.put(f.getName(), Util.NVL(f.get(o), ""));
				// }
			}
		} while ((c = c.getSuperclass()) != null);
		return h;
	}

	/**
	 * 
	 * @author : "iamfreeguy-이상준"
	 * @date : 2018. 3. 17.
	 * @description HttpServletRequest에서 파라메터를 읽어서 HashMap 구성
	 * @param o
	 * @return
	 * @throws Exception
	 *
	 */
	public static HashMap<String, Object> paramdecode(HttpServletRequest r) throws Exception {
		HashMap<String, Object> h = new HashMap<String, Object>();
		Enumeration<String> pn = r.getParameterNames();
		String pname = "";
		String pval = "";
		String slisttype = "";
		while (pn.hasMoreElements()) {
			pname = pn.nextElement();
			pval = r.getParameter(pname);
			pval = ConvertToC(Convert.decode(Util.NVL(pval, ""), "UTF-8"), false);

			// --** list filter option 순서 맞아야 함
			pval = pval.replaceAll("ims_g2_greater-than-equal", ">=");
			pval = pval.replaceAll("ims_g2_less-than-equal", "<=");
			pval = pval.replaceAll("ims_g2_greater-than", ">");
			pval = pval.replaceAll("ims_g2_less-than", "<");

			if ("keycheck".equals(pname)) {
				pval = pval.replaceAll("##", "%");
				pval = pval.replaceAll("\\^\\^AMP\\^\\^", "&");
			}
			h.put(pname, pval);

			if ("G2_LIST_TYPE".equals(pname)) {
				slisttype = pval;
			}

		}

		//--**	초기값관련
		if (h.get("page") == null) {		h.put("page", "1");		}
		if (h.get("pageRowCnt") == null) {	h.put("pageRowCnt", "100000000");	}
		if (h.get("rowFirst") == null) {	h.put("rowFirst", "0");	}
		if (h.get("rowLast") == null) {		h.put("rowLast", "100000000");	}
		if (h.get("getdata") == null) {		h.put("getdata", "*");	}
		if (h.get("sort") == null) {		h.put("sort", "");		}
		if (h.get("filter") == null) {		h.put("filter", "");	}
		if (h.get("keycheck") == null) {	h.put("keycheck", "");	}
		
		// --** G2 그리드 리스트 타입이 있는 경우 처리
		if (!"".equals(slisttype)) {
			String[] lv = slisttype.split(",");
			for (String lvname : lv) {
				h.put(lvname + "list", Convert.mapToList(h, new String[] { lvname }));
			}

		}

		// --** hashmap 에 세션 default 값을 세팅
		setSessionDefaultId(h);

		return h;
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 3. 17.
	 * @description HashMap 정보에 request, session 정보 추가 HashMap 에 이미 있는 정보라면 skip 한다
	 * @param r
	 * @param h
	 * @return
	 * @throws Exception
	 *
	 */
	public static HashMap<String, Object> paramdecode(HttpServletRequest r, HashMap<String, Object> h)
			throws Exception {

		Enumeration<String> pn = r.getParameterNames();
		String pname = "";
		String pval = "";
		while (pn.hasMoreElements()) {
			pname = pn.nextElement();
			pval = r.getParameter(pname);
			pval = ConvertToC(Convert.decode(Util.NVL(pval, ""), "UTF-8"), false);
			if ("keycheck".equals(pname)) {
				pval = pval.replaceAll("##", "%");
			}
			// --** Map 에 이미 있는 정보라면 Skip
			if (h.get(pname) == null) {
				h.put(pname, pval);
			}
		}

		// --** hashmap 에 세션 default 값을 세팅
		setSessionDefaultId(h);
		return Convert.paramdecode(h);
	}

	/**
	 * 
	 * @date 2018. 07. 10.
	 * @param o
	 * @param v
	 * @return
	 * @throws Exception HashMap<String,Object>
	 * @description 결과값을 decode
	 */
	public static HashMap<String, Object> paramdecode(HashMap<String, Object> o) throws Exception {
		HashMap<String, Object> h = new HashMap<String, Object>();
		Set<String> keys = o.keySet();
		Iterator<String> itr = keys.iterator();
		String key = "";
		String pval = "";
		while (itr.hasNext()) {
			key = itr.next();
			pval = ConvertToC(Convert.decode(Util.NVL(o.get(key), ""), "UTF-8"), false);
			if ("keycheck".equals(key)) {
				pval = pval.replaceAll("##", "%");
			}
			h.put(key, pval);
		}

		// --** hashmap 에 세션 default 값을 세팅
		setSessionDefaultId(h);

		return h;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description JSON 형태의 메시지
	 * @param result
	 * @param msg
	 * @return
	 * @throws Exception
	 *
	 */
	public static JSONObject jsonMessage(String result, String msg) throws Exception {
		return jsonMessage(result, msg, false);
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 2.
	 * @description JSON 형태의 메시지 encode 체크
	 * @param result
	 * @param msg
	 * @param encodeYN
	 * @return
	 * @throws Exception
	 *
	 */
	@SuppressWarnings("unchecked")
	public static JSONObject jsonMessage(String result, String msg, boolean encodeYN) throws Exception {
		JSONObject j = new JSONObject();
		j.put("result", result);
		j.put("message", (encodeYN ? Convert.encode(msg, "UTF-8").replaceAll("[+]", " ") : msg));
		return j;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 9.
	 * @description map에 ,로 구분되어 입력된 정보를 split 하여 리스트로 생성함
	 * @param m
	 * @param keys
	 * @return
	 *
	 */
	public static List<HashMap<String, Object>> mapToList(HashMap<String, Object> m, String[] keys) {
		List<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();

		// --** 일부만 array 인 경우 존재함
		// --** 가장 큰 array에 맞추어 값들을 세팅
		String spt = ImsProperty.getInstance().getProperty("CONST.SEPERATOR");
		String[] sv = null;
		int ilen = -1;
		int imax = -1;
		String sval = "";
		for (String key : keys) {
			if (m.get(key) == null)
				continue;
			sval = (m.get(key).toString());
			ilen = sval.split(spt).length;
			if (imax < ilen) {
				sv = sval.split(spt);
				imax = ilen;
			}
		}
		if (sv != null && sv.length > 0) {
			for (int i = 0, j = sv.length; i < j; i += 1) {
				HashMap<String, Object> hm = new HashMap<String, Object>();
				for (String key : keys) {
					if (((m.get(key).toString()).indexOf(spt)) == -1) {
						hm.put(key, m.get(key).toString());
					} else {
						sval = m.get(key).toString();
						hm.put(key, ((sval.split(spt, imax))[i]).replace(spt, ""));
					}
				}
				result.add(i, hm);
			}
		}
		return result;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 9.
	 * @description 세션값을 parameter 값에 세팅 이미 맵에 정보가 있는 경우 Skip
	 * @param h
	 *
	 */
	private static void setSessionDefaultId(HashMap<String, Object> h) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		HttpSession session = request.getSession(false);
		if (session != null) {

			// --** 세션 attribute 세팅
			String sKey = "";
			Enumeration<String> ie = session.getAttributeNames();
			while (ie.hasMoreElements()) {
				sKey = ie.nextElement().toString();
				// --** 이미 맵에 정보가 있는 경우 Skip
				if (h.get(sKey) == null) {
					h.put(sKey, session.getAttribute(sKey));
				}
			}

			// --** 세션값을 읽어 default session_user_id 값을 세팅
			String session_user_id = ImsProperty.getInstance().getProperty("ST.USER.ID");
			String session_user_id_title = ImsProperty.getInstance().getProperty("ST.USER.ID.TITLE");
			h.put(session_user_id_title, session.getAttribute(session_user_id));
		}
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2020. 7. 15.
	 * @description
	 * 
	 * @param o
	 * @return
	 *
	 */
	public static String ConvertToC(Object o) {
		return Convert.ConvertToC(o, true);
	}

	/**
	 * 
	 * @date 2017. 9. 17.
	 * @param o
	 * @return
	 * @description 특수문자 처리 필요시 하기 추가 r = r.replaceAll("<", "&lt;"); r =
	 *              r.replaceAll(">", "&gt;"); 2019-11-07 2 byte 문자로 바꿈
	 */
	public static String ConvertToC(Object o, boolean c) {
		if (o == null) {
			return "";
		}

		String r = (String) o;
		r = r.replaceAll("(?!)script", "ｓcript");
		r = r.replaceAll("<", "〈");
		r = r.replaceAll(">", "〉");
		r = r.replaceAll("&", "＆");
		r = r.replaceAll("[$]20", " ");
		r = r.replaceAll("[$]2c", ",");
		if (c == true) {
			r = r.replace("\r", "^N^R^N^");
			r = r.replace("\n", "^N^N^N^");
		}
		return r;
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2020. 7. 9.
	 * @description javascript 에서 decodeURIComponent 쓰는 경우 다음하기 부분은 encode 안됨
	 *
	 * @param s
	 * @param t
	 * @return
	 * @throws Exception
	 *
	 */
	public static String decode(String s, String t) throws Exception {
		String r = URLDecoder.decode(s, t);

		r = r.replaceAll("%20", "+");
		r = r.replaceAll("%2A", "*");
		r = r.replaceAll("%2C", ",");
		r = r.replaceAll("%7E", "~");
		r = r.replace("^N^R^N^", "\r");
		r = r.replace("^N^N^N^", "\n");
		return r;
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2020. 7. 9.
	 * @description javascript 에서 encodeURIComponent 쓰는 경우 다음하기 부분은 encode 안됨
	 *
	 * @param s
	 * @param t
	 * @return
	 * @throws Exception
	 *
	 */
	public static String encode(String s, String t) throws Exception {
		String r = URLEncoder.encode(s, t);
		r = r.replaceAll("[+]", "%20");
		r = r.replaceAll("[*]", "%2A");
		r = r.replaceAll(",", "%2C");
		r = r.replaceAll("~", "%7E");
		r = r.replace("\r", "^N^R^N^");
		r = r.replace("\n", "^N^N^N^");
		return r;
	}

}
