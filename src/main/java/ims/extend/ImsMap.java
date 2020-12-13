package ims.extend;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import ims.common.Util;

/**
 * 
 * @author 이상준
 * @version 1.0
 * @see IMS Map HashMap Extend
 * 
 */
public class ImsMap<K, V> extends HashMap<K, V> {

	private static final long serialVersionUID = 1L;

	public ImsMap() {
		super();
	}

	public ImsMap(Map<K, V> data) {
		super();
		Iterator<K> ie = data.keySet().iterator();
		while (ie.hasNext()) {
			K key = ie.next();
			this.put(key, data.get(key));
		}
	}

	/**
	 * JSON String data 를 HashMap List -> rows HashMap 로 구성한다.
	 * 
	 * @param jsonString
	 * @throws JSONException
	 */
	/*
	 * public ImsMap(String jsonString){
	 * 
	 * // JSONArray 인지 JSONObject 인지 구분한다. // 첫자가 [ 로 시작하면 JSONArray , { 로 시작하면
	 * JSONObject 임 String sJSON = Convert.decode(jsonString); // 클라이언트에서 특수문자 처리를
	 * 위해 encode한다.
	 * 
	 * // JSONArray if (sJSON.charAt(0) == '['){
	 * 
	 * List arrData = new ArrayList(); JSONArray rows = new JSONArray() ;
	 * rows.add(sJSON); for (int z = 0; z < rows.size(); z++) { JSONObject rowjson =
	 * rows.getJSONObject(z); HashMap<String,Object> rowmap = new
	 * HashMap<String,Object>(); for (int q = 0; q < rowjson.size(); q++) { Iterator
	 * itrows = rowjson.keys(); while (itrows.hasNext()) { String nn = (String)
	 * itrows.next(); rowmap.put(nn, rowjson.get(nn)); } } arrData.add(rowmap); }
	 * this.put((K) "rows", (V) arrData);
	 * 
	 * // JSONObject } else if (sJSON.charAt(0) == '{'){
	 * 
	 * JSONObject json = new JSONObject(); json = JSONObject.fromObject(jsonString);
	 * for (int i = 0; i < json.size(); i++) { Iterator it = json.keys(); while
	 * (it.hasNext()) { K n = (K) it.next(); if ("rows".equals((String) n)){ List
	 * arrData = new ArrayList(); JSONArray rows = json.getJSONArray((String) n) ;
	 * for (int z = 0; z < rows.size(); z++) { JSONObject rowjson =
	 * rows.getJSONObject(z); HashMap<String,Object> rowmap = new
	 * HashMap<String,Object>(); for (int q = 0; q < rowjson.size(); q++) { Iterator
	 * itrows = rowjson.keys(); while (itrows.hasNext()) { String nn = (String)
	 * itrows.next(); rowmap.put(nn, rowjson.get(nn)); } } arrData.add(rowmap); }
	 * this.put(n, (V) arrData); } else { this.put(n, (V)json.get((String) n)); } }
	 * }
	 * 
	 * } }
	 */

	/**
	 * NVL 추가
	 */
	@SuppressWarnings("unchecked")
	@Override
	public V get(Object paramObject) {
		return (V) Util.NVL(super.get(paramObject));
	}

	@SuppressWarnings("unchecked")
	public V get(Object paramObject, String cStr) {
		return (V) Util.NVL(super.get(paramObject), cStr);
	}

	/**
	 * 값을 비교한다.
	 * 
	 * @param paramObject
	 * @param chkStr
	 * @return
	 */
	public boolean chk(Object paramObject, String chkStr) {
		String str = (String) Util.NVL(super.get(paramObject));
		return chkStr.equals(str);
	}

	/**
	 * 값을 String 으로 반환한다
	 * 
	 * @param paramObject
	 * @return
	 */
	public String getStr(Object paramObject) {
		return (String) Util.NVL(super.get(paramObject));
	}

	/**
	 * 값을 integer 로 반환한다
	 * 
	 * @param paramObject
	 * @return
	 */
	public int getInt(Object paramObject) {
		return Integer.parseInt(Util.NVL(super.get(paramObject)).toString());
	}

}
