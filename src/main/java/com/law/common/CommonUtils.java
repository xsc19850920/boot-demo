package com.law.common;

import javax.servlet.http.HttpSession;

import com.law.sys.entity.UserAdmin;

public class CommonUtils {
	public static final String SESSION_USER = "SESSION_USER";
	public static final String PAGE = "0";
	public static final String LIMIT = "10";

	public static UserAdmin getUser(HttpSession session){
		Object tempObj = session.getAttribute(CommonUtils.SESSION_USER);
		if((null != tempObj) && (tempObj instanceof UserAdmin) ){
			return  (UserAdmin)tempObj;
		}
		return null;
	}

	public static void setUser(HttpSession session,UserAdmin user){
		session.setAttribute(CommonUtils.SESSION_USER,user);
	}
}
