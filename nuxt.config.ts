// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path'; // 必须导入 path 模块
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: true },
  css: ['@/public/style/global.css'],
  // postcss: {
  //   plugins: {
  //     'postcss-px-to-viewport': {
  //       unitToConvert: 'px',
  //       viewportWidth: 1920,
  //       viewportHeight: 1080,
  //       unitPrecision: 5,
  //       propList: ['*'],
  //       viewportUnit: 'vw',
  //       fontViewportUnit: 'vw',
  //       selectorBlackList: [],
  //       minPixelValue: 1,
  //       mediaQuery: false
  //     },
  //     autoprefixer: {}
  //   }
  // },
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'theme-chalk',
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Simurg Reader',
      meta: [
        { name: 'simurg reader', content: '小说网页阅读器' }
      ]
    }
  },
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // 🚨 添加 SVG 插件配置
      createSvgIconsPlugin({
        // 1. 指定你的 SVG 图标所在的目录路径
        iconDirs: [path.resolve(process.cwd(), 'assets/icons/svg')], 
        // 请根据你的项目结构调整 'assets/icons/svg' 这个路径，确保它指向你的 .svg 文件

        // 2. 指定生成的 symbolId 格式
        symbolId: 'icon-[dir]-[name]',
        
        // 3. 注入方式（Nuxt 项目推荐使用 'body'）
        inject: 'body', 
        customDomId: '__svg__icons__dom__',
      }),
    ],
    build: {
      transpile: ['@tinymce/tinymce-vue', 'tinymce']
    }
  },
  hooks: {
    'pages:extend': (pages) => {
      // 检查是否已存在该路由，避免重复添加
      const exists = pages.some(page => page.path === '/login/callback')
      if (!exists) {
        pages.push({
          name: 'login-callback',
          path: '/login/callback',
          file: '~/pages/login/callback.vue'
        })
      }
    }
  }
})