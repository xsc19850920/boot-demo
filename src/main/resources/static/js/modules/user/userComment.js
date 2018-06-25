$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/user/commont/list',
        datatype: "json",
        colModel: [			
			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
			{ label: '操作IP(保留0)', name: 'operIp', index: 'oper_ip', width: 80 }, 			
			{ label: '操作用户ID', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
			{ label: 'userCommentId', name: 'userCommentId', index: 'user_comment_id', width: 50, key: true },
			{ label: '信息id', name: 'infoId', index: 'info_id', width: 80 }, 			
			{ label: '评论用户id', name: 'userId', index: 'user_id', width: 80 }, 			
			{ label: '消息接收者用户id', name: 'receiver', index: 'receiver', width: 80 }, 			
			{ label: '详情100', name: 'detail', index: 'detail', width: 80 }, 			
			{ label: '父类id', name: 'parentId', index: 'parent_id', width: 80 }, 			
			{ label: '父类评论', name: 'parentDetail', index: 'parent_detail', width: 80 }			
        ],
		viewrecords: true,
        //height: 385,
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
        	var ids = $("#jqGrid").jqGrid('getDataIDs');
	        for (var i = 0; i < ids.length; i++) {
	          var id = ids[i];
	          var rowData = "";
//	          var editBtn = "<a onclick='vm.getInfo(\""+ id +"\")'>编辑</a>  ";
	          var delBtn = "<a onclick='vm.del(\""+ id +"\")'>删除</a>  ";
//	          if(hasPermission('classes:room:update')){
//	        	  rowData += editBtn;
//	          }
	          if(hasPermission('classes:room:info')){
	        	  rowData += delBtn;
	          }
	          $("#jqGrid").jqGrid('setRowData', ids[i], { opt: rowData});
	        }
        }
    });
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		userComment: {},
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
			vm.userComment = {};
		},
		update: function (event) {
			var userCommentId = getSelectedRow();
			if(userCommentId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(userCommentId)
		},
		saveOrUpdate: function (event) {
			var url = vm.userComment.userCommentId == null ? "/user/commont/save" : "/user/commont/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.userComment),
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
		del: function (id) {
			//var userCommentIds = getSelectedRows();
			//if(userCommentIds == null){
				//return ;
			//}
			var idsArr = [];
			idsArr.push(id);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/user/commont/delete",
                    contentType: "application/json",
				    //data: JSON.stringify(userCommentIds),
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
		getInfo: function(userCommentId){
			vm.showList = false;
			vm.title = "";
			$.get(baseURL + "/user/commont/info/"+userCommentId, function(r){
                vm.userComment = r.userComment;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				 postData:{'keyword': vm.q.keyword},
                page:page
            }).trigger("reloadGrid");
		}
	}
});