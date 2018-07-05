package com.law.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.law.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
//	@Query(value=" from Category c where c.delFlag = 0 order by categoryId ,parentId")
	@Query(value=" from Category c where  c.stateType = 1 and  c.delFlag = 0  order by id ,pId")
	List<Category> findAcitveCategory();

	@Query(value="select max(category_id) +1  from category ",nativeQuery=true)
	long findMaxCategoryId();

	@Query(value=" from Category c where  c.stateType = 1 and pId = ?1 and c.delFlag = 0  order by id ,pId")
	List<Category> findAcitveCategoryByParentId(Long id);
}
