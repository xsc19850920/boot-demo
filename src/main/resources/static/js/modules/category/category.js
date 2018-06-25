$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/category/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'categoryId', index: 'category_id', width: 50, key: true,hidden:true },
            { label: '主题名称', name: 'title', index: 'title', width: 60 }, 			
            { label : '主题图片', name : 'cloudUrl', width : 30, sortable:false, formatter : function(value, options, row) {
				 return '<img class="img-thumbnail" style="width: 60px;height: 60px;" src="' + value + '" >';
			}},
			{ label: '二级标题', name: 'intro', index: 'intro', width: 60 }, 			
			{ label: '文章数量', name: 'infoQty', index: 'info_qty', width: 40 }, 		
			{ label: '显示排序', name: 'displayOrder', index: 'display_order', width: 40 }, 
			{ label: '操作', name: 'allowDeleteFlag', sortable:false, width: 60,formatter:function(value,options,row){
				
				  var rowData = "";
		          var editBtn = "<a onclick='vm.getInfo(\""+ row.categoryId +"\")'>编辑</a>  ";
		          var delBtn = "<a onclick='vm.del(\""+ row.categoryId +"\")'>删除</a>  ";
		          if(hasPermission('category:update') ){
		        	  rowData += editBtn;
		          }
		          if(hasPermission('category:delete') &&  value === 1 ){
		        	  rowData += delBtn;
		          }
		          return rowData;
			}},
			
//			
//			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作IP(保留0)', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户ID', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '类别的类型(1妈妈知道)', name: 'categoryType', index: 'category_type', width: 80 }, 			
//			{ label: '图片路径', name: 'cloudUrl', index: 'cloud_url', width: 80 }, 			
//			{ label: '允许删除标识', name: 'allowDeleteFlag', index: 'allow_delete_flag', width: 80 }, 			
//			{ label: '热门标识', name: 'hotFlag', index: 'hot_flag', width: 80 }, 			
//			{ label: '热门排序', name: 'hotOrder', index: 'hot_order', width: 80 }, 			
//			{ label: '备注', name: 'memo', index: 'memo', width: 80 }, 			
//			{ label: '状态(未处_无效 已处_有效)', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
        height: 'auto',
        rowNum: 10,
		rowList : [10,30,50],
		caption:"主题列表",
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        //multiselect: true,
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
    
    
    new AjaxUpload('#uploadImg', {
        action: baseURL + '/sys/attachment/upload?X-Token=' + token,
        name: 'file',
        autoSubmit:true,
        responseType:"json",
        onSubmit:function(file, extension){
            layer.load(2);
            if (!(extension && /^(jpg|jpeg|png|gif)$/.test(extension.toLowerCase()))){
            	 layer.closeAll('loading');
                alert('只支持jpg、png、gif格式的图片！');
                return false;
            }
        },
        onComplete : function(file, r){
            layer.closeAll('loading');
            if(r.code == 0){
            	vm.category.cloudUrl = r.src;
            	$('#uploadImg').attr("src",vm.category.cloudUrl);
            }else{
                alert(r.msg);
            }
        }
    });
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		category: {},
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
			vm.category = {};
		},
		update: function (event) {
			var categoryId = getSelectedRow();
			if(categoryId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(categoryId)
		},
		saveOrUpdate: function (event) {
			if(vm.validate()){
				
				var url = vm.category.categoryId == null ? "/category/save" : "/category/update";
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.category),
					success: function(r){
						if(r.code === 0){
//							alert('操作成功', function(index){
								vm.reload();
//							});
						}else{
							alert(r.msg);
						}
					}
				});
			}
		},
		del: function (id) {
			//var categoryIds = getSelectedRows();
			//if(categoryIds == null){
				//return ;
			//}
			var idsArr = [];
			idsArr.push(id);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/category/delete",
                    contentType: "application/json",
				    //data: JSON.stringify(categoryIds),
				    data: JSON.stringify(idsArr),
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
		getInfo: function(categoryId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/category/info/"+categoryId, function(r){
                vm.category = r.category;
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
		validate:function(){
			if(undefined ==vm.category.title || vm.category.title == ''  ){
				alert('主题名称不能为空');
				return false;
			} 
			if(undefined ==vm.category.intro || vm.category.intro == ''  ){
				alert('二级标题不能为空');
				return false;
			} 
//			if(undefined ==vm.category.allowDeleteFlag || vm.category.allowDeleteFlag == ''  ){
//				alert('状态不能为空');
//				return false;
//			} 
			if(undefined ==vm.category.cloudUrl || vm.category.cloudUrl == ''  ){
				alert('分类图标不能为空');
				return false;
			}
			if(undefined ==vm.category.displayOrder || vm.category.displayOrder == ''  ){
				alert('书序排序不能为空');
				return false;
			}
			
			return true;
		}
	}
});