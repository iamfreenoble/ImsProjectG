package ims.security.encrypt;

import ims.basic.bean.ImsProperty;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * 
 * @author : iamfreeguy-이상준
 * @description AES 을 사용한 암호화 복호화 출처:
 *              https://www.javacodegeeks.com/2018/03/aes-encryption-and-decryption-in-javacbc-mode.html
 */
public class Aes {

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description 암호화
	 * @param msg
	 * @return
	 * @throws Exception
	 *
	 */
	public static String encrypt(String msg) throws Exception {

		// --** ImsProperty 에서 key 값을 가져온다
		String key = ImsProperty.getInstance().getProperty("AES.key").substring(4, 20);
		String vec = ImsProperty.getInstance().getProperty("AES.vec").substring(7, 23);

		try {
			IvParameterSpec iv = new IvParameterSpec(vec.getBytes("UTF-8"));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
			byte[] encrypted = cipher.doFinal(msg.getBytes());
			return Base64.getEncoder().encodeToString(encrypted);

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}

	/**
	 * 
	 * @author : iamfreeguy-이상준
	 * @date : 2018. 12. 1.
	 * @description 복호화
	 * @param msg
	 * @return
	 * @throws Exception
	 *
	 */
	public static String decrypt(String msg) throws Exception {

		// --** ImsProperty 에서 key 값을 가져온다
		String key = ImsProperty.getInstance().getProperty("AES.key").substring(4, 20);
		String vec = ImsProperty.getInstance().getProperty("AES.vec").substring(7, 23);

		try {
			IvParameterSpec iv = new IvParameterSpec(vec.getBytes("UTF-8"));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
			byte[] original = cipher.doFinal(Base64.getDecoder().decode(msg));
			return new String(original);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;

	}

}
