package com.law.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

import com.law.common.Result;

/**
 * @author sxia
 * @Description: TODO(异常处理器)
 * @date 2017-6-23 15:07
 */
@RestControllerAdvice
public class AppExceptionHandler {

	private Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * 自定义异常
	 */
	@ExceptionHandler(AppException.class)
	public Result handleAppException(AppException e){
		logger.error(e.getMessage(), e);
		return Result.error(e.getCode(), e.getMessage());
	}

	@ExceptionHandler(DuplicateKeyException.class)
	public Result handleDuplicateKeyException(DuplicateKeyException e){
		logger.error(e.getMessage(), e);
		return Result.error("数据库中已存在该记录");
	}

	@ExceptionHandler(MultipartException.class)
	public Result handleMultipartException(MultipartException e){
		logger.error(e.getMessage(), e);
		return Result.error("文件大小超过限制");
	}


	@ExceptionHandler(Exception.class)
	public Result handleException(Exception e){
		logger.error(e.getMessage(), e);
		return Result.error();
	}

}
