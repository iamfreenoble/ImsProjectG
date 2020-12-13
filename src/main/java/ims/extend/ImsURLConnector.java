package ims.extend;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.HashMap;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import ims.common.ContextUtil;

/**
 * 
 *	@author	:	LiSangJun
 *	@description
 *				URL Connector  처리
 *				IMS Excel 처리	2020-12-02
 *
 */
public class ImsURLConnector {
	
	
	private String charset;
	private String contentType;
	private String url;
	private boolean useCache;
	private boolean encode;
	private HttpURLConnection conn;
	private HttpsURLConnection conn2;
	private String param;
	private String returnType;
	private String sessionCookie;
	
	public ImsURLConnector() {
		super();
		setEnv();
	}

	/**
	 * 
	 * 	@author	:	LiSangJun
	 *	@date	:	2020. 12. 2.
	 * 	@description 
	 *				환경 변수 설정
	 *
	 */
	private void setEnv() {
		this.url 		= 	null;
		this.useCache	=	false;
		this.encode 	= 	true;		
		this.conn 		= 	null;
		this.conn2 		= 	null;
		this.param 		= 	null;
		this.charset		=	this.charset == null ? "utf-8" : this.charset;	
		this.contentType	=	this.contentType == null ? "application/x-www-form-urlencoded;" : this.contentType;
		this.returnType		=	this.returnType == null ? "json" : this.returnType;
		this.sessionCookie	=	ContextUtil.getSession(false).getId();
	}
	
	/**
	 * 
	 * 	@author	:	LiSangJun
	 *	@date	:	2020. 12. 2.
	 * 	@description 
	 *				connector open
	 * 	@return
	 * @throws Exception 
	 *
	 */
	public void open() throws Exception {
		if (this.url == null) {
			throw new Exception("url is not defined.......");
		}
		
		URL url = new URL(this.url);
		
		if (this.url.toLowerCase().indexOf("https") == 0) {
			
			TrustManager[] trustAllCerts = new TrustManager[] { 
					new X509TrustManager() {

						public X509Certificate[] getAcceptedIssuers() {
							return null;
						}
						public void checkClientTrusted(X509Certificate[] certs, String authType) {
						}
						public void checkServerTrusted(X509Certificate[] certs, String authType) {
						}
					} 
			};

			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
			this.conn2 = (HttpsURLConnection) url.openConnection();
			this.conn2.setDoOutput(true);
			this.conn2.setUseCaches(this.useCache);
			this.conn2.setRequestProperty("Content-Type", this.contentType + "charset=" + this.charset);
			this.conn2.setRequestProperty("Cookie", this.sessionCookie);
			
		} else {
			
			this.conn = (HttpURLConnection)url.openConnection();
			this.conn.setDoOutput(true);
			this.conn.setUseCaches(this.useCache);
			this.conn.setRequestProperty("Content-Type", this.contentType + "charset=" + this.charset);
			this.conn.setRequestProperty("Cookie", this.sessionCookie);
		}
		
	}
	
	
	/**
	 * 
	 * 	@author	:	LiSangJun
	 *	@date	:	2020. 12. 2.
	 * 	@description 
	 *				실행
	 * 	@param hm
	 * 	@return
	 * 	@throws Exception
	 *
	 */
	public Object run(HashMap<String, String> hm) throws Exception {
		
		String sval	=	"";
		this.param	=	"";
		for (String key : hm.keySet()) {
			sval	=	(String)hm.get(key);
			sval	=	this.encode ? URLEncoder.encode(sval, this.charset) : sval; 	
			this.param	+=	("".equals(this.param) ? "" : "&")  
						+	key	+	"="	+	sval; 	
		}
		
		//--**	output
		DataOutputStream out = new DataOutputStream((this.conn == null ? this.conn2.getOutputStream() : this.conn.getOutputStream()));
		out.writeBytes(this.param);
		out.flush();
		
		//--**	input
		InputStream is = this.conn == null ? this.conn2.getInputStream() : this.conn.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(is, this.charset));

        //--**	data 처리
		String temp = null;
        StringBuilder sb = new StringBuilder();

        if((temp = br.readLine()) != null){
            sb.append(temp).append(" ");
        }

        if(br !=null) {
        	br.close();
        }
        if(out !=null) {
			out.close();
		}
		if(is !=null) {
			is.close();
		}        
        
        String sresult = sb.toString().trim().replace("%", "%25");
        sresult	=	this.encode ? URLDecoder.decode(sresult, this.charset) : sresult;
        
		if ("json".equals(this.returnType)) {

			JSONParser jparser = new JSONParser();
			JSONObject jsonResult	= (JSONObject)jparser.parse(sresult);
			return jsonResult;
			
		} else {
			
			return sresult;
		}
		
	}
	
	
	/**
	 * 
	 * 	@author	:	LiSangJun
	 *	@date	:	2020. 12. 2.
	 * 	@description 
	 *				connector close
	 *
	 */
	public void close() {
		
		if (this.conn != null) {
			this.conn.disconnect();
			this.conn = null;
		}

		if (this.conn2 != null) {
			this.conn2.disconnect();
			this.conn2 = null;
		}
		
	}
	
	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isUseCache() {
		return useCache;
	}

	public void setUseCache(boolean useCache) {
		this.useCache = useCache;
	}

	public boolean isEncode() {
		return encode;
	}

	public void setEncode(boolean encode) {
		this.encode = encode;
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}

	public String getReturnType() {
		return returnType;
	}

	public void setReturnType(String returnType) {
		this.returnType = returnType;
	}

	public HttpURLConnection getConn() {
		return conn;
	}

	public void setConn(HttpURLConnection conn) {
		this.conn = conn;
	}

	public HttpsURLConnection getConn2() {
		return conn2;
	}

	public void setConn2(HttpsURLConnection conn2) {
		this.conn2 = conn2;
	}

	public String getSessionCookie() {
		return sessionCookie;
	}

	public void setSessionCookie(String sessionCookie) {
		this.sessionCookie = sessionCookie;
	}
	
}
