package ims.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * 
 * @Type : IOBuffer
 * @Date : 2014. 10. 30.
 * @Author : iamsky
 * @Desc : 대용량 정보를 담을 임시 버퍼 싱글톤 --------------------------------------
 * @변경이력
 *
 */
public class IOBuffer {

	private static IOBuffer instance;
	private static HashMap<String, ArrayList<Object>> hmap;
	private static HashMap<String, Integer> hcmap;
	private static HashMap<String, Thread> htmap;

	private IOBuffer() {
	}

	/**
	 * 
	 * @Method : getInstance
	 * @date : 2014. 10. 30.
	 * @author : iamsky
	 * @Desc : 인스턴스 처리
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public static IOBuffer getInstance() {
		if (instance == null) {
			instance = new IOBuffer();
			hmap = new HashMap<String, ArrayList<Object>>();
			hcmap = new HashMap<String, Integer>();
			htmap = new HashMap<String, Thread>();
		}
		return instance;
	}

	/**
	 * 
	 * @Method : setThreadMap
	 * @date : 2014. 11. 15.
	 * @author : iamsky
	 * @Desc : Thread 등록
	 * @param key
	 * @param t   ----------------------------------
	 * @변경이력
	 *
	 */
	public synchronized void setThreadMap(String key, Thread t) {
		htmap.put(key, t);
	}

	/**
	 * 
	 * @Method : getThreadMap
	 * @date : 2014. 11. 15.
	 * @author : iamsky
	 * @Desc : Thread return
	 * @param key
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public synchronized Thread getThreadMap(String key) {
		return htmap.get(key);
	}

	/**
	 * 
	 * @Method : stopThreadMap
	 * @date : 2014. 11. 15.
	 * @author : iamsky
	 * @Desc : Thread를 stop 하고 맵에서 삭제한다.
	 * @param key ----------------------------------
	 * @변경이력
	 *
	 */
	@SuppressWarnings("deprecation")
	public synchronized void stopThreadMap(String key) {
		try {
			htmap.get(key).stop();
		} catch (Exception e) {
		}
		htmap.put(key, null);
	}

	/**
	 * 
	 * @Method : setMap
	 * @date : 2014. 10. 30.
	 * @author : iamsky
	 * @Desc : 버퍼에 정보를 담는다.
	 * @param key
	 * @param value ----------------------------------
	 * @변경이력
	 *
	 */
	public synchronized void setMap(String key, Object value, int t) {
		ArrayList<Object> al = hmap.get(key);
		if (al == null)
			al = new ArrayList<Object>();
		al.add(value);
		hmap.put(key, al);
		hcmap.put(key, t);
	}

	/**
	 * 
	 * @Method : getObject
	 * @date : 2014. 10. 30.
	 * @author : iamsky
	 * @Desc : limit 만큼 값을 반환하고 버퍼를 지운다.
	 * @param key
	 * @param limit
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public synchronized List<Object> getObject(String key, int limit) {
		ArrayList<Object> al = hmap.get(key);
		if (al == null || al.size() == 0)
			return null;
		int c = (al.size() > limit ? limit : al.size());
		List<Object> ra = new ArrayList<Object>();// al.subList(0,c);
		for (int i = c - 1; i > -1; i--) {
			ra.add(al.get(i));
			al.remove(i);
		}
		return ra;
	}

	/**
	 * 
	 * @Method : getTotal
	 * @date : 2014. 11. 3.
	 * @author : iamsky
	 * @Desc : 총 토탈 갯수를 반환한다.
	 * @param key
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public synchronized Integer getTotal(String key) {
		return Util.isNull(hcmap.get(key)) ? 0 : hcmap.get(key);
	}

	/**
	 * 
	 * @Method : size
	 * @date : 2014. 11. 1.
	 * @author : iamsky
	 * @Desc : 크기 반환
	 * @param key
	 * @return ----------------------------------
	 * @변경이력
	 *
	 */
	public int size(String key) {
		ArrayList<Object> a = hmap.get(key);
		return a == null ? 0 : a.size();
	}

}
