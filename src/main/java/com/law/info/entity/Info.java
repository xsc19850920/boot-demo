package com.law.info.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.law.category.entity.Category;

@Entity
@Table(name = "info")
public class Info {

	@Column(name = "create_time")
	private  long createTime;
	@Column(name = "modify_time")
	private long modifyTime;
	@Column(name = "oper_ip")
	private int operIp;
	@Column(name = "oper_user_id")
	private long operUserId;

	@Column(name = "del_flag")
	//  '删除标识',
	private int delFlag;
	@Column(name = "state_type")
	//  '状态(未处_无效 已处_有效)',
	private int stateType;
	@Id
	@Column(name = "info_id")
	private long id;

	@Column(name = "title")
	private String title;

	@Column(name = "sub_title")
	private String subTitle;

	// category_id bigInteger
	// second_category_id bigInteger
	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToOne
	@JoinColumn(name = "second_category_id")
	private Category secondCategory;
	// title varchar
	// sub_title varchar
	private String intro;

	@Column(name = "cover_image_path")
	private String coverImagePath;

	@Column(name = "index_display_flag")
	private int indexDisplayFlag;


	@OneToMany(mappedBy="info", fetch = FetchType.EAGER ,cascade=CascadeType.ALL)
	private List<InfoDetail> infoDetailList;


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

	public int getDelFlag() {
		return delFlag;
	}

	public void setDelFlag(int delFlag) {
		this.delFlag = delFlag;
	}

	public int getStateType() {
		return stateType;
	}

	public void setStateType(int stateType) {
		this.stateType = stateType;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public Category getSecondCategory() {
		return secondCategory;
	}

	public void setSecondCategory(Category secondCategory) {
		this.secondCategory = secondCategory;
	}

	public String getIntro() {
		return intro;
	}

	public void setIntro(String intro) {
		this.intro = intro;
	}

	public String getCoverImagePath() {
		return coverImagePath;
	}

	public void setCoverImagePath(String coverImagePath) {
		this.coverImagePath = coverImagePath;
	}

	public int getIndexDisplayFlag() {
		return indexDisplayFlag;
	}

	public void setIndexDisplayFlag(int indexDisplayFlag) {
		this.indexDisplayFlag = indexDisplayFlag;
	}

	public List<InfoDetail> getInfoDetailList() {
		return infoDetailList;
	}

	public void setInfoDetailList(List<InfoDetail> infoDetailList) {
		this.infoDetailList = infoDetailList;
	}



}
