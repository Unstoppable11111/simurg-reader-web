<template>
  <div class="callback-page">
    <p style="color: #fff;">登录中...</p>
  </div>
</template>

<script setup>
import {useAuth} from '@/composables/auth'
import { API_ENDPOINTS } from '@/utils/api'
const router = useRouter()
const route = useRoute()
const { setAuthCookies } = useAuth()

onMounted(async () => {
  // 从 URL 中获取 Google 返回的授权码（code 参数）
  console.log("回调参数",route.query);
  const code = route.query.code
  const state = route.query.state
  if (!code) {
    alert('登录失败：未获取到授权码')
    router.push('/login')
    return
  }

  try {
    // 1. 将授权码发送到后端，换取访问令牌和用户信息
    // 注意：这里必须通过后端处理，不能在前端直接调用 Google API（会暴露 client_secret）
    const response = await $fetch(API_ENDPOINTS.CALLBACK_GOOGLE, {
      method: 'POST',
      body: { 
        code,
        state 
      }
    })
    console.log("回调响应参数",response);
    // 2. 登录成功，保存用户信息（如 Token、用户资料）
    if (response.code === 200) {
      setAuthCookies({
        user: response.data.thirdPartyUserInfo || {},
        accessToken: response.data.tokenInfo.accessToken,
        refreshToken: response.data.tokenInfo.refreshToken,
        accessTokenExpire: response.data.tokenInfo.accessTokenExpire,
        refreshTokenExpire: response.data.tokenInfo.refreshTokenExpire
      })
      // 跳转到首页或之前的页面
      const redirectPath = route.query.redirectPath || '/'
      router.push(redirectPath)
    } else {
      console.error('登录失败：', response)
      throw new Error('登录失败：' + response.message)
    }
  } catch (error) {
    console.error('Google 登录回调失败：', error)
    alert('登录失败，请重试')
    router.push('/login')
  }
})
</script>

<style scoped>
.callback-page {
  text-align: center;
  padding: 50px;
}
</style>