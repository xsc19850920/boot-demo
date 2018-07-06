$(function() {
	$("#jqGrid").jqGrid(
			{
				url : baseURL + '/info_list',
				datatype : "json",
				colModel : [
						// { label: '添加时间', name: 'createTime', index:
						// 'create_time', width: 80 },
						// { label: '更新时间', name: 'modifyTime', index:
						// 'modify_time', width: 80 },
						// { label: '操作ip', name: 'operIp', index: 'oper_ip',
						// width: 80 },
						// { label: '操作用户id', name: 'operUserId', index:
						// 'oper_user_id', width: 80 },
						// { label: '删除标识', name: 'delFlag', index: 'del_flag',
						// width: 80 },
						{
							label : 'id',
							name : 'id',
							index : 'info_id',
							key : true,
							hidden : true
						},
						{
							label : '分类',
							name : 'category.name',
							width : 120,
							sortable:false,
						},
						{
							label : '第二级分类',
							name : 'secondCategory.name',
							width : 120,
							sortable:false,
						},
						{
							label : '标题',
							name : 'title',
							index : 'title',
							width : 80,
							sortable:false,
						},
//						{
//							label : '子标题',
//							name : 'subTitle',
//							index : 'sub_title',
//							width : 80,
//							sortable:false,
//						},
						{
							label : '简介',
							name : 'intro',
							index : 'intro',
							width : 80,
							sortable:false,
						},
//						{
//							label : '封面图片',
//							name : 'coverImagePath',
//							index : 'cover_image_path',
//							width : 80,
//							sortable:false,
//						},
						{
							label : '首页显示',
							name : 'indexDisplayFlag',
							index : 'index_display_flag',
							width : 50,
							sortable:false,
							formatter : function(value, options, row) {
								return value == 0 ? '不显示' : '显示';
							}
						},
						{
							label : '状态',
							name : 'stateType',
							index : 'state_type',
							width : 30,
							sortable:false,
							formatter : function(value, options, row) {
								return value == 0 ? '无效' : '有效';
							}
						},
						{
							label : '操作',
							name : 'id',
							width : 50,
							sortable:false,
							formatter : function(value, options, row) {
								var rowData = '';
								var editBtn = "<a onclick='vm.getInfo(\""
										+ value + "\")'>编辑</a>  ";
								var delBtn = "<a onclick='vm.del(\"" + value
										+ "\")'>删除</a>  ";
								rowData += editBtn;
								rowData += delBtn;
								return rowData;
							}
						}, ],
				viewrecords : true,
				height : 385,
				rowNum : 10,
				rowList : [ 10, 30, 50 ],
				caption : "列表",
				rownumbers : true,
				rownumWidth : 25,
				autowidth : true,
				// multiselect: true,
				pager : "#jqGridPager",
				jsonReader : {
					root : "page.list",
					page : "page.currPage",
					total : "page.totalPage",
					records : "page.totalCount"
				},
				prmNames : {
					page : "page",
					rows : "limit",
					order : "order"
				},
				gridComplete : function() {
					// 隐藏grid底部滚动条
					$("#jqGrid").closest(".ui-jqgrid-bdiv").css({
						"overflow-x" : "hidden"
					});
					var ids = $("#jqGrid").jqGrid('getDataIDs');
				}
			});

});

var vm = new Vue({
	el : '#rapp',
	data : {
		showList : true,
		title : null,
		q : {
			keyword : null
		},
		zTree:{},
		info : {category:{},secondCategory:{},infoDetailList:[]},
	},
	methods : {
		query : function() {
			vm.reload();
		},
		add : function() {
			vm.info = {stateType:1,indexDisplayFlag:1,category:{},secondCategory:{},infoDetailList:[{title:"",detail:"",displayOrder:1}]};
			vm.showList = false;
			vm.title = "新增";
		},
		saveOrUpdate : function(event) {
			var url = "info_save_or_update";
			$.ajax({
				type : "POST",
				url : baseURL + url,
				contentType : "application/json",
				data : JSON.stringify(vm.info),
				success : function(r) {
					if (r.code === 0) {
						 alert('操作成功', function(index){
							 vm.reload();
						 });
					} else {
						alert(r.msg);
					}
				}
			});
		},
		del : function(id) {
			confirm('确定要删除选中的记录？', function() {
				$.get(baseURL + "/info_delete?id=" + id, function(r) {
					if (r.code == 0) {
						// alert('操作成功', function(index){
						$("#jqGrid").trigger("reloadGrid");
						// });
					} else {
						alert(r.msg);
					}
				});
				
			});
		},
		getInfo : function(id) {
			vm.showList = false;
			vm.title = "修改";
			$.get(baseURL + "/info_view?id=" + id, function(r) {
				if(r.info.infoDetailList[0] == null){
					r.info.infoDetailList = [{title:"",detail:"",displayOrder:1}];
				}
				vm.info = r.info;
			});
		},
		reload : function(event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam', 'page');
			$("#jqGrid").jqGrid('setGridParam', {
				postData : {
					'keyword' : vm.q.keyword
				},
				page : page
			}).trigger("reloadGrid");
		},
		 menuTree: function(type){
//			 if((type == 'secondCategory' ) && (vm.info.category.id == null)){
//				 alert('请选择一级分类');
//				 return ;
//			 }
//			 var url  = type == 'category'? "/category_list" :"/category_list?byLvl=true";
			 var url = "/category_list" ;
				 $.get(url, function(r) {
					 $.fn.zTree.init($("#menuTree"), setting, r);
					 vm.zTree =$.fn.zTree.getZTreeObj("menuTree");
					 vm.zTree.expandAll(true);
				})
	            layer.open({
	                type: 1,
	                offset: '50px',
	                skin: 'layui-layer-molv',
	                title: "选择菜单",
	                area: ['300px', '450px'],
	                shade: 0,
	                shadeClose: false,
	                content: jQuery("#menuLayer"),
	                btn: ['确定', '取消'],
				    btn1 : function(index) {
					var node = vm.zTree.getSelectedNodes()[0];
					console.info(node);
					if (node == null) {
//						if (type == 'category') {
//							 alert('请选择一级分类');
//						} else if (type == 'secondCategory') {
//							 alert('请选择二级分类');
//						}
						alert('请选择分类');
						return;
					}
					vm.info.secondCategory = node;
					vm.info.category.id = node.pId;
//                    if(type == 'category'){
//                    	vm.info.category = node;
//                    }else if(type == 'secondCategory'){
//                    	vm.info.secondCategory = node;
//                    }

                    layer.close(index);
	                }
	            });
	            
	            
	            
	        },
	        addPart:function(){
	        	var partIndex = $('div.panel-info').length +1;
	        	var clone = $('div.panel-info:last').clone();
	        	clone.find('input[type=text]:first').val('');
	        	clone.find('textarea').val('');
	        	clone.find('input[type=text]').eq(1).val(1);
	        	clone.find('.panel-title').html('段落 '+partIndex);
	        	$('div.panel-info:last').after(clone);
	        }
	}
});


var setting = {
		view : {
//			addHoverDom : vm.addHoverDom,
//			removeHoverDom : vm.removeHoverDom,
			selectedMulti : false,
			showIcon : false
		},
		edit : {
//			enable : true,
			editNameSelectAll : true,
//			showRemoveBtn : vm.showRemoveBtn,
//			showRenameBtn : vm.showRenameBtn
		},
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			beforeDrag : vm.beforeDrag,
//			beforeEditName : beforeEditName,
			beforeRemove : vm.beforeRemove,
			beforeRename : vm.beforeRename,
//			onRemove : onRemove,
//			onRename : onRename
		}
	};