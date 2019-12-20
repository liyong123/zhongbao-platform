
# yunji-platform
解放号云集平台--采购商、专家、供应商通过管理平台查看、审核项目，完成招标、投标。
##开发指引

安装项目： `yarn install`

启动项目： `yarn run start`

开发工具：

&nbsp;&nbsp;&nbsp;安装工具：`npm i -g honey-toolkit@latest`

&nbsp;&nbsp;&nbsp;创建普通页面：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置模板：`honey config template` (设置为'./templates/page')

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建页面：`honey create page`

&nbsp;&nbsp;&nbsp;创建列表（表格）页面：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置模板：`honey config template` (设置为'./templates/listPage')

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建页面：`honey create page`

&nbsp;&nbsp;&nbsp;删除页面及其路由：`honey delete page`

&nbsp;&nbsp;&nbsp;创建组件：`honey create component`

<br/>
关于改变 Redux 状态树：  
  
    someHandler = () => {
      this.props.commonAction(
        { someState: someValue},
        'actionName', // 可选
       );
    }  

<br/>
关于路由嵌套：（一般情况优先使用 Layout 模式，不使用嵌套）  

&nbsp;&nbsp;&nbsp;路由配置设置 children 嵌套; 父级 render 时渲染 children 即可。如：

    render(){
      return <div>{children}</div>;
    }  

关于接口重复调用：

    	someHandler = () => {
    		this.query.fetch(); //重复请求
    	}

    	render() {
    		<Query url="someurl" onRef={query => {this.query = query}} />
    	}

