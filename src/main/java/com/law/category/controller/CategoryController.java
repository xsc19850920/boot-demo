package com.law.category.controller;

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
		List<Category> list = categoryRepository.findAll();
//		Result r = Result.ok().put("list",list);
		return list;
	}

}
