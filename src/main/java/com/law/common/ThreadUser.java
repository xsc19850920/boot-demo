package com.law.common;

import com.law.modules.sys.entity.SysUser;

public class ThreadUser {
	private static ThreadLocal<SysUser> threadUser = new ThreadLocal<SysUser>();

	public static void  setSysUser(SysUser user){
		threadUser.set(user);
	}

	public static SysUser  getSysUser(){
		return threadUser.get();
	}
}
