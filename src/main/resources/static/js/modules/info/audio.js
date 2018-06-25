$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/info/audio/list',
        datatype: "json",
        colModel: [			
            { label: '编号', name: 'infoAudioId', index: 'info_audio_id', width: 50, key: true,hidden:true },
            { label: '标题', name: 'title', index: 'title', width: 60 }, 			
            { label: '封面图片', name: 'cloudUrl',index: 'cloud_url', width: 30, formatter: function(value, options, row){
                    return '<img class="img-thumbnail" style="width: 60px;height: 60px;" src="'+value+'" >';
            } },
			{ label: '音频时长', name: 'durationText', index: 'duration_text', width: 40 }, 			
			{ label: '发布时间', name: 'createTime', index: 'create_time', width: 120 }, 	
			{ label: '相关', name: 'favoriteQty',index: 'favorite_qty', width: 40 ,sortable:false, formatter: function(value, options, row){
				return '<p>收藏:'+value+'</p><p>已听:'+row.playQty+'</p>';
			} },
			{ label: '操作', name: 'opt',  width: 80,sortable:false},
			
			
//			{ label: '更新时间', name: 'modifyTime', index: 'modify_time', width: 80 }, 			
//			{ label: '操作IP(保留0)', name: 'operIp', index: 'oper_ip', width: 80 }, 			
//			{ label: '操作用户ID', name: 'operUserId', index: 'oper_user_id', width: 80 }, 			
//			{ label: '删除标识', name: 'delFlag', index: 'del_flag', width: 80 }, 			
//			{ label: '信息分类 : 1早安童诗 2晚安故事 3古文小故事 4特色绘本', name: 'infoType', index: 'info_type', width: 80 }, 			
//			{ label: '文件路径', name: 'fileSrc', index: 'file_src', width: 80 }, 			
//			{ label: '音视频秒数文本 : 01:10:20', name: 'durationText', index: 'duration_text', width: 80 }, 			
//			{ label: '置顶标识', name: 'flagTop', index: 'flag_top', width: 80 }, 			
//			{ label: '收藏次数', name: 'favoriteQty', index: 'favorite_qty', width: 80 }, 			
//			{ label: '收听次数', name: 'playQty', index: 'play_qty', width: 80 }, 			
//			{ label: '状态类型 : 0未处_无效 1已处_有效', name: 'stateType', index: 'state_type', width: 80 }			
        ],
		viewrecords: true,
		height: 'auto',
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
//        multiselect: true,
        caption:"音频列表",
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
	          if(hasPermission('info:audio:update')){
	        	  rowData += editBtn;
	          }
	          if(hasPermission('info:audio:info')){
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
            	vm.infoAudio.cloudUrl = r.src;
            	$('#uploadImg').attr('src',vm.infoAudio.cloudUrl);
            	$('#infoAudioCloudUrl').val(vm.infoAudio.cloudUrl);
            }else{
                alert(r.msg);
            }
        }
    });
    
    
    
    new AjaxUpload('#uploadAudio', {
        action: baseURL + '/sys/attachment/upload?X-Token=' + token,
        name: 'file',
        autoSubmit:true,
        responseType:"json",
        onSubmit:function(file, extension){
            layer.load(2);
            if (!(extension && /^(mp3|wma)$/.test(extension.toLowerCase()))){
                alert('只支持mp3，wma格式的音频！');
                layer.closeAll('loading');
                return false;
            }
        },
        onComplete : function(file, r){
            layer.closeAll('loading');
            if(r.code == 0){
            	vm.infoAudio.fileSrc = r.src;
            	$('#play').show();
            	$('#audioFileSrc').val(vm.infoAudio.fileSrc);
            }else{
                alert(r.msg);
            }
        }
    });
    
//    $('.radio-inline').click(function(){
//    	var infoTypeValue = $("input[name='infoTypeRadio']").filter(':checked').val();
//    	var page = $("#jqGrid").jqGrid('getGridParam','page');
//		$("#jqGrid").jqGrid('setGridParam',{ 
//			  datatype: "json",
//			  postData:{'infoTypeValue': infoTypeValue},
//            page:page
//       }).trigger("reloadGrid");
//    });
    
});

var vm = new Vue({
	el:'#rapp',
	data:{
		showList: true,
		title: null,
		infoAudio: {},
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
			vm.infoAudio = {};
		},
		update: function (event) {
			var infoAudioId = getSelectedRow();
			if(infoAudioId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(infoAudioId)
		},
		saveOrUpdate: function (event) {
			if(vm.validate()){
				var url = vm.infoAudio.infoAudioId == null ? "/info/audio/save" : "/info/audio/update";
				if(!vm.infoAudio.cloudUrl ){
	            	vm.infoAudio.cloudUrl = baseURL + '/image/upload.jpg'
	            }
				$.ajax({
					type: "POST",
				    url: baseURL + url,
	                contentType: "application/json",
				    data: JSON.stringify(vm.infoAudio),
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
				    url: baseURL + "/info/audio/delete",
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
		getInfo: function(infoAudioId){
			vm.showList = false;
			vm.title = "编辑修改";
			$.get(baseURL + "/info/audio/info/"+infoAudioId, function(r){
                vm.infoAudio = r.infoAudio;
                if(vm.infoAudio.fileSrc != baseURL + '/image/upload.jpg'){
                	$('#play').show();
                } 
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
		play : function(){
			window.open(vm.infoAudio.fileSrc);
		},
		changeAudioType:function(infoTypeValue){
	    	var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				  datatype: "json",
				  postData:{'infoTypeValue': infoTypeValue},
	            page:page
	       }).trigger("reloadGrid");
		},
		validate:function(){
			if(undefined ==vm.infoAudio.infoType || vm.infoAudio.infoType == ''  ){
				alert('音频分类不能为空');
				return false;
			} 
			if(undefined ==vm.infoAudio.title || vm.infoAudio.title == ''  ){
				alert('音频标题不能为空');
				return false;
			} 
			if(undefined ==vm.infoAudio.cloudUrl || vm.infoAudio.cloudUrl == ''  ){
				alert('音频图片不能为空');
				return false;
			}
			if(undefined == vm.infoAudio.fileSrc || vm.infoAudio.fileSrc == ''  ){
				alert('音频不能为空');
				return false;
			} 
			if(undefined == vm.infoAudio.durationText || vm.infoAudio.durationText == '' ){
				alert('音视时长不能为空');
				return false;
			}else if(!(/(\d{0,2}时){0,1}(\d{0,2}分){0,1}(\d{0,2}秒)/.test(vm.infoAudio.durationText)) && !(/\d{1,2}:\d{1,2}:\d{1,2}/.test( vm.infoAudio.durationText)) ){
				alert('音视时长格式不正确');
				return false;
			}
			
			return true;
		}
	}
});