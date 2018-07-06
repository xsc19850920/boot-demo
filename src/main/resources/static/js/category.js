var vm = new Vue({
	el : '#rrapp',
	data : {
		showList : true,
		title : null,
		selectDate : null,
		menu : {
			parentName : null,
			parentId : 0,
			type : 1,
			orderNum : 0
		}
	},
	methods : {
		reload : function() {
			vm.showList = true;
			$.get(baseURL + "/category_list", function(r) {
				$.fn.zTree.init($("#treeDemo"), setting, r);
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				zTree.expandAll(true);
			})
		},
		beforeRemove:function(treeId, treeNode) {
			confirm("确认删除 分类 -- " + treeNode.name + " 及其所有子分类吗？", function() {
				$.post('category_del', {
					id : treeNode.id
				}, function(r) {
					vm.reload();
				}, 'json');
			});
		},
		beforeDrag:function(treeId, treeNodes) {
			return false;
		},
		beforeRename :function(treeId, treeNode, newName, isCancel) {
			if (newName.length == 0) {
				alert("分类名称不能为空.");
				return false;
			}
//			if (newName.split(' - ').length < 2) {
//				
//				alert("标题，二级标题都不能为空.");
//				return false;
//			}
			$.post('category_update', {
				id : treeNode.id,
//				title : newName.split(' - ')[0],
//				subTitle : newName.split(' - ')[1],
				title : newName,
				subTitle : "",
				lvl : treeNode.level +1,
				parentId:treeNode.pId,
			}, function(r) {
				vm.reload();
			}, 'json');
			return true;
		},
		addHoverDom:function(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0 || treeNode.level == 2)
				return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
					+ "' title='新增' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_" + treeNode.tId);
			if (btn)
				btn.bind("click", function() {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.addNodes(treeNode, {
						id : null,
						pId : treeNode.id,
//						name : "标题 - 二级标题"
						name : "新分类"
					});
					return false;
				});
		},
		removeHoverDom:function(treeId, treeNode) {
			$("#addBtn_" + treeNode.tId).unbind().remove();
		},
		 showRemoveBtn:function(treeId, treeNode) {
			// return !treeNode.isFirstNode;
			return treeNode != 0;
		},
		 showRenameBtn:function(treeId, treeNode) {
			// return !treeNode.isLastNode;
			return treeId != 0;
		}
	}
});
var setting = {
	view : {
		addHoverDom : vm.addHoverDom,
		removeHoverDom : vm.removeHoverDom,
		selectedMulti : false,
		showIcon : false
	},
	edit : {
		enable : true,
		editNameSelectAll : true,
		showRemoveBtn : vm.showRemoveBtn,
		showRenameBtn : vm.showRenameBtn
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		beforeDrag : vm.beforeDrag,
//		beforeEditName : beforeEditName,
		beforeRemove : vm.beforeRemove,
		beforeRename : vm.beforeRename,
//		onRemove : onRemove,
//		onRename : onRename
	}
};

// var zNodes =[
// { id:1, pId:0, name:"父节点 1", open:true},
// { id:11, pId:1, name:"叶子节点 1-1"},
// { id:12, pId:1, name:"叶子节点 1-2"},
// { id:13, pId:1, name:"叶子节点 1-3"},
// { id:2, pId:0, name:"父节点 2", open:true},
// { id:21, pId:2, name:"叶子节点 2-1"},
// { id:22, pId:2, name:"叶子节点 2-2"},
// { id:23, pId:2, name:"叶子节点 2-3"},
// { id:3, pId:0, name:"父节点 3", open:true},
// { id:31, pId:3, name:"叶子节点 3-1"},
// { id:32, pId:3, name:"叶子节点 3-2"},
// { id:33, pId:3, name:"叶子节点 3-3"}
// ];


$(function() {
	vm.reload();

});
