# simrug-reader-web

## 前言

该项目为simurg reader小说网页端

## 项目介绍

`simrug-reader-web`致力于提供最好的读书体验，为写作者打造最优秀的写作软件，为阅读者打造最优雅的阅读社区，“一千零一夜的故事正在被重写”是simurg reader的slogan

### 技术选型

| 技术        | 说明                                   | 官网                                        |
| ----------- | -------------------------------------- | ------------------------------------------- |
| Vue3        | 核心前端框架                           | https://cn.vuejs.org/                       |
| Pinia       | 状态管理                               | https://pinia.web3doc.top/introduction.html |
| Vite        | 前端构建工具，提供更快的冷启动和热更新 | https://cn.vitejs.dev/                      |
| nuxt3  | 文件系统路由，服务器渲染SSR，SEO优化                      | https://vite-pwa-org.netlify.app/frameworks/nuxt                   |
| elementplus | ui渲染框架                             | https://element-plus.org/zh-CN/             |

### 项目结构

``` lua
simurg-reader/
├── app.vue -- 应用入口，全局布局
└── pages -- 页面路由
    ├── index -- 小说首页
        ├── index -- 首页
    ├── book -- 书架
    ├── bookshelf -- 书架
    ├── ranking -- 排行榜
└── components -- 可复用组件封装
    ├── layout -- 布局相关组件
        ├── Header.vue -- 网页头部导航栏
        ├── Footer.vue -- 网页底部区域（版权、链接等）
    ├── home -- 首页专属组件
    ├── Search.vue -- 搜索组件
└── composables -- 组合式函数
    ├── useAuth.js -- 认证相关逻辑
└── stores -- Pinia状态管理
    ├── user.js -- 用户相关状态
└── public -- 静态资源（图片、字体等）
    ├── images/ -- 图片
    ├── favicon.ico -- 网站首页logo
└── plugins -- 插件（第三方库集成）
└── utils -- 工具类函数
```

## 许可证

[Apache License 2.0](https://github.com/macrozheng/mall-app-web/blob/master/LICENSE)

Copyright (c) 2020-2023 macrozheng