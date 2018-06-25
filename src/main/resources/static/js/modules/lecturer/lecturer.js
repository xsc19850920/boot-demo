$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/lecturer/list',
        datatype: "json",
        colModel: [			
			{ label: 'lecturerId', name: 'lecturerId', index: 'lecturer_id', width: 50, key: true ,hidden:true},
            { label: '姓名', name: 'lecturerName', index: 'lecturer_name', width: 80 }, 			
            { label : '照片', name : 'cloudUrl', sortable:false, width : 100, formatter : function(value, options, row) {
				 return '<img class="img-thumbnail" style="width: 60px;height: 60px;" src="' + value + '" >';
			}},
            { label: '职称', name: 'lecturerTitle', index: 'lecturer_title', width: 80 }, 
            { label: '操作', name: 'opt',  width: 80, sortable:false},
//			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作ip', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户id', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '简介', name: 'intro', index: 'intro', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
//        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
		caption:"讲师列表",
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
        	var ids = $("#jqGrid").jqGrid('getDataIDs');
	        for (var i = 0; i < ids.length; i++) {
	          var id = ids[i];
	          var rowData = "";
	          var editBtn = "<a onclick='vm.getInfo(\""+ id +"\")'>编辑</a>  ";
	          var delBtn = "<a onclick='vm.del(\""+ id +"\")'>删除</a>  ";
	          if(hasPermission('lecturer:update')){
	        	  rowData += editBtn;
	          }
	          if(hasPermission('lecturer:info')){
	        	  rowData += delBtn;
	          }
	          $("#jqGrid").jqGrid('setRowData', ids[i], { opt: rowData});
	        }
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
                alert('只支持jpg、png、gif格式的图片！');
                layer.closeAll('loading');
                return false;
            }
        },
        onComplete : function(file, r){
            layer.closeAll('loading');
            if(r.code == 0){
            	vm.lecturer.cloudUrl = r.src;
            	$('#uploadImg').attr("src",vm.lecturer.cloudUrl);
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
		lecturer: {},
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
			vm.lecturer = {};
		},
		update: function (event) {
			var lecturerId = getSelectedRow();
			if(lecturerId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(lecturerId)
		},
		saveOrUpdate: function (event) {
			if(vm.validate()){
				var url = vm.lecturer.lecturerId == null ? "/lecturer/save" : "/lecturer/update";
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.lecturer),
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
		del: function (ids) {
//			var lecturerIds = getSelectedRows();
//			if(lecturerIds == null){
//				return ;
//			}
			var idsArr = [];
			idsArr.push(ids);
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/lecturer/delete",
                    contentType: "application/json",
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
		getInfo: function(lecturerId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/lecturer/info/"+lecturerId, function(r){
                vm.lecturer = r.lecturer;
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
			if(undefined ==vm.lecturer.lecturerName || vm.lecturer.lecturerName == ''  ){
				alert('讲师姓名不能为空');
				return false;
			} 
			if(undefined ==vm.lecturer.lecturerTitle || vm.lecturer.lecturerTitle == ''  ){
				alert('讲师职称不能为空');
				return false;
			} 
			if(undefined ==vm.lecturer.cloudUrl || vm.lecturer.cloudUrl == ''  ){
				alert('教师图片不能为空');
				return false;
			}
			if(undefined == vm.lecturer.intro || vm.lecturer.intro == ''  ){
				alert('讲师简介不能为空');
				return false;
			} 
			
			return true;
		}
	}
});