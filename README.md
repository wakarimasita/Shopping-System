# 数据库大作业-更新日志

## 1106范碧珂
### 增加
- 在element.js里import了很多element，之后应该会用到
- My.vue里简单的一个侧边显示的Container，预计之后不会用到Home.vue和Message.vue了。。。

## 1104范碧珂
### 增加
- 增加了发送验证码按钮的触发事件（向后端发送邮箱/login.vue）
- 增加Home.vue，作为登陆后的页面（暂时用一个按钮跳转，现在上面还什么都没有...）

## 1031徐京洲
### 增加
- 增加了api文件夹
- 增加了接口文档(/src/api/接口文档.md)
- 增加了登录信息处理页面，但还有一些问题
- 增加了vue.config.js文件，在其中进行了代理设置
- 增加了邮件发送功能

### 修复
- 修复了http请求错误码500问题(/vue.config.js)

### 删除
- 在github中删除了vue.global.js,并将其加入了.gitignore中

### 其他
- **如果大家第一次拉取这些文件的时候看到了这个，这说明你的仓库中没有vue.global.js文件，请下载它并放到/src下(和App.vue同级)**
- [下载地址](http://60.205.226.43/repo/vue.global.js)
- **请大家在本次pull之后更改vue.config.js中的内容，并将这个文件加入到.gitignore文件中**
- 更改方法见vue.config.js中的注释
- 加入方法为在.gitignore中写上vue.config.js

