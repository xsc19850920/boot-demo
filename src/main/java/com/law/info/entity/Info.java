package com.law.info.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="law_user")
public class Info {
	@Id
	@GeneratedValue
	private long id;

	private String username;

	private String password;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}





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

}
