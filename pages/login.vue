<template>
  <div class="login-page">
    <h1>登录</h1>
    <!-- 触发 Google 登录的按钮 -->
    <button @click="handleGoogleLogin" class="google-login-btn">
      使用 Google 账号登录
    </button>
  </div>
</template>

<script setup>

const handleGoogleLogin = async () => {
  console.log("点击登录按钮");
  try {
    const response = await $fetch('http://localhost:8082/simurg_reader_web/api/auth/1', {
      method: 'GET'
    })
    // 跳转到 Google 登录页面
    console.log("生成授权链接响应参数",response);
    window.location.href = response.data.toString()
  } catch (error) {
    console.error("获取生成链接异常：{}",error)
    return
  }

  
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.google-login-btn {
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.google-login-btn:hover {
  background-color: #3367d6;
}
</style>