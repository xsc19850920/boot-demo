$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/banner/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'bannerId', index: 'banner_id', width: 50, key: true ,hidden:true},
            { label: '广告名称', name: 'title', index: 'title', width: 80}, 			
            { label: '广告位置', name: 'bannerCategory', index: 'banner_category', width:40 , formatter : function(value, options, row) {
            	return value === 1 ? '<span >首页轮播图</span>' :  '<span >妈妈知道</span>';
			}},		 //1首页 2妈妈知道	
            { label : '广告图片', name : 'imagePath', index:'image_path',width : 40, formatter : function(value, options, row) {
				 return '<img class="img-thumbnail" style="width: 60px;height: 60px;" src="' + value + '" >';
			}},
            { label: '时间', name: 'endTime',index:'end_time', width: 120, formatter: function(value, options, row){
				return '<p>开始时间:'+row.startTime+'</p><p>结束时间:'+value+'</p>';
			} },
			{ label: '上线/下线', name: 'stateType', index: 'state_type', width: 40, formatter: function(value, options, row){
				return value === 0 ? "<a onclick='vm.upordown(\""+row.bannerId+"\",\""+1+"\")'>上线</a>" :  "<a onclick='vm.upordown(\""+row.bannerId+"\",\""+0+"\")'>下线</a>" ;
			}},
			{ label: '点击次数', name: 'viewQty', index: 'view_qty', width: 40 ,sortable:false}, 
			{ label: '操作', name: 'opt',  width: 80},
			
//			{ label: '添加时间', name: 'createTime', index: 'create_time', width: 80 }, 			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作ip', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户id', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: 'url链接', name: 'urlLink', index: 'url_link', width: 80 }, 			
//			{ label: '类型', name: 'bannerType', index: 'banner_type', width: 80 }, 			
//			{ label: '类型id', name: 'bannerTypeId', index: 'banner_type_id', width: 80 }, 			
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
        	var ids = $("#jqGrid").jqGrid('getDataIDs');
	        for (var i = 0; i < ids.length; i++) {
	          var id = ids[i];
	          var rowData = "";
	          var editBtn = "<a onclick='vm.getInfo(\""+ id +"\")'>编辑</a>  ";
//	          var topBtn = "<a onclick='vm.top(\""+ id +"\")'>置顶</a>  ";
	          var delBtn = "<a onclick='vm.del(\""+ id +"\")'>删除</a>  ";
	          if(hasPermission('banner:update')){
	        	  rowData += editBtn;
	          }
//	          if(hasPermission('banner:top')){
//	        	  rowData += topBtn;
//	          }
	          if(hasPermission('banner:info')){
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
            	layer.closeAll('loading');
                alert('只支持jpg、png、gif格式的图片！');
                return false;
            }
        },
        onComplete : function(file, r){
            layer.closeAll('loading');
            if(r.code == 0){
            	vm.banner.imagePath = r.src;
            	$('#uploadImg').attr("src",vm.banner.imagePath);
            }else{
                alert(r.msg);
            }
        }
    });
    
    
    $('.form_time').datetimepicker({
        minView: "month", //选择日期后，不会再跳转去选择时分秒 
        language:  'zh-CN',
        format: 'yyyy-mm-dd',
        todayBtn:  1,
        autoclose: 1,
    });
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		banner: {},
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
			vm.banner = {};
		},
		update: function (event) {
			var bannerId = getSelectedRow();
			if(bannerId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(bannerId)
		},
		saveOrUpdate: function (event) {
			vm.banner.startTime= $('#startTime').val();
			vm.banner.endTime= $('#endTime').val() + " 23:59:59";
			if(vm.validate()){
				var url = vm.banner.bannerId == null ? "/banner/save" : "/banner/update";
				$.ajax({
					type: "POST",
					url: baseURL + url,
					contentType: "application/json",
					data: JSON.stringify(vm.banner),
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
			//var bannerIds = getSelectedRows();
			//if(bannerIds == null){
				//return ;
			//}
			var idsArr = [];
			idsArr.push(id);
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/banner/delete",
                    contentType: "application/json",
				    //data: JSON.stringify(bannerIds),
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
		getInfo: function(bannerId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/banner/info/"+bannerId, function(r){
                vm.banner = r.banner;
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
		top :function(id){
			alert('字段不明确');
//			var updateObj = {};
//			updateObj.bannerId = id;
//			$.ajax({
//				type: "POST",
//			    url: baseURL + "/banner/update",
//                contentType: "application/json",
//			    //data: JSON.stringify(bannerIds),
//			    data: JSON.stringify(updateObj),
//			    success: function(r){
//					if(r.code == 0){
//						alert('操作成功', function(index){
//							$("#jqGrid").trigger("reloadGrid");
//						});
//					}else{
//						alert(r.msg);
//					}
//				}
//			});
		},
		upordown:function(bannerId,stateType){
			var updateObj = {};
			updateObj.bannerId = bannerId;
			updateObj.stateType = stateType;
			console.info(updateObj);
			$.ajax({
				type: "POST",
			    url: baseURL + "/banner/update",
                contentType: "application/json",
			    //data: JSON.stringify(bannerIds),
			    data: JSON.stringify(updateObj),
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
		},
		validate:function(){
			if(undefined ==vm.banner.title || vm.banner.title == ''  ){
				alert('广告名称不能为空');
				return false;
			} 
			if(undefined ==vm.banner.bannerCategory || vm.banner.bannerCategory == ''  ){
				alert('广告位置不能为空');
				return false;
			} 
			if(undefined ==vm.banner.displayOrder || vm.banner.displayOrder == ''  ){
				alert('顺序不能为空');
				return false;
			}
			if(undefined ==vm.banner.startTime || vm.banner.startTime == ''  ){
				alert('开始时间不能为空');
				return false;
			}
			if(undefined ==vm.banner.endTime || vm.banner.endTime == ''  ){
				alert('结束时间不能为空');
				return false;
			}
			if(undefined ==vm.banner.imagePath || vm.banner.imagePath == ''  ){
				alert('广告图片不能为空');
				return false;
			}
			if(undefined ==vm.banner.urlLink || vm.banner.urlLink == ''  ){
				alert('广告连接不能为空');
				return false;
			}
			return true;
		}
		
	}
});