package com.law.common;

import javax.servlet.http.HttpSession;

import com.law.sys.entity.SysUser;

public class CommonUtils {
	public static final String SESSION_USER = "SESSION_USER";
	public static final String PAGE = "0";
	public static final String LIMIT = "10";

	public static SysUser getUser(HttpSession session){
		Object tempObj = session.getAttribute(CommonUtils.SESSION_USER);
		if((null != tempObj) && (tempObj instanceof SysUser) ){
			return  (SysUser)tempObj;
		}
		return null;
	}

	public static void setUser(HttpSession session,SysUser user){
		session.setAttribute(CommonUtils.SESSION_USER,user);
	}
}
