<template>
  <div class="callback-page">
    <p style="color: #fff;">登录中...</p>
  </div>
</template>

<script setup>
import { useCookie } from '#app';
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
    const response = await $fetch('http://localhost:8082/simurg_reader_web/api/auth/callback', {
      method: 'POST',
      body: { 
        code,
        state 
      }
    })
    console.log("回调响应参数",response);
    // 2. 登录成功，保存用户信息（如 Token、用户资料）
    if (response.code === 200) {
      // 存入localStorage方式
      // localStorage.setItem('user', JSON.stringify(response.user))
      // localStorage.setItem('accessToken', response.data.tokenInfo.accessToken)
      // localStorage.setItem('accessTokenExpire', response.data.tokenInfo.accessTokenExpire)
      // localStorage.setItem('refreshToken', response.data.tokenInfo.refreshToken)
      // localStorage.setItem('refreshTokenExpire', response.data.tokenInfo.refreshTokenExpire)
      // const userCookie = useCookie('user')
      // const accessTokenCookie = useCookie('accessToken')
      // const refreshTokenCookie = useCookie('refreshToken')

      // userCookie.value = response.thirdPartyUserInfo
      // accessTokenCookie.value = response.data.tokenInfo.accessToken
      // refreshTokenCookie.value = response.data.tokenInfo.refreshToken

      // const accessTokenExpire = useCookie('accessTokenExpire')
      // const refreshTokenExpire = useCookie('refreshTokenExpire')

      // accessTokenExpire.value = response.data.tokenInfo.accessTokenExpire
      // refreshTokenExpire.value = response.data.tokenInfo.refreshTokenExpire
      // 使用useCookie设置cookie
      // 使用useCookie设置cookie
      const userCookie = useCookie('user', {
        maxAge: 60 * 60 * 24 * 7, // 7天过期
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      })
      
      const accessTokenCookie = useCookie('accessToken', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      })
      
      const refreshTokenCookie = useCookie('refreshToken', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      })

      // 设置用户信息到cookie
      // 检查response中的用户信息字段
      const userInfo = response.data.thirdPartyUserInfo || {}
      
      console.log('User info to save:', userInfo)
      
      userCookie.value = userInfo
      accessTokenCookie.value = response.data.tokenInfo.accessToken
      refreshTokenCookie.value = response.data.tokenInfo.refreshToken

      // 设置过期时间
      const accessTokenExpire = useCookie('accessTokenExpire', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      })
      
      const refreshTokenExpire = useCookie('refreshTokenExpire', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      })

      accessTokenExpire.value = response.data.tokenInfo.accessTokenExpire
      refreshTokenExpire.value = response.data.tokenInfo.refreshTokenExpire

      console.log('Cookie设置完成:', {
        user: userCookie.value,
        accessToken: accessTokenCookie.value,
        refreshToken: refreshTokenCookie.value
      });

      // 设置过期时间

      // 保存用户名


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