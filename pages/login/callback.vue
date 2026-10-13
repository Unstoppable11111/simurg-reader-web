<template>
  <div class="callback-page">
    <p style="color: #fff;">登录中...</p>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { API_ENDPOINTS } from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { setAuthCookies } = useAuth()

onMounted(async () => {
  // 从 URL 中获取 Google 返回的授权码（code 参数）
  console.log("回调参数",route.query);
  const code = route.query.code
  const state = route.query.state
  if (!code) {
    ElMessage.error('登录失败：未获取到授权码')
    router.push('/login')
    return
  }

  try {
    // 1. 将授权码发送到后端，换取访问令牌和用户信息
    // 注意：这里必须通过后端处理，不能在前端直接调用 Google API（会暴露 client_secret）
    const response= await authStore.loginByGoogle(code, state);
    // const response = await $fetch(API_ENDPOINTS.CALLBACK_GOOGLE, {
    //   method: 'POST',
    //   body: { 
    //     code,
    //     state 
    //   }
    // })
    console.log("回调响应参数",response);
    const redirectPath = route.query.redirectPath || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Google 登录回调失败：', error)
    ElMessage.error('登录失败, 请稍后重试')
    router.push('/login')
  }
})
</script>

<style scoped>
.callback-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 16px;
}
</style>
