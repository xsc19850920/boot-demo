package com.law.info.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.law.info.entity.Info;

public interface InfoRepository extends JpaRepository<Info, Long> {


}
