import { defineNuxtPlugin } from '#app'
import SvgIcon from '~/components/SvgIcon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 注册全局组件 SvgIcon（Nuxt3 中全局注册推荐用插件方式）
  nuxtApp.vueApp.component('SvgIcon', SvgIcon)

  // 可选：添加运行时配置（比如自定义 SVG 目录）
  nuxtApp.provide('svgIconConfig', {
    iconDir: '/assets/icons', // 默认图标目录
  })
})