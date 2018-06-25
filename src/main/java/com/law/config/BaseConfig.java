package com.law.config;

import java.util.HashMap;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;

@Configuration
@EnableCaching
public class BaseConfig {
	private static final String DRUID_ALLOW = "127.0.0.1";
	private static final String DRUID_EXCLUSIONS = "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*";
	@Bean
	public ServletRegistrationBean druidServlet(/*@Value("${druid.allow}") String allow*/) {
		ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
		
		//设置数据库连接池只能本级访问提升安全性
		//http://localhost:8080/druid/index.html
		HashMap<String, String> initParameters = new HashMap<String,String>();
		initParameters.put("allow", DRUID_ALLOW);
		bean.setInitParameters(initParameters);
		return bean;
	}
	@Bean
	public FilterRegistrationBean filterRegistrationBean(/*@Value("${druid.exclusions}") String exclusions*/) {
		FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
		filterRegistrationBean.setFilter(new WebStatFilter());
		filterRegistrationBean.addUrlPatterns("/*");
		filterRegistrationBean.addInitParameter("exclusions", DRUID_EXCLUSIONS);
		return filterRegistrationBean;
	}




	

}
