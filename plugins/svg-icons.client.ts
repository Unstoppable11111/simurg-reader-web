// plugins/svg-icon.client.ts（逐行复制）
import { defineNuxtPlugin } from '#app'
if (process.client) {
  import('virtual:svg-icons-register')
}
import SvgIcon from '~/components/SvgIcon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SvgIcon', SvgIcon)
})