package com.law.sys.controller;

import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.law.common.CommonUtils;
import com.law.common.Result;
import com.law.sys.entity.SysUser;
import com.law.sys.repository.SysUserRepository;


@Controller
public class SystemController {

	@Autowired
	private SysUserRepository sysUserRepository;

	/**
	 * 登录
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login()  {
		return "login";
	}

	/**
	 * 登录
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	public Result login(String username, String password,HttpSession session) {
		SysUser user = sysUserRepository.findByUsername(username);
		// 账号不存在
		if (user == null || StringUtils.isEmpty(user.getPassword()) || !user.getPassword().equalsIgnoreCase(password)) {
			return Result.error("用户名或者密码不正确");
		}
		session.setAttribute(CommonUtils.SESSION_USER, user);
		Result r = Result.ok();
		return r;
	}

	@RequestMapping(value = "/user", method = RequestMethod.GET)
	@ResponseBody
	public Result user(HttpSession session)  {
		Result r = Result.ok().put("user",CommonUtils.getUser(session));
		return r;
	}


	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String index()  {
		return "index";
	}

    /**
	 * 退出
     * @throws IOException
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Result logout(HttpSession session)  {
		CommonUtils.setUser(session, null);
		Result r = Result.ok();
		return r;
	}
}
