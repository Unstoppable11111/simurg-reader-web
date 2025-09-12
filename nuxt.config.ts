// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: true },
  css: ['@/public/style/global.css'],
  modules: [
    '@element-plus/nuxt',
  ],
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'theme-chalk',
  },
  // postcss: {
  //   plugins: {
  //     'postcss-px-to-viewport': {
  //       viewportWidth: 1920, // 设计稿宽度
  //       viewportUnit: 'vw', // 转换为 vw
  //       unitPrecision: 5, // 保留小数位数
  //       selectorBlackList: [], // 不转换的选择器
  //       minPixelValue: 1, // 小于 1px 不转换
  //       mediaQuery: false // 不处理媒体查询中的 px
  //     }
  //   }
  // }
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