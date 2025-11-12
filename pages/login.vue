<template>
  <div class="login-page">
    <!-- Logo -->
    <div class="logo-container">
      <img src="../public//images/simurg-reader-logo.png" alt="Simurg Reader Logo" class="logo">
    </div>

    <!-- Login Form -->
    <div class="login-form-container">
      <div class="login-header">
        <h2>登录</h2>
        <p>使用您的账户登录 Simurg Reader</p>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        
      </div>

      <div class="login-form">
        <div class="form-group">
          <input 
            type="text" 
            placeholder="用户名" 
            v-model="username"
            class="input-field"
          >
        </div>
        <div class="form-group">
          <input 
            type="password" 
            placeholder="密码" 
            v-model="password"
            class="input-field"
          >
        </div>
        <div class="checkbox-group">
          <input 
            type="checkbox" 
            id="remember-me" 
            v-model="rememberMe"
          >
          <label for="remember-me" class="checkbox-label">记住我</label>
        </div>
        <button class="submit-btn"  @click="handleLoginByAccount">登录</button>
        <div class="forgot-password">
          <a href="#" class="link-text">忘记密码？</a>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="social-login">
        <div class="divider">
          <span class="divider-text">或使用第三方账号登录</span>
        </div>
        <div class="social-buttons">
          <button 
            @click="handleGoogleLogin" 
            class="social-btn google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F5"/>
              <path d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.78 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3V7.07H2.18C1.43 8.58 1 10.3 1 12s.43 3.42 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.41 1 12 1c-2.41 0-5.45 1.09-7.15 2.85l3.15 3.15c1.15-1.08 2.59-1.64 4.21-1.64z" fill="#EA4335"/>
            </svg>
            <span class="btn-text">使用 Google 登录</span>
          </button>
          <button 
            @click="handleFacebookLogin" 
            class="social-btn facebook-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.064 24 12.073z" fill="#1877F2"/>
            </svg>
            <span class="btn-text">使用 Facebook 登录</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; simurg reader有限公司</p>
    </div>
  </div>
</template>

<script setup>
import {useAuth} from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { API_ENDPOINTS } from '@/utils/api'


const authStore = useAuthStore()
const { setAuthCookies } = useAuth()
const router = useRouter()
const route = useRoute()
// 页面状态
const activeTab = ref('sms')
const phoneNumber = ref('')
const verificationCode = ref('')
const username = ref('')
const password = ref('')
const email = ref('')
const agreeTerms = ref(false)
const rememberMe = ref(false)
const rememberEmail = ref(false)
const selectLoginType = (type) => {
  activeTab.value = type;
};
// Google 登录处理
const handleGoogleLogin = async () => {
  console.log("点击 Google 登录按钮");
  try {
    const response = await $fetch(API_ENDPOINTS.AUTH_GOOGLE, {
      method: 'GET'
    })
    // 跳转到 Google 登录页面
    console.log("生成授权链接响应参数", response);
    window.location.href = response.data.toString()
  } catch (error) {
    console.error("获取生成链接异常：{}", error)
    return
  }
}

// Facebook 登录处理
const handleFacebookLogin = async () => {
  console.log("点击 Facebook 登录按钮");
  try {
    // 这里可以添加 Facebook 登录的逻辑
    // 通常需要重定向到 Facebook 的 OAuth 页面
    const facebookAuthUrl = 'https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email,public_profile';
    window.location.href = facebookAuthUrl;
  } catch (error) {
    console.error("Facebook 登录异常：{}", error)
    return
  }
}

const handleLoginByAccount = async () => { 
  console.log("handleLoginByAccount");
  try {
    // const loginByAccountReq = {
    //   account: username.value,
    //   password: password.value
    // }
    // console.log("通过账号登录请求参数：{}", loginByAccountReq)
    const response = await authStore.loginByAccount(username.value, password.value)
    // const response = await apiRequest(API_ENDPOINTS.AUTH_BY_ACCOUNT, {
    //   method: 'POST',
    //   body: JSON.stringify(loginByAccountReq)
    // })
    console.log("通过账号登录结果：{}", response);
    if (response.code === 200) {
      const redirectPath = route.query.redirectPath || '/'
      router.push(redirectPath)
    } else {
      alert(response.msg)
    }
  } catch (error) { 
    console.error("登录异常：{}", error)
    alert('登录失败, 请检查用户名和密码')
    return
  }
}

const handleLoginByEmail = async () => { 
  console.log("handleLoginByEmail");
}

const handleLoginBySMS = async () => { 
  console.log("handleLoginBySMS");
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 20px;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

.logo-container {
  margin-top: 40px;
  margin-bottom: 40px;
}

.logo {
  width: 200px;
  height: auto;
}

.login-form-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-header h2 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.login-header p {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0;
}

.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: #333;
  color: white;
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #333;
}

.send-code-btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.send-code-btn:hover {
  background-color: #3367d6;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 8px;
}

.checkbox-label {
  font-size: 12px;
  color: #666;
}

.terms-link {
  color: #4285f4;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #ffcc80;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #ffab40;
}

.forgot-password {
  text-align: center;
  margin-top: 12px;
}

.link-text {
  color: #4285f4;
  text-decoration: underline;
  font-size: 14px;
}

.social-login {
  margin-top: 20px;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.divider-text {
  padding: 0 16px;
  font-size: 14px;
  color: #666;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.google-btn {
  background-color: #4285f4;
  color: white;
}

.google-btn:hover {
  background-color: #3367d6;
}

.facebook-btn {
  background-color: #1877F2;
  color: white;
}

.facebook-btn:hover {
  background-color: #166fe5;
}

.footer {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form-container {
    padding: 20px;
    margin: 0 20px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
  
  .tab-navigation {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1;
    padding: 6px 12px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .social-btn {
    margin-bottom: 8px;
  }
}
</style>