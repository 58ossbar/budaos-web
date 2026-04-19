# 前端架构

开发环境
IDE : VS Code 1.27

NODE: Node 10.15.x

NPM : NPM 6.4.x

…

技术选型
前端框架：Vue 2.x

页面组件：Element 2.x

状态管理：Vuex 2.x

后台交互：axios 0.18.x

图标使用：Font Awesome 4.x

…

项目结构
budaos-platform-ui

-- build：项目编译相关模块，项目模板自动生成

-- config：项目配置相关模块，项目模板自动生成

-- src：项目源码模块，前端开发工作集中在此目录

 -- assets： 图标、字体、国际化信息等静态信息

 -- components： 组件库，对常用组件进行封装

 -- http： 后台交互模块，统一后台接口请求API

 -- i18n： 国际化模块，使用Vue i18n进行国际化

 -- mock： Mock模块，模拟接口调用并返回定制数据

 -- permission： 权限控制模块，处理权限认证逻辑

 -- router： 路由管理模块，负责页面各种路由配置

 -- store： 状态管理模块，提供组件间状态共享

 -- utils： 工具模块，提供一些通用的工具方法

 -- views： 页面模块，主要放置各种页面视图组件

# 组件文档

## 字典组件

- 作为查询条件时使用

  ```vue
  <cb-dict
    name="state"
    dict="teacher_state"
    type="select"
    empty-label="全部"
    placeholder="教师状态"
    :filters="filters"
    :change="findPage"
  />
  ```



- 作为表单录入时使用



## 树形组件

- 作为查询条件时使用

  示例代码如下

```vue
                  <cb-tree
                    url="/api/sys/role/orgTree"
                    name="orgId"
                    prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"
                    default-expanded-level="1"
                    placeholder="请选择所属院校"
                    :parent-vue="_self"
                    :filters="filters"
                    :change="findPage"
                  />
```

