$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/user/list',
        datatype: "json",
        colModel: [			
            { label: '用戶ID', name: 'userId', index: 'user_id', width: 110, key: true,hidden:true},
//            { label: '微信', name: 'openidWeixin', index: 'openid_weixin', width: 80 }, 			
            { label: '昵称', name: 'userDetail.nickname', index: 'd.nickname', width: 80 }, 			
			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 100 }, 			
			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 100 }, 			
			{ label: '手机号码', name: 'tel', index: 'tel', width: 80 }, 			
			{ label: '性别', name: 'userDetail.gender', index: 'd.gender', width: 80 ,formatter: function(value, options, row){
				if(value == 1){
					return '<span>男</span>'
				}else if(value == 2){
					return '<span>女</span>';
				}else{
					return '<span>未设置</span>';
				}
			}},			
			{ label: '生日', name: 'userDetail.birthday', index: 'd.birthday', width: 80 }, 			
//			{ label: '微博', name: 'openidWeibo', index: 'openid_weibo', width: 80 }, 			
//			{ label: 'QQ', name: 'openidQq', index: 'openid_qq', width: 80 }, 			
//			{ label: '用户类型(保留)', name: 'userType', index: 'user_type', width: 80 }, 			
//			{ label: '用户类型时效', name: 'userTypeExpiresIn', index: 'user_type_expires_in', width: 80 }, 			
			{ label: '状态', name: 'stateType',index:'state_type', width: 80, formatter: function(value, options, row){
				return value === 0 ? 
					'<span class="label label-danger">禁用</span>' : 
					'<span class="label label-success">正常</span>';
			}},
			{ label: '操作', name: 'stateType',  width: 80,sortable:false, formatter: function(value, options, row){
				
		      
		          var rowData = "";
		          var editBtn = "<a onclick='vm.getInfo(\""+ row.userId +"\")'>查看</a>  ";
		          var changeUserStateTypeBtn = value === 0 ? '<a onclick="vm.changeUserStateType(\''+row.userId+'\','+1+')">启用</a>' :'<a onclick="vm.changeUserStateType(\''+row.userId+'\','+0+')">禁用</a>';
		          if(hasPermission('user:info')){
		        	  rowData += editBtn;
		          }
		          if(hasPermission('user:update')){
		        	  rowData += changeUserStateTypeBtn;
		          }
		        return rowData;
			}},
        ],
		viewrecords: true,
        height: 385,
        caption:"用戶列表",
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
//        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
    
    initQueryTotalUser();
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		q:{
            keyword: null
		},
		user: {},
		userBaby:{},
		userDetail:{},
		totalUser:0,
		totalUserToday:0,
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.user = {};
		},
		update: function (event) {
			var userId = getSelectedRow();
			if(userId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(userId)
		},
		saveOrUpdate: function (event) {
			var url = vm.user.userId == null ? "/user/save" : "/user/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.user),
			    success: function(r){
			    	if(r.code === 0){
//						alert('操作成功', function(index){
							vm.reload();
//						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var userIds = getSelectedRows();
			if(userIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/user/delete",
                    contentType: "application/json",
				    data: JSON.stringify(userIds),
				    success: function(r){
						if(r.code == 0){
//							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
//							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(userId){
			vm.showList = false;
			vm.title = "";
			$.get(baseURL + "/user/info/"+userId, function(r){
                vm.user = r.user;
                //init user Statistics
                initGridForStatistics(r.userStatisticsMap);
                //init user address
                initGridForUserAddress(r.userAddressPageUtil);
                // init for order
                initGridForUserOrder(r.userOrderPageUtil);
                
                vm.userBaby = r.userBaby;
                
                vm.userDetail = r.userDetail;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				 postData:{'keyword': vm.q.keyword},
                page:page
            }).trigger("reloadGrid");
		},
		updateDefaultAddress: function(userId,userAddressId){
//			//先根据用户id全部更新成不是默认的
//			var updateByUserIdObj = {}
//			updateByUserIdObj.userId = userId;
//			updateByUserIdObj.defaultFlag = 0;
//			
//			//更新指定地址为默认
//			var updateByUserIdAndUserAddressIdObj = {}
//			updateByUserIdAndUserAddressIdObj.userId = userId;
//			updateByUserIdAndUserAddressIdObj.defaultFlag = 1;
//			updateByUserIdAndUserAddressIdObj.userAddressId = userAddressId;
//			$.ajax({
//				type: "POST",
//			    url: baseURL + "/user/address/update",
//                contentType: "application/json",
//			    data: JSON.stringify(updateByUserIdObj),
//			    success: function(r){
//					if(r.code == 0){
//						
//						$.ajax({
//							type: "POST",
//						    url: baseURL + "/user/address/update",
//			                contentType: "application/json",
//						    data: JSON.stringify(updateByUserIdAndUserAddressIdObj),
//						    success: function(r){
//								if(r.code == 0){
//									alert('操作成功', function(index){
//										//$("#jqGrid").trigger("reloadGrid");
//									});
//								}else{
//									alert(r.msg);
//								}
//							}
//						});
//						
//					}else{
//						alert(r.msg);
//					}
//				}
//			});
		},
		
		changeUserStateType:function(userId,stateType){
			var tempUser = {};
			tempUser.userId = userId;
			tempUser.stateType = stateType;
			$.ajax({
				type: "POST",
			    url: baseURL + "/user/update",
                contentType: "application/json",
			    data: JSON.stringify(tempUser),
			    success: function(r){
					if(r.code == 0){
//						alert('操作成功', function(index){
							$("#jqGrid").trigger("reloadGrid");
//						});
					}else{
						alert(r.msg);
					}
				}
			});
		}
	}
});


function initGridForStatistics(data){
	  jQuery("#jqGridForStatistics").jqGrid(
	      {
	        datatype : "local",
	        autowidth:true,
	        colNames : [  '可用优优', '收藏文章', '收藏音频', '兑换商品件数','转发次数' ],
	        colModel : [ 
	                     {name : 'points',index : 'points',sorttype : "date"}, 
	                     {name : 'article',index : 'article',}, 
	                     {name : 'music',index : 'music',align : "right",sorttype : "float"}, 
	                     {name : 'exchange',index : 'exchange',align : "right",sorttype : "float"}, 
	                     {name : 'forword',index : 'forword',align : "right",sorttype : "float"}, 
	                   ],
	        caption : "统计信息"
	      });
	    jQuery("#jqGridForStatistics").jqGrid('addRowData', 1, data);
	}

function initGridForUserAddress(data){
	 $("#jqGridForAddress").jqGrid({
       datatype: "local",
       autowidth:true,
       colModel: [			
			{ label: 'userAddressId', name: 'userAddressId', index: 'user_address_id', width: 50, key: true ,hidden:true},
			{ label: '用户id', name: 'userId', index: 'user_id', width: 80 ,hidden:true}, 			
			{ label: '姓名', name: 'nickname', index: 'nickname', width: 80 }, 			
			{ label: '手机号码', name: 'tel', index: 'tel', width: 80 }, 			
			{ label: '详细地址', name: 'address', index: 'address', width: 80 }, 			
//			{ label: '邮编号码', name: 'postCode', index: 'post_code', width: 80 }, 			
			{ label: '默认地址', name: 'defaultFlag', width: 80, formatter: function(value, options, row){
				return value === 0 ? '<input name="defaultAddressRadio" type="radio" disabled="disabled" onclick="vm.updateDefaultAddress('+row.userId+','+row.userAddressId+')"/>' : 
					'<input type="radio" name="defaultAddressRadio" disabled="disabled" checked="checked" onclick="vm.updateDefaultAddress('+row.userId+','+row.userAddressId+')"/>';
			}},
       ],
       caption : "地址信息"
     });
	 
	 for ( var i = 0; i <= data.list.length; i++){
		    jQuery("#jqGridForAddress").jqGrid('addRowData', i + 1, data.list[i]);
	 }
} 

function initGridForUserOrder(data){
	$("#jqGridForOrder").jqGrid({
		datatype: "local",
		autowidth:true,
		colModel: [			
		           { label: '订单编号', name: 'userOrderId', index: 'user_order_id', width: 50, key: true ,hidden:true},
		           { label: '订单时间', name: 'createTime', index: 'create_time', width: 80 }, 			
		           { label: '兑换物品编号', name: 'productCode', index: 'product_code', width: 80 }, 			
		           { label: '兑换物品名称', name: 'product.title', index: 'product.title', width: 80 }, 			
		           { label: '兑换积分', name: 'points', index: 'points', width: 80 }, 			
		           { label: '兑换数量', name: 'qty', index: 'qty', width: 80 }, 			
		           { label: '快递单号', name: 'trackingNo', index: 'tracking_no', width: 80 }, 			
		           { label: '订单状态', name: 'stateType', width: 80, formatter: function(value, options, row){
		        	   var btn = '';
		        	   if(value == 1){
		        		   btn= '<span >兑换中</span>'
		        	   }else if(value == 2){
		        		   btn = '<span >已发货</span>'
		        	   }else if(value == 3){
		        		   btn = '<span >已收货</span>'
		        	   }else{
		        		   btn = '<span >未知状态</span>'
		        	   }
		        	   
		        	   return btn;
						
					}},
		           ],
		           caption : "订单信息"
	});
	
	for ( var i = 0; i <= data.list.length; i++){
		jQuery("#jqGridForOrder").jqGrid('addRowData', i + 1, data.list[i]);
	}
} 




function initQueryTotalUser(){
	
	$.ajax({
		type: "POST",
	    url: baseURL + "/user/totalUser",
        contentType: "application/json",
	    data: {},
	    success: function(r){
			if(r.code == 0){
				vm.totalUser = r.totalUser;
				vm.totalUserToday = r.totalUserToday;
			}else{
				alert(r.msg);
			}
		}
	});
	
}

