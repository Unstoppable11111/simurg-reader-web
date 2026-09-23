// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },// 关闭开发工具
  css: ['@/public/style/global.css', '@/assets/css/global.css'],
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
    // prerender: {
    //   routes: ['/'] // 预渲染根路径
    // }
  },
  cache: {
    enabled: false  // 关闭 Nuxt 缓存
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Simurg Reader',
      meta: [
        { name: 'description', content: 'Simurg Reader - 在线小说阅读与创作平台' }
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
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'public/icon')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: false // 关闭优化，减少解析错误
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