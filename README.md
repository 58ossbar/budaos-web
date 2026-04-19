# BudaOS Frontend

<div align="center">

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-2.6-green.svg)](https://vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element%20UI-2.13-brightgreen.svg)](https://element.eleme.cn/)
[![Webpack](https://img.shields.io/badge/Webpack-3.6-orange.svg)](https://webpack.js.org/)

**BudaOS Frontend** 是布道师学习平台的前端项目集合，包含教学门户和教务管理两大子系统。

*配套 BudaOS Monolith 后端 | 100% 源代码开放*

</div>

---

## 项目概览

BudaOS Frontend 包含两个独立部署的前端应用：

| 项目 | 名称 | 说明 | 端口 |
|------|------|------|------|
| `budaos-evgl-web` | 布道师学习通 | 面向学生/教师的教学门户 | 8888 |
| `budaos-mgr-web` | 教务管理端 | 后台管理系统 | 8889 |

### 技术栈

| 类别 | 技术选型 |
|------|----------|
| 核心框架 | Vue 2.6 + Vue Router 3 + Vuex 3 |
| UI 组件库 | Element UI 2.13 |
| HTTP 客户端 | Axios |
| 富文本编辑 | TinyMCE 5 / Quill |
| 构建工具 | Webpack 3 |
| 样式预处理 | Sass/SCSS |
| 代码规范 | ESLint |
| 图表库 | ECharts / v-charts |
| 地图组件 | Vue Baidu Map |

---

## 项目结构

```
budaos-web/
├── budaos-evgl-web/              # 布道师学习通（教学门户）
│   ├── build/                    # Webpack 构建配置
│   ├── config/                   # 环境配置
│   ├── src/
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 公共组件
│   │   ├── http/                # API 请求封装
│   │   │   ├── api.js           # API 接口定义
│   │   │   ├── axios.js         # Axios 配置
│   │   │   └── config.js        # 请求配置
│   │   ├── mock/                # Mock 数据
│   │   ├── router/              # 路由配置
│   │   ├── store/               # Vuex 状态管理
│   │   ├── utils/               # 工具函数
│   │   ├── views/               # 页面组件
│   │   ├── App.vue              # 根组件
│   │   └── main.js              # 入口文件
│   └── package.json
│
├── budaos-mgr-web/              # 教务管理端
│   ├── build/                    # Webpack 构建配置
│   ├── config/                   # 环境配置
│   ├── src/
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 公共组件
│   │   ├── http/                # API 请求封装
│   │   ├── i18n/                # 国际化配置
│   │   ├── mock/                # Mock 数据
│   │   ├── permission/          # 权限控制
│   │   ├── router/              # 路由配置
│   │   ├── store/               # Vuex 状态管理
│   │   ├── utils/               # 工具函数
│   │   ├── views/               # 页面组件
│   │   ├── App.vue              # 根组件
│   │   └── main.js              # 入口文件
│   └── package.json
│
└── README.md
```

---

## 核心功能

### 布道师学习通 (budaos-evgl-web)

- **首页门户**：课程推荐、新闻动态、博客文章
- **教学中心**：课堂管理、课程学习、作业提交
- **活动中心**：签到、头脑风暴、投票问卷、在线测试
- **资源中心**：课程资源、云盘文件管理
- **社区互动**：博客论坛、好友系统、学习圈
- **个人中心**：个人信息、学习记录、我的书架
- **即时通讯**：私信聊天、群组讨论

### 教务管理端 (budaos-mgr-web)

- **系统管理**：用户管理、角色权限、菜单配置
- **教学管理**：专业管理、教材管理、课程管理
- **班级管理**：班级设置、学生管理、成绩管理
- **资源管理**：站点资源、素材管理
- **问答中心**：题库管理、试卷管理
- **数据统计**：多维度数据看板

---

## 快速开始

### 环境要求

| 软件 | 版本要求 |
|------|----------|
| Node.js | >= 6.0.0 (推荐 12+) |
| npm | >= 3.0.0 (推荐 6+) |

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/budaos/budaos-web.git
cd budaos-web

# 安装学习通前端依赖
cd budaos-evgl-web
npm install

# 或安装管理端依赖
cd ../budaos-mgr-web
npm install
```

> 💡 **提示**：推荐使用 yarn 或 cnpm 安装依赖以提高速度

### 开发环境启动

```bash
# 启动学习通前端
cd budaos-evgl-web
npm run dev

# 或启动管理端
cd budaos-mgr-web
npm run dev
```

启动后访问：
- 学习通：http://localhost:8888
- 管理端：http://localhost:8889

### 生产环境构建

```bash
# 学习通构建
cd budaos-evgl-web
npm run build:prod

# 管理端构建
cd budaos-mgr-web
npm run build:prod
```

---

## 配置说明

### API 地址配置

**学习通** (`budaos-evgl-web/config/index.js`)：

```javascript
const API_TARGET = process.env.API_TARGET || 'http://localhost:9080'
```

**管理端** (`budaos-mgr-web/config/index.js`)：

```javascript
const BASE_API = process.env.BASE_API || 'http://localhost:9080'
```

### 环境配置

| 环境 | 命令 | 说明 |
|------|------|------|
| 开发环境 | `npm run dev` | 使用 dev 环境配置 |
| 测试环境 | `npm run build:test` | 使用 test 环境配置 |
| 生产环境 | `npm run build:prod` | 使用 prod 环境配置 |

### 代理配置

项目已配置 API 代理，开发环境下请求会自动转发到后端服务器：

```javascript
// 学习通代理路径
const apiPaths = [
  '/evgl', '/login-api', '/classroom-api',
  '/managementPanel-api', '/pkginfo-api',
  '/resourceCenter-api', '/examCenter-api',
  // ... 更多路径
]
```

---

## 目录规范

### 组件开发规范

```
src/
├── components/                   # 公共组件
│   ├── common/                   # 通用组件
│   │   └── MyComponent.vue
│   └── business/                 # 业务组件
│       └── BizComponent.vue
│
├── views/                        # 页面组件
│   ├── moduleName/               # 按模块分组
│   │   ├── List.vue              # 列表页
│   │   ├── Detail.vue            # 详情页
│   │   └── Edit.vue              # 编辑页
│   └── index.vue
│
└── http/                         # 接口请求
    └── modules/                  # 按模块管理接口
        ├── user.js
        └── order.js
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `UserInfo.vue` |
| 工具函数 | camelCase | `formatDate.js` |
| 样式类名 | kebab-case | `.user-info` |
| 常量 | UPPER_SNAKE_CASE | `MAX_COUNT` |

---

## 主要依赖

### 学习通依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | 2.6.11 | 核心框架 |
| element-ui | 2.13.2 | UI 组件库 |
| vue-router | 3.5.1 | 路由管理 |
| vuex | 3.5.1 | 状态管理 |
| axios | 0.19.0 | HTTP 客户端 |
| echarts | 4.8.0 | 图表库 |
| tinymce | 5.2.2 | 富文本编辑器 |
| vue-cropper | 0.5.6 | 图片裁剪 |
| screenfull | 4.2.1 | 全屏切换 |
| v-charts | 1.19.0 | 可视化图表 |

### 管理端依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | 2.5.2 | 核心框架 |
| element-ui | 2.9.1 | UI 组件库 |
| vue-router | 3.0.1 | 路由管理 |
| vuex | 3.0.1 | 状态管理 |
| axios | 0.18.0 | HTTP 客户端 |
| vue-i18n | 8.0.0 | 国际化 |
| quill | 1.3.6 | 富文本编辑器 |

---

## 开发指南

### 新增页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.js` 中配置路由
3. 添加权限标识（如需要）

```javascript
// router/index.js
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/index'),
  meta: { title: '示例页面', requireAuth: true }
}
```

### 新增 API 接口

```javascript
// http/modules/example.js
import axios from '@/http/axios'

export function getList(params) {
  return axios({
    url: '/evgl/example/list',
    method: 'get',
    params
  })
}

export function save(data) {
  return axios({
    url: '/evgl/example/save',
    method: 'post',
    data
  })
}
```

### 新增组件

```vue
<template>
  <div class="my-component">
    <!-- 组件内容 -->
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.my-component {
  // 样式
}
</style>
```

---

## 常见问题

### Q: npm install 失败？

**解决方案**：
1. 清除缓存：`npm cache clean --force`
2. 使用淘宝镜像：`npm install --registry=https://registry.npmmirror.com`
3. 或使用 yarn：`yarn install`

### Q: 跨域问题？

项目已配置开发服务器代理，生产环境需配置 Nginx 反向代理：

```nginx
location /evgl {
    proxy_pass http://backend-server:9080;
}
```

### Q: 如何添加新的环境配置？

1. 创建环境文件：`config/env.xxx.js`
2. 在 `package.json` 添加构建命令
3. 在 Webpack 配置中添加对应的环境变量

---

## 与后端配合

本前端项目配套 [BudaOS Monolith](https://github.com/budaos/budaos-monolith) 后端使用：

| 前端端口 | 后端端口 | 说明 |
|----------|----------|------|
| 8888 | 9080 | 学习通 |
| 8889 | 9080 | 管理端 |

部署时需确保：
1. 后端服务已启动
2. API 地址配置正确
3. 跨域配置已开启

---

## 开源协议

本项目采用 [Apache License 2.0](LICENSE) 开源协议。

---

## 相关项目

| 项目 | 说明 |
|------|------|
| [BudaOS Monolith](https://github.com/budaos/budaos-monolith) | 后端单体架构 |
| [BudaOS Mini Program](https://github.com/budaos/budaos-miniprogram) | 微信小程序端 |

---

<div align="center">

**如果这个项目对您有帮助，欢迎 Star！**

</div>
