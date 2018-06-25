$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/product/list',
        datatype: "json",
        colModel: [			
            { label: '商品名称', name: 'title', index: 'title', width: 230 }, 			
            { label: '商品编号', name: 'productCode', index: 'product_code', width: 80 }, 			
			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 100 }, 			
			{ label: '库存', name: 'inventoryQty', index: 'inventory_qty', width: 80 }, 			
			{ label: '兑换量', name: 'orderQty', index: 'order_qty', width: 80 }, 			
			{ label: '所需积分', name: 'points', index: 'points', width: 80 }, 			
			
			{ label: '推荐', name: 'hotFlag', width: 80, sortable:false, formatter: function(value, options, row){
				return value === 0 ? '<input name="isHotCheck" type="checkbox" onclick="vm.updateHot(\''+row.productId+'\','+1+')"/>' : 
					'<input type="checkbox" name="isHotCheck" checked="checked" onclick="vm.updateHot(\''+row.productId+'\','+0+')"/>';
			}},
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作ip', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户id', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: 'productId', name: 'productId', index: 'product_id', width: 50, key: true },
//			{ label: '单价文本', name: 'priceText', index: 'price_text', width: 80 }, 			
//			{ label: '详情', name: 'detail', index: 'detail', width: 80 }, 			
//			{ label: '图片路径', name: 'imagePath', index: 'image_path', width: 80 }, 			
//			{ label: '图片路径', name: 'imagePathMult', index: 'image_path_mult', width: 80 }, 			
//			{ label: '查看次数', name: 'lookQty', index: 'look_qty', width: 80 }, 			
//			{ label: '置顶标识', name: 'topFlag', index: 'top_flag', width: 80 }, 			
//			{ label: '置顶排序', name: 'topOrder', index: 'top_order', width: 80 }, 			
//			{ label: '热门排序', name: 'hotOrder', index: 'hot_order', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        caption:"商品列表",
        rownumWidth: 25, 
        autowidth:true,
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
    
    
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		product: {},
		q:{
            keyword: null
		},
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.product = {};
		},
		update: function (event) {
			var productId = getSelectedRow();
			if(productId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(productId)
		},
		saveOrUpdate: function (event) {
			var url = vm.product.productId == null ? "/product/save" : "/product/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.product),
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
		updateHot: function(productId,value){
			//先根据用户id全部更新成不是默认的
			var product = {}
			product.productId = productId;
			product.hotFlag = value;
			$.ajax({
				type: "POST",
			    url: baseURL + "/product/update",
                contentType: "application/json",
			    data: JSON.stringify(product),
			    success: function(r){
					if(r.code == 0){
						if(r.code == 0){
//							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
//							});
						}else{
							alert(r.msg);
						}
						
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var productIds = getSelectedRows();
			if(productIds == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/product/delete",
                    contentType: "application/json",
				    data: JSON.stringify(productIds),
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
		getInfo: function(productId){
			vm.title = "编辑修改";
			$.get(baseURL + "/product/info/"+productId, function(r){
                vm.product = r.product;
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
		syncinfo:function(){
			confirm('确定更新产品信息？', function(){
				layer.load(2);
				$.ajax({
					type: "GET",
				    url: baseURL + "/product/syncinfo",
                    contentType: "application/json",
//				    data: JSON.stringify(productIds),
				    success: function(r){
						if(r.code == 0){
							layer.closeAll('loading');
//							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
//							});
						}else{
							layer.closeAll('loading');
							alert(r.msg);
						}
					}
				});
			});
		},
		syncinventory : function(){
			confirm('确定更新产品库存？', function(){
				layer.load(2);
				$.ajax({
					type: "GET",
				    url: baseURL + "/product/syncinventory",
                    contentType: "application/json",
//				    data: JSON.stringify(productIds),
				    success: function(r){
						if(r.code == 0){
							layer.closeAll('loading');
//							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
//							});
						}else{
							layer.closeAll('loading');
							alert(r.msg);
						}
					}
				});
			});
		},
		
	}
});