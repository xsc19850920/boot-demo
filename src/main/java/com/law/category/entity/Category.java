package com.law.category.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Category {
	@Id
	@GeneratedValue
	@Column(name = "category_id")
	// bigint(20) unsigned NOT NULL COMMENT '类别id',
	private long categoryId;
	@Column(name = "create_time")
	// bigint(20) unsigned NOT NULL COMMENT '添加时间',
	private long createTime;
	@Column(name = "modify_time")
	// bigint(20) unsigned NOT NULL COMMENT '更新时间',
	private long modifyTime;
	@Column(name = "oper_ip")
	// ` int(10) unsigned NOT NULL COMMENT '操作ip',
	private int operIp;
	@Column(name = "oper_user_id")
	// ` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
	private long operUserId;

	@Column(name = "del_flag")
	// tinyint(1) NOT NULL COMMENT '删除标识',
	private long delFlag;

	@Column(name = "title")
	// varchar(20) NOT NULL COMMENT '标题',
	private String title;
	@Column(name = "sub_title")
	// varchar(40) NOT NULL COMMENT '子标题',
	private String subTitle;
	@Column(name = "parent_id")
	// bigint(20) unsigned NOT NULL COMMENT '父类id',
	private long parentId;
	@Column(name = "lft")
	// int(10) unsigned NOT NULL COMMENT '左节点',
	private int lft;
	@Column(name = "rgt")
	// int(10) unsigned NOT NULL COMMENT '右节点',
	private int rgt;
	@Column(name = "lvl")
	// int(10) unsigned NOT NULL COMMENT '层级',
	private int lvl;
	@Column(name = "display_flag")
	// tinyint(1) NOT NULL COMMENT '显示标识',
	private int displayFlag;
	@Column(name = "display_order")
	// int(10) unsigned NOT NULL COMMENT '显示排序',
	private int displayOrder;
	@Column(name = "state_type")
	// tinyint(4) NOT NULL COMMENT '状态(未处_无效 已处_有效)',
	private int stateType;
	public long getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(long categoryId) {
		this.categoryId = categoryId;
	}
	public long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	public long getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(long modifyTime) {
		this.modifyTime = modifyTime;
	}
	public int getOperIp() {
		return operIp;
	}
	public void setOperIp(int operIp) {
		this.operIp = operIp;
	}
	public long getOperUserId() {
		return operUserId;
	}
	public void setOperUserId(long operUserId) {
		this.operUserId = operUserId;
	}
	public long getDelFlag() {
		return delFlag;
	}
	public void setDelFlag(long delFlag) {
		this.delFlag = delFlag;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSubTitle() {
		return subTitle;
	}
	public void setSubTitle(String subTitle) {
		this.subTitle = subTitle;
	}
	public long getParentId() {
		return parentId;
	}
	public void setParentId(long parentId) {
		this.parentId = parentId;
	}
	public int getLft() {
		return lft;
	}
	public void setLft(int lft) {
		this.lft = lft;
	}
	public int getRgt() {
		return rgt;
	}
	public void setRgt(int rgt) {
		this.rgt = rgt;
	}
	public int getLvl() {
		return lvl;
	}
	public void setLvl(int lvl) {
		this.lvl = lvl;
	}
	public int getDisplayFlag() {
		return displayFlag;
	}
	public void setDisplayFlag(int displayFlag) {
		this.displayFlag = displayFlag;
	}
	public int getDisplayOrder() {
		return displayOrder;
	}
	public void setDisplayOrder(int displayOrder) {
		this.displayOrder = displayOrder;
	}
	public int getStateType() {
		return stateType;
	}
	public void setStateType(int stateType) {
		this.stateType = stateType;
	}



}
