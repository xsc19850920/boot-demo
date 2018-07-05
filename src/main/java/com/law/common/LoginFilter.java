package com.law.common;

import java.io.IOException;
import java.util.stream.Stream;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.law.sys.entity.UserAdmin;

@WebFilter(urlPatterns = "/*", filterName = "loginFilter")
public class LoginFilter implements Filter {
	private static final String[] IGNORE_FILTER_PATHS = {"/login","/css","/js","/plugins","/libs","/fonts"};

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpSession session = request.getSession();
		String queryUrl = request.getQueryString() == null ? "" : ("?" + request.getQueryString());// 获取参数
		String requestUrl = request.getServletPath() + queryUrl;// httpRequest.getServletPath(),获取链接

		UserAdmin sysUser = CommonUtils.getUser(session);
		if (sysUser == null) {
			if (Stream.of(IGNORE_FILTER_PATHS).anyMatch(s->requestUrl.startsWith(s))) {
				filterChain.doFilter(servletRequest, servletResponse);
			} else {
				HttpServletResponse response = (HttpServletResponse) servletResponse;
				response.sendRedirect("/login");
			}

		} else {
			filterChain.doFilter(servletRequest, servletResponse);
		}
	}

	@Override
	public void destroy() {

	}
}
