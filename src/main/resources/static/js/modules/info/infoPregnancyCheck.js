$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/info/pregnancycheck/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'infoPregnancyCheckId', index: 'info_pregnancy_check_id', width: 50, key: true,hidden:true },
            { label: '标题', name: 'title', index: 'title', width: 80 }, 			
            { label: '显示顺序', name: 'displayOrder', index: 'display_order', width: 40 }, 			
            { label: '操作', name: 'displayOrder', sortable:false,  width: 60,formatter:function(value,options,row){
				
				  var rowData = "";
		          var editBtn = "<a onclick='vm.getInfo(\""+ row.infoPregnancyCheckId +"\")'>编辑</a>  ";
		          var delBtn = "<a onclick='vm.del(\""+ row.infoPregnancyCheckId +"\")'>删除</a>  ";
		          if(hasPermission('info:pregnancycheck:update')){
		        	  rowData += editBtn;
		          }
		          if(hasPermission('info:pregnancycheck:info')  ){
		        	  rowData += delBtn;
		          }
		          return rowData;
			}},
			
//			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作ip', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户id', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '详情', name: 'detail', index: 'detail', width: 80 }, 			
//			{ label: '显示顺序', name: 'displayOrder', index: 'display_order', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
        height: 'auto',
        rowNum: 10,
		rowList : [10,30,50],
		caption:"列表",
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
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		infoPregnancyCheck: {},
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
			vm.infoPregnancyCheck = {};
		},
		update: function (event) {
			var infoPregnancyCheckId = getSelectedRow();
			if(infoPregnancyCheckId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(infoPregnancyCheckId)
		},
		saveOrUpdate: function (event) {
			if(vm.validate()){
				var url = vm.infoPregnancyCheck.infoPregnancyCheckId == null ? "/info/pregnancycheck/save" : "/info/pregnancycheck/update";
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.infoPregnancyCheck),
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
			//var infoPregnancyCheckIds = getSelectedRows();
			//if(infoPregnancyCheckIds == null){
				//return ;
			//}
			var idsArr = [];
			idsArr.push(id);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/info/pregnancycheck/delete",
                    contentType: "application/json",
				    //data: JSON.stringify(infoPregnancyCheckIds),
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
		getInfo: function(infoPregnancyCheckId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/info/pregnancycheck/info/"+infoPregnancyCheckId, function(r){
                vm.infoPregnancyCheck = r.infoPregnancyCheck;
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
			if(undefined ==vm.infoPregnancyCheck.title || vm.infoPregnancyCheck.title == ''  ){
				alert('标题不能为空');
				return false;
			} 
			if(undefined ==vm.infoPregnancyCheck.detail || vm.infoPregnancyCheck.detail == ''  ){
				alert('详情不能为空');
				return false;
			} 
			if(undefined ==vm.infoPregnancyCheck.displayOrder || vm.infoPregnancyCheck.displayOrder  == ''  ){
				alert('显示顺序不能为空');
				return false;
			} 
			return true;
		}
	}
});