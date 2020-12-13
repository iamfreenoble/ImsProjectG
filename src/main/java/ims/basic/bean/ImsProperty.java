package ims.basic.bean;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

/**
 * 
 * @author iamfreeguy
 * @date 2016. 12. 25.
 * @type_name ImsProperty
 * @description property Map
 * 				gradle 인 경우와
 * 				spring 인 경우 틀림
 */
public class ImsProperty {

	private Environment env;

	/**
	 * Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(ImsProperty.class);

	/**
	 * 싱글톤 처리
	 */
//	private volatile static ImsProperty instance; 
//	private static Properties p;

	private ImsProperty() {
	}

	/**
	 * 
	 * @date 2017. 9. 17.
	 * @return
	 * @description LazyHolder 방식으로 변경
	 */
	public static ImsProperty getInstance() {
		return LazyHolder.INSTANCE;
	}

	public static class LazyHolder {
		private static final ImsProperty INSTANCE = new ImsProperty();
		private static final Properties INSTANCEP = new Properties();
	}

	/*
	 * public static synchronized ImsProperty getInstance(){ if (instance == null){
	 * instance = new ImsProperty(); p = new Properties(); } return instance; }
	 */

	/**
	 * 
	 * @throws Exception
	 * @date 2016. 12. 25. void
	 * @description property 를 load 한다.
	 */
	public void load(Environment env) {
		this.env = env;
	}

	/**
	 *
	 * @throws Exception
	 * @date 2016. 12. 25. void
	 * @description property 를 load 한다.
	 */
	public void load() {

		InputStream is = null;
		InputStreamReader ir = null;
		try {
			is = getClass().getResourceAsStream("/ims/custom/ims." + System.getProperty("imsLocation") + ".property");
			ir = new InputStreamReader(is, "UTF-8");
			LazyHolder.INSTANCEP.load(ir);
			logger.info("PROPERTY LOAD OK GUBUN", LazyHolder.INSTANCEP.getProperty("GUBUN"));
			env	=	null;

		} catch (IOException e) {
			logger.info("PROPERTY LOAD ERROR", e.getMessage());
		}
	}

	/**
	 * 
	 * @date 2016. 12. 26.
	 * @param k
	 * @return String
	 * @description poperty get
	 */
	public String getProperty(String k) {
		return env == null ? LazyHolder.INSTANCEP.getProperty(k) : env.getProperty(k);
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2020. 1. 8.
	 * @description property set
	 * @param k
	 * @param v
	 *
	 */
	public void setProperty(String k, String v) {
		if (env == null){
			LazyHolder.INSTANCEP.setProperty(k, v) ;
		}
	}

}
