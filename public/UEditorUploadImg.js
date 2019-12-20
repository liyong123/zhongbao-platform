//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath(){
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/uimcardprj
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return(localhostPaht+projectName);
}


UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function(action){
	//调用自己写的Controller
	if(action == 'uploadimage' || action == 'uploadfile'){
		return getRootPath()+"/expertWorkbench/uploadImage"; //自己controller的action
	}else{
		return this._bkGetActionUrl.call(this,action);//百度编辑器默认的action
	}
}



