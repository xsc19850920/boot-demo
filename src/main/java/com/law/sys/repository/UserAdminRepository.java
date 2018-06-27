package com.law.sys.repository;

import org.springframework.data.repository.Repository;

import com.law.sys.entity.UserAdmin;

public interface UserAdminRepository extends Repository<UserAdmin, Long> {

	public UserAdmin findByUsername(String username);

}
