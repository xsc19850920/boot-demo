package com.law.info.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.law.info.entity.Info;

public interface InfoRepository extends JpaRepository<Info, Long> {

	@Query(value="select IFNULL(max(info_id),0) +1  from info ",nativeQuery=true)
	long findMaxId();
}
