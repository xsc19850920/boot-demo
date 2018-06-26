package com.law.modules.sys.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.law.common.Result;
import com.law.common.ThreadUser;
import com.law.modules.sys.entity.SysUser;
import com.law.modules.sys.repository.SysUserRepository;


@Controller
public class SystemController {

	@Autowired
	private SysUserRepository sysUserRepository;

	/**
	 * 登录
	 */
	@RequestMapping(value = "/sys/login", method = RequestMethod.GET)
	public String login()  {
		return "login";
	}

	/**
	 * 登录
	 */
	@RequestMapping(value = "/sys/login", method = RequestMethod.POST)
	@ResponseBody
	public Result login(String username, String password) {
		SysUser user = sysUserRepository.findByUsername(username);
		// 账号不存在
		if (user == null || StringUtils.isEmpty(user.getPassword()) || !user.getPassword().equalsIgnoreCase(password)) {
			return Result.error("用户名或者密码不正确");
		}
		ThreadUser.setSysUser(user);
		Result r = Result.ok();
		return r;
	}

	@RequestMapping(value = "/sys/user", method = RequestMethod.GET)
	@ResponseBody
	public Result user()  {
		Result r = Result.ok().put("user",ThreadUser.getSysUser());
		return r;
	}

    /**
	 * 退出
     * @throws IOException
	 */
	@RequestMapping(value = "/sys/logout", method = RequestMethod.GET)
	public void logout(HttpServletResponse response) throws IOException {
		ThreadUser.setSysUser(null);
	}


}
