package com.law.common;

import java.io.IOException;

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

import com.law.sys.entity.SysUser;

@WebFilter(urlPatterns = "/*", filterName = "loginFilter")
public class LoginFilter implements Filter {
	private static final String IGNORE_FILTER_PATH = "/sys/login";

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpSession session = request.getSession();
		String queryUrl = request.getQueryString() == null ? "" : ("?" + request.getQueryString());// 获取参数
		String requestUrl = request.getServletPath() + queryUrl;// httpRequest.getServletPath(),获取链接

		SysUser sysUser = CommonUtils.getUser(session);
		if (sysUser == null) {
			if (IGNORE_FILTER_PATH.equalsIgnoreCase(requestUrl)) {
				filterChain.doFilter(servletRequest, servletResponse);
			} else {
				HttpServletResponse response = (HttpServletResponse) servletResponse;
				response.sendRedirect("/sys/login");
			}

		} else {
			filterChain.doFilter(servletRequest, servletResponse);
		}
	}

	@Override
	public void destroy() {

	}
}
