/**
 * 
 */
package ims.component.socket;

import javax.servlet.http.HttpServletRequest;

/**
 * @author iamfreeguy
 * @date 2017. 1. 30.
 * @type_name WebSocketUser
 * @description
 *
 */
public interface WebSocketUser {

	/**
	 * 
	 * @date 2017. 1. 30.
	 * @return Object
	 * @description 사용자 정보를 읽는다
	 */
	public Object getWebSocketUserList(HttpServletRequest request);

}
