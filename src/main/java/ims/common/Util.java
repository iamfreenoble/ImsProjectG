package ims.common;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 
 * @author 이상준
 * @version 1.0
 * @see IMS Tag Common Class
 * 
 */
public class Util {

	/**
	 * Null 인 경우 ""
	 * 
	 * @param obj
	 * @return
	 */
	public static Object NVL(Object obj) {
		return obj == null ? "" : obj;
	}

	/**
	 * Null 인 경우 ""
	 * 
	 * @param obj
	 * @return
	 */
	public static String NVL(int obj) {
		return Integer.toString(obj);
	}

	/**
	 * Null 인경우 sObj
	 * 
	 * @param obj
	 * @param sObj
	 * @return
	 */
	public static String NVL(Object obj, String sObj) {
		return obj == null ? sObj : String.valueOf(obj);
	}

	/**
	 * Null 인경우 cObj
	 * 
	 * @param obj
	 * @param cObj
	 * @return
	 */
	public static Object NVL(Object obj, Object cObj) {
		return obj == null ? cObj : obj;
	}

	/**
	 * Null Check
	 * 
	 * @param obj
	 * @return
	 */
	public static Boolean isNull(Object obj) {
		return obj == null || String.valueOf(obj).isEmpty();
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 5. 21.
	 * @description Null or Empty return
	 * @param obj
	 * @param sobj
	 * @return
	 *
	 */
	public static String nullOrEmpty(Object obj, String sobj) {
		return (obj == null || String.valueOf(obj).isEmpty() ? sobj : String.valueOf(obj));
	}

	/**
	 * 
	 * =================================================
	 * 
	 * @메소드명 : decodePuid
	 * @작성자 : G122044
	 * @작성일 : 2015. 1. 27.
	 * @param obj
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws :
	 * @설명 : ==================================================
	 * @수정이력 : 수정일, 수정자, 수정내용 의 3가지 항목으로 나열하여 적는다.
	 */
	public static String decodePuid(Object obj) throws Exception {
		return Convert.decode(Util.NVL(obj, ""), "UTF-8").replace("%24", "$");
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @param request
	 * @return String
	 * @description 로케일 정보 읽어오기
	 *
	 */
	public static String getLocale(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		return session == null ? "ko" : Util.NVL(session.getAttribute("locale"), "ko");
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @param request
	 * @return String
	 * @description Client IP 읽어오기
	 *
	 */
	public static String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("확인 X-FORWARDED-FOR");
		if (ip == null || ip.length() == 0) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0) {
			ip = request.getHeader("WL-Proxy-Client-IP"); // 웹로직
		}
		if (ip == null || ip.length() == 0) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @return String
	 * @description 만약 공인 IP없으면 내부 IP 가져오도록 처리
	 */
	public static String getCurrentEnvironmentNetworkIp() {
		Enumeration<NetworkInterface> netInterfaces = null;

		try {
			netInterfaces = NetworkInterface.getNetworkInterfaces();
		} catch (SocketException e) {
			return getLocalIp();
		}
		while (netInterfaces.hasMoreElements()) {
			NetworkInterface ni = (NetworkInterface) netInterfaces.nextElement();
			Enumeration<InetAddress> address = ni.getInetAddresses();
			if (address == null) {
				return getLocalIp();
			}
			while (address.hasMoreElements()) {
				InetAddress addr = (InetAddress) address.nextElement();

				if (!addr.isLoopbackAddress() && !addr.isSiteLocalAddress() && !addr.isAnyLocalAddress()) {
					String ip = addr.getHostAddress();

					if (ip.indexOf(".") != -1 && ip.indexOf(":") == -1) {
						return ip;
					}
				}
			}
		}
		return getLocalIp();
	}

	/**
	 * 
	 * @date 2016. 10. 15.
	 * @return String
	 * @description 로컬 아이피 읽어오기
	 *
	 */
	public static String getLocalIp() {
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (Exception e) {
			return null;
		}
	}

}
