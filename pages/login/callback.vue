<template>
  <div class="callback-page">
    <p style="color: #fff;">登录中...</p>
  </div>
</template>

<script setup>
import { useCookie } from '#app';
import { API_ENDPOINTS } from '@/utils/api'
const router = useRouter()
const route = useRoute()

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
       // 使用useCookie设置cookie，避免特殊字符被编码
      const cookieOptions = {
        maxAge: 60 * 60 * 24 * 7, // 7天过期
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      }
      
      // 设置用户信息到cookie（使用JSON序列化）
      const userCookie = useCookie('user', cookieOptions)
      userCookie.value = response.data.thirdPartyUserInfo || {}
      
      // 直接操作document.cookie来避免编码问题
      if (process.client) {
        const expires = new Date()
        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7天
        
        // 设置accessToken，不进行编码
        document.cookie = `accessToken=${response.data.tokenInfo.accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        
        // 设置refreshToken，不进行编码
        document.cookie = `refreshToken=${response.data.tokenInfo.refreshToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        
        // 设置过期时间
        document.cookie = `accessTokenExpire=${response.data.tokenInfo.accessTokenExpire}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        document.cookie = `refreshTokenExpire=${response.data.tokenInfo.refreshTokenExpire}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      }

      console.log('Cookie设置完成:', {
        user: userCookie.value,
        accessToken: response.data.tokenInfo.accessToken,
        refreshToken: response.data.tokenInfo.refreshToken
      });

      // 跳转到首页或之前的页面
      router.push('/')
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