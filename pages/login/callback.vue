<template>
  <div class="callback-page">
    <p>登录中...</p>
  </div>
</template>

<script setup>

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
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('accessToken', response.data.tokenInfo.accessToken)
      localStorage.setItem('accessTokenExpire', response.data.tokenInfo.accessTokenExpire)
      localStorage.setItem('refreshToken', response.data.tokenInfo.refreshToken)
      localStorage.setItem('refreshTokenExpire', response.data.tokenInfo.refreshTokenExpire)
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