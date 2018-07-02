package com.law.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.law.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	@Query(value=" from Category c where c.stateType = 1 and  c.delFlag = 0 order by categoryId ,parentId")
	List<Category> findAcitveCategory();
}
