package com.law.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.law.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {


}
