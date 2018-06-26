package com.law.category.repository;

import org.springframework.data.repository.Repository;

import com.law.sys.entity.SysUser;

public interface CategoryRepository extends Repository<SysUser, Long> {

	public SysUser findByUsername(String username);

}
