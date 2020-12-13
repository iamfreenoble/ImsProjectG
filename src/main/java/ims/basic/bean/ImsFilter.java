package ims.basic.bean;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.CharacterEncodingFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 
 * @author : LiSangJun
 * @description 크로스 사이트 스크립트등을 처리하기 위한 filter
 *
 */
@Order(Ordered.LOWEST_PRECEDENCE -1)
@Component
public class ImsFilter extends CharacterEncodingFilter {

	/**
	 * 
	 * @author : LiSangJun
	 * @description
	 * 
	 * @see org.springframework.web.filter.OncePerRequestFilter#doFilterInternal(HttpServletRequest,
	 *      HttpServletResponse, FilterChain)
	 *
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// --** ImsFilter 사용을 위한 꼭 필요 아니면 한글이 깨짐
		request.setCharacterEncoding(ImsProperty.getInstance().getProperty("CHARACTER.TYPE"));

		if (request.getMethod().equals("GET") || request.getMethod().equals("POST")) {
			filterChain.doFilter(new ImsRequestWrapper(request), response);
		} else {
			filterChain.doFilter(request, response);
		}

	}
}
