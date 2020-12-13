package ims.common;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 25.
 * @type_name Log
 * @description Log 처리
 */
public class Log {

	private static String sformat = "<<IMS LOG>>[%1$s][%2$s][%3$s]==>%4$s";
	private static String serror = "<<IMS ERROR>>[%1$s][%2$s][%3$s]==>%4$s";

	/**
	 * 
	 * @date 2016. 12. 25.
	 * @param l void
	 * @description log write
	 */
	public static void log(String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(sformat, datef.format(now), "", "", l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 25.
	 * @param t
	 * @param l void
	 * @description
	 *
	 */
	public static void log(String t, String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(sformat, datef.format(now), t, "", l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param t
	 * @param m
	 * @param l void
	 * @description
	 *
	 */
	public static void log(String t, String m, String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(sformat, datef.format(now), t, m, l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param l void
	 * @description
	 *
	 */
	public static void error(String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(serror, datef.format(now), "", "", l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param t
	 * @param l void
	 * @description
	 *
	 */
	public static void error(String t, String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(serror, datef.format(now), t, "", l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param t
	 * @param m
	 * @param l void
	 * @description
	 *
	 */
	public static void error(String t, String m, String l) {
		Date now = new Date();
		SimpleDateFormat datef = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ll = String.format(serror, datef.format(now), t, m, l);
		System.out.println(ll);
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param l void
	 * @description
	 *
	 */
	public static void log(Object l) {
		log(String.valueOf(l));
	}

	/**
	 * 
	 * @date 2016. 12. 25.
	 * @param t
	 * @param l void
	 * @description
	 *
	 */
	public static void log(String t, Object l) {
		log(t, String.valueOf(l));
	}

	/**
	 * 
	 * @date 2016. 12. 31.
	 * @param t
	 * @param m
	 * @param l void
	 * @description
	 *
	 */
	public static void log(String t, String m, Object l) {
		log(t, m, String.valueOf(l));
	}

}
