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
    |—— author -- 作家专区组件
        |—— AuthorContainer.vue -- 作家专区容器
        |—— AuthorHome.vue -- 作家专区首页
        |—— AuthorInfo.vue -- 作者详情信息
        |—— WorkManagement.vue -- 作者作品管理
    |—— bookshelf -- 书架组件
        |—— BookShelfContent.vue -- 书架收藏书籍内容列表
        |—— FollowAndFansContent.vue -- 书架关注和粉丝内容列表
        |—— HistoryContent.vue -- 书架阅读历史记录
        |—— LeftNav.vue -- 书架左侧导航
    ├── home -- 小说网页首页组件内容
        ├── BookBanner.vue -- 首页轮播图组件
        |—— FeatureCard.vue -- 首页精选组件
        |—— BookCate.vue -- 首页分类组件
        |—— LastUpdateBook.vue -- 近期更新书籍组件
        |—— NewlySigned.vue -- 新书签约组件
        |—— Ranking.vue -- 排行榜组件
        |—— Recommend.vue -- 推荐组件
    ├── layout -- 布局相关组件
        ├── Header.vue -- 网页头部导航栏
        ├── Footer.vue -- 网页底部区域（版权、链接等）
    ├── search
        |——Search.vue -- 搜索组件
    |—— SvgIcon.vue -- svg图标组件
    
└── composables -- 组合式函数
    ├── useAuth.js -- 认证相关逻辑
└── pages -- 页面路由
    ├── index.vue -- 小说首页
    ├── login.vue -- 登录页面
    |—— footer-common.vue -- 底部通用组件
    ├── privacy-policy.vue -- 隐私政策页面
    └── author -- 作者相关页面
        ├── [authorId].vue -- 作者详情页面
        ├── index.vue -- 作家专区首页
        |—— writeBook.vue -- 写小说页面
    └── becomeAuthor -- 成为作者相关页面
        ├── index.vue -- 成为作者页面
    └── book -- 书籍相关页面
        ├── [bookId].vue -- 书籍详情页面
        ├── read.vue -- 阅读书籍页面
    └── bookcate -- 书籍分类相关页面
        ├── index.vue -- 书籍分类页面
    └── bookshelf -- 书架相关页面
        ├── index.vue -- 书架页面
    └── feedback -- 意见反馈相关页面
        ├── index.vue -- 意见反馈页面
    └── help -- 帮助中心
        ├── index.vue -- 帮助中心页面
    └── login -- 登录相关页面
        |—— callback.vue -- 登录回调页面
    └── ranking -- 排行榜相关页面
        ├── index.vue -- 排行榜页面
└── plugins -- 插件目录
    |—— api.js -- api接口封装
    |—— auth.js -- 认证相关接口
    |—— dict.js -- 字典接口
    |—— svg-icon.ts -- svg图标处理
    |—— svg-icons.client.ts -- svg图标处理
└── stores -- Pinia状态管理
    ├── user.js -- 用户相关状态
└── public -- 静态资源（图片、字体等）
    ├── images/ -- 图片
    ├── favicon.ico -- 网站首页logo
└── utils -- 工具类函数
    |—— api.js -- api接口封装
    |—— crypto.js -- 加密解密工具
    |—— dataFormatter.js -- 数据格式转换工具
    |—— resultUtils.js -- 结果集处理工具
```

### 运行项目

## pm2 start ecosystem.config.cjs 首次启动用这个命令，需要进到home目录，后续替换output，重启pm2，命令是pm2 restart all

## 许可证

[Apache License 2.0](https://github.com/macrozheng/mall-app-web/blob/master/LICENSE)

Copyright (c) 2020-2023 macrozheng