package com.law.category.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.law.category.entity.Category;
import com.law.category.repository.CategoryRepository;
import com.law.common.Result;


@Controller
public class CategoryController {
	@Autowired
	private CategoryRepository categoryRepository;

	@RequestMapping(value = "/category_list", method = RequestMethod.GET)
	@ResponseBody
	public List<Category> user(HttpSession session)  {
		List<Category> list = categoryRepository.findAcitveCategory();

//		list = treeMenuList(list,0);
//		Result r = Result.ok().put("list",list);
		return list;
	}

	@RequestMapping(value = "/category_del", method = RequestMethod.POST)
	@ResponseBody
	public Result delete(HttpSession session,Long id)  {
		List<Category> list = categoryRepository.findAcitveCategory();

		List<Category> specificationList = treeList(list, id);
		List<Category> finalList = treeList(specificationList);
		finalList.add(list.stream().filter(l -> l.getId() == id ).findFirst().get());
		finalList.stream().forEach(l->l.setDelFlag(1));
		categoryRepository.save(finalList);

//		category.setDelFlag(1);
//		categoryRepository.save(category);
//		list = treeMenuList(list,0);
		Result r = Result.ok();
		return r;
	}


	@RequestMapping(value = "/category_update", method = RequestMethod.POST)
	@ResponseBody
	public Result update(HttpSession session,Long id,String title,String subTitle,Integer lvl,Long parentId)  {
		Category c = null;
		if(id == null){
			c = new Category();
			long maxId = categoryRepository.findMaxCategoryId();
			c.setId(maxId);
			c.setStateType(1);
			c.setDisplayFlag(1);
			c.setLvl(lvl);
			c.setpId(parentId);
		}else{
			c = categoryRepository.findOne(id);
		}
		c.setSubTitle(subTitle);
		c.setTitle(title);


		categoryRepository.save(c);
		Result r = Result.ok();
		return r;
	}

	public List<Category> treeList(List<Category> list, long parentId) {
		List<Category> childList = new ArrayList<Category>();
		for (Category l : list) {
			if (parentId == l.getpId()) {
				List<Category> tempList = treeList(list, l.getId());
				//将子结果集存入当前对象的children字段中
                l.setChild(tempList);
                //添加当前对象到主结果集中
                childList.add(l);
			}
		}
		return childList;
	}


	public List<Category> treeList(List<Category> list) {
		List<Category> tempList =  new ArrayList<Category>();
		for (Category l : list) {
			for (Category second : l.getChild()) {
				tempList.addAll(second.getChild());
			}
			tempList.addAll(l.getChild());
			tempList.add(l);
		}
		return tempList;
	}

}
