package com.law.info.controller;

import java.util.Map;

import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.law.common.CommonUtils;
import com.law.common.PageUtils;
import com.law.common.Result;
import com.law.info.entity.Info;
import com.law.info.repository.InfoRepository;


@Controller
public class InfoController {

	@Autowired
	private InfoRepository infoRepository;

	/**
	 * 列表
	 */
	@RequestMapping("/info_list")
	public Result list(@RequestParam Map<String, Object> params){
		 int  page = Integer.parseInt(params.get("page") == null ? CommonUtils.PAGE : params.get("page").toString());
	     int limit = Integer.parseInt(params.get("limit") == null ? CommonUtils.LIMIT :params.get("limit").toString());
//	        this.put("offset", (page - 1) * limit);
//	        this.put("page", page);
//	        this.put("limit", limit);
		Pageable pageable = new PageRequest(page,limit, Sort.Direction.DESC,"id");
		Info Info = new Info();
		//将匹配对象封装成Example对象
		Example<Info> example =Example.of(Info);
		Page<com.law.info.entity.Info> findAll = infoRepository.findAll(example, pageable);

		PageUtils pageUtil = new PageUtils(findAll.getContent(), findAll.getTotalElements(),limit,page);

		return Result.ok().put("page", pageUtil);
	}
}
