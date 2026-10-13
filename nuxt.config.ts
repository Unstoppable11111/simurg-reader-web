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
  devtools: { enabled: false },// 关闭开发工具
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://www.sr-web-test.tata.org.cn:8082/api',
    }
  },
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/motion.css',
    '@/public/style/global.css',
    '@/assets/css/global.css'
  ],
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
    // 开启响应压缩，减少传输体积约 60-70%
    compressPublicAssets: true,
  },
  routeRules: {
    // 首页 ISR 缓存 10 分钟，避免每次请求都重新 SSR
    '/': { isr: 600 },
    // 静态资源永久缓存（Vite 会自动加 hash）
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Simurg Reader',
      meta: [
        { name: 'description', content: 'Simurg Reader - 在线小说阅读与创作平台' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
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
      transpile: ['@tinymce/tinymce-vue', 'tinymce'],
      // 生产环境移除 console.log，减少包体积和信息泄漏
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        }
      },
      // 代码分割：将大型依赖拆为独立 chunk，利用浏览器并行下载和缓存
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-three': ['three'],
            'vendor-tinymce': ['tinymce', '@tinymce/tinymce-vue'],
            'vendor-swiper': ['swiper'],
            'vendor-element': ['element-plus'],
          }
        }
      }
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
