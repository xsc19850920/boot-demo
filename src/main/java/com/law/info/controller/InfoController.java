package com.law.info.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.druid.util.StringUtils;
import com.law.common.CommonUtils;
import com.law.common.PageUtils;
import com.law.common.Result;
import com.law.info.entity.Info;
import com.law.info.entity.InfoDetail;
import com.law.info.repository.InfoRepository;


@Controller
public class InfoController {

	@Autowired
	private InfoRepository infoRepository;

	/**
	 * 列表
	 */
	@RequestMapping("/info_list")
	@ResponseBody
	public Result list(@RequestParam Map<String, Object> params){
		 int  page = Integer.parseInt(params.get("page") == null ? CommonUtils.PAGE : params.get("page").toString());
	     int limit = Integer.parseInt(params.get("limit") == null ? CommonUtils.LIMIT :params.get("limit").toString());
//	        this.put("offset", (page - 1) * limit);
//	        this.put("page", page);
//	        this.put("limit", limit);
		Pageable pageable = new PageRequest(page == 0?0:page-1,limit, Sort.Direction.DESC,"id");
		Info info = new Info();
		info.setDelFlag(0);
		if(null != params.get("keyword")){
			info.setTitle( params.get("keyword").toString());
		}
		//创建匹配器，即如何使用查询条件
		ExampleMatcher exampleMatcher = ExampleMatcher.matching()
				.withMatcher("title",ExampleMatcher.GenericPropertyMatchers.contains())//like
		        .withIgnorePaths("operIp","id","createTime","modifyTime","operUserId","indexDisplayFlag","stateType");//isFace字段不参与匹配
		//将匹配对象封装成Example对象
		Example<Info> example = Example.of(info,exampleMatcher);
		Page<com.law.info.entity.Info> list = infoRepository.findAll(example,pageable);

		PageUtils pageUtil = new PageUtils(list.getContent(), list.getTotalElements(),limit,page);

		return Result.ok().put("page", pageUtil);
	}



	@GetMapping("/info_view")
	@ResponseBody
	public Result view(Long id){
		Info info = infoRepository.findOne(id);
		return Result.ok().put("info", info);
	}


	@PostMapping("/info_save_or_update")
	@ResponseBody
	public Result saveOrUpdate(@RequestBody Info info){

		//save
		if(info.getId() == 0){
			Long id = infoRepository.findMaxId();
			info.setId(id);
			info.setIndexDisplayFlag(1);
			info.setStateType(1);
			info.setCoverImagePath("");
			info.setSubTitle("");
			if(StringUtils.isEmpty(info.getCoverImagePath())){
				info.setCoverImagePath("");
			}
			List<InfoDetail> infoDetailList = info.getInfoDetailList();
			if(!CollectionUtils.isEmpty(infoDetailList)){
				infoDetailList.stream().forEach(d->d.setInfo(info));
			}
			infoRepository.save(info);

		}else{ //update
//			Info info = infoRepository.findOne(id);
			List<InfoDetail> infoDetailList = info.getInfoDetailList();
			if(!CollectionUtils.isEmpty(infoDetailList)){
				infoDetailList.stream().forEach(d->d.setInfo(info));
			}

			infoRepository.save(info);
		}

		return Result.ok().put("info", info);
	}



	@GetMapping("/info_delete")
	@ResponseBody
	public Result delete(Long id){
		Info info = infoRepository.findOne(id);
		info.setDelFlag(1);
		infoRepository.save(info);
		return Result.ok();
	}
}
