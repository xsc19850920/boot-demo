$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/info/qa/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'infoQaId', index: 'info_qa_id', width: 50, key: true,hidden :true},
            { label: '标题', name: 'title', index: 'title', width: 80 }, 			
            { label: '作者', name: 'author', index: 'author', width: 80 }, 			
            { label: '职称', name: 'authorTitle', index: 'author_title', width: 80 }, 			
            { label: '问题', name: 'question', index: 'question', width: 80 }, 	
            { label: '内容', name: 'answerDetail', index: 'answer_detail', sortable:false, width: 80,formatter:function(value,options,row){
            		return "<a onclick='vm.showAnswerDetail(\""+ value +"\")'>查看内容</a>  ";
            }},
            { label: '操作', name: 'createTime', sortable:false,  width: 80,formatter:function(value,options,row){
				
				  var rowData = "";
		          var editBtn = "<a onclick='vm.getInfo(\""+ row.infoQaId +"\")'>编辑</a>  ";
		          var delBtn = "<a onclick='vm.del(\""+ row.infoQaId +"\")'>删除</a>  ";
		          if(hasPermission('info:qa:update')){
		        	  rowData += editBtn;
		          }
		          if(hasPermission('info:qa:info') ){
		        	  rowData += delBtn;
		          }
		          return rowData;
			}},
            
//			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作IP(保留0)', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户ID', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '一问一答分类 : 1新生儿期 2婴儿期 3幼儿期 4学龄前期', name: 'infoQaType', index: 'info_qa_type', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
        height: 'auto',
        rowNum: 10,
		rowList : [10,30,50],
		caption:"问答列表",
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
		infoQa: {},
		q:{
            keyword: null,
            infoTypeValue : null,
		},
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.infoQa = {};
		},
		update: function (event) {
			var infoQaId = getSelectedRow();
			if(infoQaId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(infoQaId)
		},
		saveOrUpdate: function (event) {
			var url = vm.infoQa.infoQaId == null ? "/info/qa/save" : "/info/qa/update";
//			vm.infoQa.answerDetail = escape(vm.infoQa.answerDetail);
//			$('#answerDetailTextarea').val('');
			if(vm.validate()){
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.infoQa),
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
			//var infoQaIds = getSelectedRows();
			//if(infoQaIds == null){
				//return ;
			//}
			var idsArr = [];
			idsArr.push(id);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/info/qa/delete",
                    contentType: "application/json",
				    //data: JSON.stringify(infoQaIds),
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
		getInfo: function(infoQaId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/info/qa/info/"+infoQaId, function(r){
                vm.infoQa = r.infoQa;
//                vm.infoQa.answerDetail = unescape(vm.infoQa.answerDetail);
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
		showAnswerDetail:function(answerDetail){
			$('#answerDetailDiv').html(answerDetail/*unescape(answerDetail)*/);
			openLayer('900px', '600px', '回答内容', 'answerDetailLayer');
		},
		changeInfoQaType:function(infoQaTypeValue){
	    	var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				  datatype: "json",
				  postData:{'infoQaTypeValue': infoQaTypeValue},
	            page:page
	       }).trigger("reloadGrid");
		},
		validate:function(){
			if(undefined ==vm.infoQa.infoQaType || vm.infoQa.infoQaType == ''  ){
				alert('分类不能为空');
				return false;
			} 
			if(undefined ==vm.infoQa.title || vm.infoQa.title == ''  ){
				alert('标题不能为空');
				return false;
			} 
			if(undefined ==vm.infoQa.question || vm.infoQa.question == ''  ){
				alert('问题不能为空');
				return false;
			} 
			if(undefined ==vm.infoQa.author || vm.infoQa.author == ''  ){
				alert('作者不能为空');
				return false;
			} 
			if(undefined ==vm.infoQa.authorTitle || vm.infoQa.authorTitle == ''  ){
				alert('作者职称不能为空');
				return false;
			} 
			if(undefined == vm.infoQa.answerDetail || vm.infoQa.answerDetail == ''  ){
				alert('回答内容不能为空');
				return false;
			} 
			return true;
		}
	}
});