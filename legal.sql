/*
Navicat MySQL Data Transfer

Source Server         : 法官私活
Source Server Version : 50545
Source Host           : 111.231.12.224:3306
Source Database       : legal

Target Server Type    : MYSQL
Target Server Version : 50545
File Encoding         : 65001

Date: 2018-06-27 06:33:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `category_id` bigint(20) unsigned NOT NULL COMMENT '类别id',
  `title` varchar(20) NOT NULL COMMENT '标题',
  `sub_title` varchar(40) NOT NULL COMMENT '子标题',
  `parent_id` bigint(20) unsigned NOT NULL COMMENT '父类id',
  `lft` int(10) unsigned NOT NULL COMMENT '左节点',
  `rgt` int(10) unsigned NOT NULL COMMENT '右节点',
  `lvl` int(10) unsigned NOT NULL COMMENT '层级',
  `display_flag` tinyint(1) NOT NULL COMMENT '显示标识',
  `display_order` int(10) unsigned NOT NULL COMMENT '显示排序',
  `state_type` tinyint(4) NOT NULL COMMENT '状态(未处_无效 已处_有效)',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='类别';

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '0', '', '', '0', '0', '0', '0', '0', '0', '0');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '1', '合同纠纷', '一级子标题1', '0', '0', '0', '1', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '2', '婚姻家庭', '婚约财产', '0', '0', '0', '1', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '3', '劳动人事', '劳动合同', '0', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '10', '房屋买卖', '二级子标题10', '1', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '11', '房屋租赁', '二级子标题11', '1', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '12', '买卖合同', '二级子标题12', '1', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '13', '借款合同', '二级子标题13', '1', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '20', '婚约财产', '二级子标题20', '2', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '21', '过错赔偿', '二级子标题21', '2', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '22', '子女抚养', '二级子标题22', '2', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '23', '财产分割', '呃呃', '2', '0', '0', '2', '1', '0', '1');
INSERT INTO `category` VALUES ('0', '0', '0', '0', '0', '30', '三级分类', '三级分类副标题', '23', '0', '0', '3', '1', '0', '1');

-- ----------------------------
-- Table structure for `contract`
-- ----------------------------
DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `contract_id` bigint(20) unsigned NOT NULL COMMENT '合同id',
  `title` varchar(20) NOT NULL COMMENT '标题',
  `category_id` bigint(20) unsigned NOT NULL COMMENT '类别id',
  `display_order` int(10) unsigned NOT NULL COMMENT '排序',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`contract_id`),
  UNIQUE KEY `contract_id` (`contract_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='合同';

-- ----------------------------
-- Records of contract
-- ----------------------------
INSERT INTO `contract` VALUES ('0', '0', '0', '0', '0', '100101', '商品房预售合同注意事项', '1001', '1', '1');
INSERT INTO `contract` VALUES ('0', '0', '0', '0', '0', '100102', '商品房预售合同签合同注意事项', '1001', '2', '1');

-- ----------------------------
-- Table structure for `feedback`
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作IP(保留0)',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户ID',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `feedback_id` bigint(20) unsigned NOT NULL COMMENT '意见反馈ID',
  `feedback_type` tinyint(4) NOT NULL COMMENT '类型 : 建议 表扬 批评',
  `device_info` varchar(1000) NOT NULL COMMENT '设备信息',
  `detail` varchar(200) NOT NULL COMMENT 'detail200',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `feedback_id` (`feedback_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='意见反馈';

-- ----------------------------
-- Records of feedback
-- ----------------------------

-- ----------------------------
-- Table structure for `info`
-- ----------------------------
DROP TABLE IF EXISTS `info`;
CREATE TABLE `info` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  `info_id` bigint(20) unsigned NOT NULL COMMENT '信息id',
  `category_id` bigint(20) unsigned NOT NULL COMMENT '类别id',
  `second_category_id` bigint(20) unsigned NOT NULL COMMENT '第二级分类',
  `title` varchar(20) NOT NULL COMMENT '标题',
  `sub_title` varchar(40) NOT NULL COMMENT '子标题',
  `intro` varchar(50) NOT NULL COMMENT '简介',
  `cover_image_path` varchar(200) NOT NULL COMMENT '封面图片路径',
  `index_display_flag` tinyint(1) NOT NULL COMMENT '首页显示标识',
  PRIMARY KEY (`info_id`),
  UNIQUE KEY `info_id` (`info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='信息';

-- ----------------------------
-- Records of info
-- ----------------------------
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '1', '1', '11', '标题1', '子标题1', '简介1', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '2', '1', '11', '标题2', '子标题2', '简介2', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '3', '1', '11', '标题3', '子标题3', '简介3', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '4', '1', '11', '标题4', '子标题4', '简介4', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '5', '1', '11', '标题5', '子标题5', '简介5', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '201', '2', '23', '北京中法院', '子标题201', '简介201', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '202', '2', '23', '二级分类信息202', '子标题202', '简介202', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '203', '2', '23', '二级分类信息203', '子标题203', '简介203', '', '1');
INSERT INTO `info` VALUES ('1525104000', '0', '0', '0', '0', '1', '301', '30', '23', '二级分类信息203', '子标题203', '简介203', '', '1');

-- ----------------------------
-- Table structure for `info_detail`
-- ----------------------------
DROP TABLE IF EXISTS `info_detail`;
CREATE TABLE `info_detail` (
  `info_detail_id` bigint(20) unsigned NOT NULL COMMENT '信息详情id',
  `info_id` bigint(20) unsigned NOT NULL COMMENT '信息id',
  `detail` varchar(2000) NOT NULL COMMENT '内容',
  `display_order` int(10) unsigned NOT NULL COMMENT '显示排序',
  `title` varchar(20) NOT NULL COMMENT '标题',
  PRIMARY KEY (`info_detail_id`),
  UNIQUE KEY `info_detail_id` (`info_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='信息详情';

-- ----------------------------
-- Records of info_detail
-- ----------------------------
INSERT INTO `info_detail` VALUES ('2011', '201', '这里是详细信息', '1', '信息201-1');
INSERT INTO `info_detail` VALUES ('2012', '201', '这里是详细信息', '1', '信息201-2');
INSERT INTO `info_detail` VALUES ('2013', '201', '这里是详细信息', '1', '信息201-3');

-- ----------------------------
-- Table structure for `order_info`
-- ----------------------------
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `order_info_id` bigint(20) unsigned NOT NULL COMMENT '订单id',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户id',
  `wx_open_id` varchar(128) NOT NULL COMMENT 'wx_open_id',
  `email` varchar(64) NOT NULL COMMENT 'email',
  `money` decimal(12,2) unsigned NOT NULL COMMENT '金额',
  `wx_order_id` varchar(128) NOT NULL COMMENT '微信订单号',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型 0等待支付1已完成 2等待发货 3等待取货 4等待收货',
  PRIMARY KEY (`order_info_id`),
  UNIQUE KEY `order_info_id` (`order_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单';

-- ----------------------------
-- Records of order_info
-- ----------------------------

-- ----------------------------
-- Table structure for `term`
-- ----------------------------
DROP TABLE IF EXISTS `term`;
CREATE TABLE `term` (
  `term_id` bigint(20) unsigned NOT NULL COMMENT '条款id',
  `contract_id` bigint(20) unsigned NOT NULL COMMENT '合同id',
  `title` varchar(20) NOT NULL COMMENT '标题',
  `title_tip` varchar(1000) NOT NULL COMMENT '条款提醒',
  `charge_flag` tinyint(1) NOT NULL COMMENT '收费标识',
  `display_order` int(10) unsigned NOT NULL COMMENT '排序',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`term_id`),
  UNIQUE KEY `term_id` (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='合同条款';

-- ----------------------------
-- Records of term
-- ----------------------------
INSERT INTO `term` VALUES ('10010101', '100101', '条款1', '注意事项', '0', '0', '1');
INSERT INTO `term` VALUES ('100101012', '100101', '条款2', '111111', '0', '0', '1');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户id',
  `wx_open_id` varchar(128) NOT NULL COMMENT 'wx_open_id',
  `user_type` tinyint(4) NOT NULL COMMENT '用户类型(保留)',
  `user_type_expires_in` bigint(20) unsigned NOT NULL COMMENT '用户类型时效',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for `user_admin`
-- ----------------------------
DROP TABLE IF EXISTS `user_admin`;
CREATE TABLE `user_admin` (
  `create_time` bigint(20) unsigned NOT NULL COMMENT '添加时间',
  `modify_time` bigint(20) unsigned NOT NULL COMMENT '更新时间',
  `oper_ip` int(10) unsigned NOT NULL COMMENT '操作ip',
  `oper_user_id` bigint(20) unsigned NOT NULL COMMENT '操作用户id',
  `del_flag` tinyint(1) NOT NULL COMMENT '删除标识',
  `user_admin_id` bigint(20) unsigned NOT NULL COMMENT '管理员用户id',
  `user_name` varchar(20) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL COMMENT '密码',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`user_admin_id`),
  UNIQUE KEY `user_admin_id` (`user_admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员';

-- ----------------------------
-- Records of user_admin
-- ----------------------------

-- ----------------------------
-- Table structure for `user_detail`
-- ----------------------------
DROP TABLE IF EXISTS `user_detail`;
CREATE TABLE `user_detail` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户id',
  `gender` tinyint(4) NOT NULL COMMENT '性别(1男2女)',
  `nickname` varchar(40) NOT NULL COMMENT '昵称',
  `weixin` varchar(40) NOT NULL COMMENT '微信号',
  `signature` varchar(50) NOT NULL COMMENT '签名',
  `cloud_avatar_url` varchar(300) NOT NULL COMMENT '头像路径',
  `country` varchar(50) NOT NULL COMMENT '国家',
  `province` varchar(50) NOT NULL COMMENT '省',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `company` varchar(40) NOT NULL COMMENT '单位名称',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户_详情';

-- ----------------------------
-- Records of user_detail
-- ----------------------------

-- ----------------------------
-- Table structure for `user_login`
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `user_login_id` bigint(20) unsigned NOT NULL COMMENT '主键',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户id',
  `login_token` varchar(32) NOT NULL COMMENT '登录toke键',
  `login_salt` bigint(20) unsigned NOT NULL COMMENT '登录胡椒面',
  `wx_session_key` varchar(128) NOT NULL COMMENT 'wx_session_key',
  `wx_open_id` varchar(128) NOT NULL COMMENT 'wx_open_id',
  `login_expires_in` int(10) unsigned NOT NULL COMMENT '失效时间',
  `state_type` tinyint(3) unsigned NOT NULL COMMENT '状态类型(未处_无效 已处_有效)',
  PRIMARY KEY (`user_login_id`),
  UNIQUE KEY `user_login_id` (`user_login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户登录';

-- ----------------------------
-- Records of user_login
-- ----------------------------
