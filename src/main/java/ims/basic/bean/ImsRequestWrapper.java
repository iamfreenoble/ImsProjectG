package ims.basic.bean;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.IOUtils;

import ims.common.Convert;

/**
 * 
 * @author : LiSangJun
 * @description 크로스 스크립트 처리를 위한 wrapper class
 *
 */
public class ImsRequestWrapper extends HttpServletRequestWrapper {

	private byte[] requestBody = new byte[0];
	private boolean bufferFilled = false;
	private final String encoding;

	/**
	 * 
	 * @author : LiSangJun
	 * @enclosing_type : ImsRequestWrapper
	 * @description constructor
	 * @param request
	 *
	 */
	public ImsRequestWrapper(HttpServletRequest request) {
		super(request);
		String characterEncoding = ImsProperty.getInstance().getProperty("CHARACTER.TYPE"); // request.getCharacterEncoding();
		if (characterEncoding == null || "".equals(characterEncoding)) {
			this.encoding = null;
		} else {
			this.encoding = characterEncoding;
		}
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 11. 7.
	 * @description json 인경우 InputString 을 fi;tering
	 * @return
	 * @throws IOException
	 *
	 */
	public byte[] getRequestBody() throws IOException {
		if (bufferFilled) {
			return Arrays.copyOf(requestBody, requestBody.length);
		}

		InputStream inputStream = super.getInputStream();

		// --** XSS 변경
		StringBuffer buffer = new StringBuffer();
		byte[] b = new byte[1024 * 1024];
		int i;
		while ((i = inputStream.read(b)) != -1) {
			buffer.append(new String(b, 0, i));
		}
		String str = cleanXSS("", buffer.toString());

		InputStream fis = new ByteArrayInputStream(str.getBytes());

		this.requestBody = IOUtils.toByteArray(fis);
		bufferFilled = true;
		return requestBody;
	}

	@Override
	public ServletInputStream getInputStream() throws IOException {
		return new ImsServletInputStream(getRequestBody());
	}

	class ImsServletInputStream extends ServletInputStream {

		private ByteArrayInputStream buffer;

		public ImsServletInputStream(byte[] contents) {
			this.buffer = new ByteArrayInputStream(contents);
		}

		@Override
		public int read() throws IOException {
			return buffer.read();
		}

		@Override
		public boolean isFinished() {
			return buffer.available() == 0;
		}

		@Override
		public boolean isReady() {
			return true;
		}

		@Override
		public void setReadListener(ReadListener listener) {
			throw new RuntimeException("Not implemented");
		}
	}

	@Override
	public BufferedReader getReader() throws IOException {
		return new BufferedReader(new InputStreamReader(this.getInputStream(), this.encoding));
	}

	@Override
	public ServletRequest getRequest() {
		return super.getRequest();
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @description
	 * 
	 * @see javax.servlet.ServletRequestWrapper#getParameterValues(String)
	 *
	 */
	@Override
	public String[] getParameterValues(String parameter) {
		String[] values = super.getParameterValues(parameter);
		if (values == null) {
			return null;
		}
		int count = values.length;
		String[] encodedValues = new String[count];
		for (int i = 0; i < count; i++) {
			encodedValues[i] = cleanXSS("param01", values[i]);
		}
		return encodedValues;
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @description
	 * 
	 * @see javax.servlet.ServletRequestWrapper#getParameter(String)
	 *
	 */
	@Override
	public String getParameter(String parameter) {
		String value = super.getParameter(parameter);
		if (value == null) {
			return null;
		}
		return cleanXSS("param_02", value);
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @description
	 * 
	 * @see javax.servlet.ServletRequestWrapper#getParameterMap()
	 *
	 */
	@Override
	public Map<String, String[]> getParameterMap() {
		Map<String, String[]> map = new HashMap<String, String[]>(super.getParameterMap());
		for (String k : map.keySet()) {
			String[] v = map.get(k);
			int count = v.length;
			String[] encodedValues = new String[count];
			for (int i = 0; i < count; i++) {
				encodedValues[i] = cleanXSS(k, v[i]);
			}
			map.put(k, encodedValues);
		}
		return map;
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 11. 10.
	 * @description Xss script 변환
	 * @param name
	 * @param value
	 * @return
	 *
	 */
	private String cleanXSS(String name, String value) {
		// --** decode 메시지 converter로 인해 decode 된 이후 임
		// String r = decode(value);
		System.out.println("XSS name, value --> [[" + name + "]]-[[" + value + "]]");
		return Convert.ConvertToC(value, false);
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2020. 7. 15.
	 * @description decode 처리
	 * @param s
	 * @return
	 *
	 */
	/*
	 * private String decode(String s) { String r = ""; if (this.encoding != null) {
	 * try { r = Convert.decode(s, this.encoding); } catch (Exception e) { } } else
	 * { r = s; } return r; }
	 */

}
