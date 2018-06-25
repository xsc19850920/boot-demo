$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/classes/room/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'classRoomId', index: 'class_room_id', width: 50, key: true,hidden:true },
            { label: '课程标题', name: 'title', index: 'title', width: 80 }, 			
			{ label : '课程图片', name : 'cloudUrl', width : 100, sortable:false, formatter : function(value, options, row) {
				 return '<img class="img-thumbnail" style="width: 60px;height: 60px;" src="' + value + '" >';
			}},
			{ label: '发布时间', name: 'createTime', index: 'create_time', width: 80 }, 			
			{ label: '视频数', name: 'videoQty', index: 'video_qty', width: 80 }, 			
			{ label: '相关', name: 'viewQty', sortable:false, width: 100, formatter: function(value, options, row){
				return '<p>已看:'+value+'</p>';
			} },
			{ label: '操作', name: 'opt',  width: 80, sortable:false},
        
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作ip', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户id', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '讲师id', name: 'lecturerId', index: 'lecturer_id', width: 80 }, 			
//			{ label: '简介', name: 'intro', index: 'intro', width: 80 }, 			
//			{ label: '适用人群', name: 'apply', index: 'apply', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
        rowNum: 10,
		rowList : [10,30,50],
		caption:"课程列表",
        rownumbers: true, 
        height: 'auto',
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
        	var ids = $("#jqGrid").jqGrid('getDataIDs');
	        for (var i = 0; i < ids.length; i++) {
	          var id = ids[i];
	          var rowData = "";
	          var editBtn = "<a onclick='vm.getInfo(\""+ id +"\")'>编辑</a>  ";
	          var delBtn = "<a onclick='vm.del(\""+ id +"\")'>删除</a>  ";
	          if(hasPermission('classes:room:update')){
	        	  rowData += editBtn;
	          }
	          if(hasPermission('classes:room:info')){
	        	  rowData += delBtn;
	          }
	          $("#jqGrid").jqGrid('setRowData', ids[i], { opt: rowData});
	          
	        }
	        
	        initLecturerList();
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
            	vm.classRoom.cloudUrl = r.src;
            	$('#uploadImg').attr("src",vm.classRoom.cloudUrl);
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
		classRoom: {},
		lecturerList:[],
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
			vm.classRoom = {};
		},
		update: function (event) {
			var classRoomId = getSelectedRow();
			if(classRoomId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(classRoomId)
		},
		saveOrUpdate: function (event) {
			if(vm.validate()){
				var url = vm.classRoom.classRoomId == null ? "/classes/room/save" : "/classes/room/update";
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.classRoom),
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
		del: function (infoAudioIds) {
			var idsArr = [];
			idsArr.push(infoAudioIds);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/classes/room/delete",
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
		getInfo: function(classRoomId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/classes/room/info/"+classRoomId, function(r){
                vm.classRoom = r.classRoom;
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
			if(undefined ==vm.classRoom.title || vm.classRoom.title == ''  ){
				alert('课程标题不能为空');
				return false;
			} 
			if(undefined ==vm.classRoom.cloudUrl || vm.classRoom.cloudUrl == ''  ){
				alert('课程图片不能为空');
				return false;
			} 
			if(undefined ==vm.classRoom.intro || vm.classRoom.intro == ''  ){
				alert('课程简介不能为空');
				return false;
			}
			if(undefined == vm.classRoom.apply || vm.classRoom.apply == ''  ){
				alert('适用人群不能为空');
				return false;
			} 
			if(undefined == vm.classRoom.lecturerId || vm.classRoom.lecturerId == ''  ){
				alert('讲师不能为空');
				return false;
			} 
			return true;
		}
	}
});

function initLecturerList(){
	var url = baseURL + '/lecturer/list';
	var data = {			
			_search: false,
			limit: 10,
			page: 1,
			sidx: "",
			order: "asc"
	};
	$.ajax({
		type: "POST",
	    url: url,
        contentType: "application/json",
	    data: JSON.stringify(data),
	    success: function(r){
	      vm.lecturerList = r.page.list;
		}
	});
}