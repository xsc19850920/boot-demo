package com.law.sys.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="user_admin")
public class UserAdmin {
	@Id
	@GeneratedValue
	@Column(name="user_admin_id")
	private long userAdminId;
	@Column(name="user_name")
	private String username;

	private String password;


	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public long getUserAdminId() {
		return userAdminId;
	}

	public void setUserAdminId(long userAdminId) {
		this.userAdminId = userAdminId;
	}



}
