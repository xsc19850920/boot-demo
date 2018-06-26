package com.law.sys.repository;

import org.springframework.data.repository.Repository;

import com.law.sys.entity.SysUser;

public interface SysUserRepository extends Repository<SysUser, Long> {

	public SysUser findByUsername(String username);

}
