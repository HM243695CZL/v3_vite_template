## 系统后台管理模板
### 改造自项目【vue-next-admin】
<a href="https://lyt-top.gitee.io/vue-next-admin-preview/#/login" target="_blank">https://lyt-top.gitee.io/vue-next-admin-preview/#/login</a> 

- 改造动态添加路由功能

### 开发说明
 - el-tree、el-tree-select回显问题
   - 通过setCurrentKey进行回显 
   - `menuTreeRef.value.setCurrentKey(id)`
