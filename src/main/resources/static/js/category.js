var vm = new Vue({
    el:'#rrapp',
    data:{
        showList: true,
        title: null,
        selectDate:null,
        menu:{
            parentName:null,
            parentId:0,
            type:1,
            orderNum:0
        }
    },
    methods: {
        getMenu: function(menuId){
            //加载菜单树
            $.get(baseURL + "sys/menu/select", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                var node = ztree.getNodeByParam("menuId", vm.menu.parentId);
                ztree.selectNode(node);

                vm.menu.parentName = node.name;
            })
        },
        add: function(){
            if($('.tree tr.success').length <= 0){
            	 alert("请选择一条记录");
                 return false;
            }
//            vm.showList = false;
            vm.title = "新增";
            console.info($('.tree tr.success').attr('id'));
//            vm.menu = {parentName:null,parentId:0,type:1,orderNum:0};
//            vm.getMenu();
        },
        update: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            $.get(baseURL + "sys/menu/info/"+menuId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.menu = r.menu;

                vm.getMenu();
            });
        },
        del: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/menu/delete",
                    data: "menuId=" + menuId,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.menu.menuId == null ? "sys/menu/save" : "sys/menu/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.menu),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        reload: function () {
            vm.showList = true;
            Menu.table.refresh();
        },
		initTreeGrid : function(r) {
			$('.tree').html('<tr ><td><b>分类名称</b></td><td><b>二级标题</b></td><td><b>显示顺序</b></td></tr>');
			for (var i = 0; i < r.length; i++) {
				var item = r[i];
				debugger;
				if($('.treegrid-'+item.parentId,$('.tree')).length > 0){
					$('.treegrid-'+item.parentId,$('.tree')).after('<tr id="'+item.categoryId+'" class="treegrid-parent-' + item.parentId + '"><td>' + item.title + '</td> <td class="hidden-xs">' +item.subTitle + '</td><td class="hidden-xs">' + item.displayOrder + '</td></tr>');
				}else{
					$('.tree').append('<tr id="'+item.categoryId+'" class="treegrid-' + item.categoryId + '"> <td>' + item.title + '</td> <td class="hidden-xs">' + item.subTitle + '</td><td class="hidden-xs">' + item.displayOrder + '</td></tr>');
				}
			}
			//event 
			$('.tree tr').mouseup(function(){
				$('.tree tr').removeClass("success");
				$(this).addClass("success");
			})
		}
    }
});


$(function(){
	 $.get(baseURL + "/category_list", function(r){
		 vm.initTreeGrid(r);
		 $('.tree').treegrid({
             expanderExpandedClass: 'glyphicon glyphicon-minus',
             expanderCollapsedClass: 'glyphicon glyphicon-plus'
         });
     })
});






function getMenuId () {
    var selected = $('#menuTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return false;
    } else {
        return selected[0].id;
    }
}



