<template>
  <div class="login-page">
    <!-- 主容器 - 核心弹性布局 -->
    <div class="login-container">
      <!-- 左侧网站功能说明 -->
      <div class="simurg-preview">
        <!-- <img src="/images/phone-frame.png" alt="Phone frame" class="phone-frame"> -->
        <!-- <img src="/images/login-preview.jpg" alt="App preview" class="preview-image"> -->
         <div class="simurg-login-title">
          <span class="login-title-text">你的故事在这里重生</span>
          <span class="login-subtitle-text">成千上万的故事，一键点击，开始阅读Simurg</span>
          <ul>
            <li>10,000+基塔普</li>
            <li>游戏模式</li>
            <li>快速体验</li>
          </ul>
         </div>
      </div>

      <!-- 右侧登录表单区 -->
      <div class="auth-container">
        <!-- 登录卡片 -->
        <div class="auth-card">
          <!-- Logo -->
          <div class="logo-container">
            <img src="/images/simurg-reader-logo.svg" alt="Simurg Reader Logo" class="logo">
          </div>

          <!-- 登录表单 -->
          <div class="login-form">
            <!-- 账号输入框 -->
            <div class="form-group">
              <input 
                type="text" 
                placeholder="用户名、邮箱或手机号" 
                v-model="username"
                class="input-field"
              >
            </div>
            
            <!-- 密码输入框 -->
            <div class="form-group">
              <input 
                type="password" 
                placeholder="密码" 
                v-model="password"
                class="input-field"
              >
            </div>
            
            <!-- 记住我选项 -->
            <div class="checkbox-group">
              <input 
                type="checkbox" 
                id="remember-me" 
                v-model="rememberMe"
                class="checkbox-input"
              >
              <label for="remember-me" class="checkbox-label">记住我</label>
            </div>
            
            <!-- 登录按钮 -->
            <button class="submit-btn" @click="handleLoginByAccount">登录</button>
            
            <!-- 分隔线 -->
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">或</span>
              <span class="divider-line"></span>
            </div>
            
            <!-- 社交媒体登录 -->
            <div class="social-buttons">
              <button 
                @click="handleGoogleLogin" 
                class="social-btn google-btn"
              >
                <svg class="social-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F5"/>
                  <path d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.78 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3V7.07H2.18C1.43 8.58 1 10.3 1 12s.43 3.42 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.41 1 12 1c-2.41 0-5.45 1.09-7.15 2.85l3.15 3.15c1.15-1.08 2.59-1.64 4.21-1.64z" fill="#EA4335"/>
                </svg>
                <span class="btn-text">Google 登录</span>
              </button>
              
              <button 
                @click="handleFacebookLogin" 
                class="social-btn facebook-btn"
              >
                <svg class="social-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.064 24 12.073z" fill="#1877F2"/>
                </svg>
                <span class="btn-text">Facebook 登录</span>
              </button>
            </div>
            
            <!-- 忘记密码 -->
            <div class="forgot-password">
              <a href="#" class="link-text">忘记密码？</a>
            </div>
          </div>
        </div>
        
        <!-- 注册提示 -->
        <div class="auth-card signup-card">
          <p>没有账号？ <a href="#" class="signup-link">立即注册</a></p>
        </div>
        
        <!-- 应用下载提示 -->
        <div class="app-download">
          <p>获取应用</p>
          <div class="download-buttons">
            <a href="#" class="download-btn">
              <img src="/images/app-store.svg" alt="App Store" class="download-img">
            </a>
            <a href="#" class="download-btn">
              <img src="/images/google-play.svg" alt="Google Play" class="download-img">
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-links">
        <a href="#">关于我们</a>
        <a href="#">支持</a>
        <a href="#">条款</a>
        <a href="#">隐私</a>
        <a href="#">Cookie</a>
        <a href="#">语言</a>
      </div>
      <p class="copyright">&copy; 2026 simurg reader</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_ENDPOINTS } from '@/utils/api'

// 初始化核心实例
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 表单状态
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

// Google登录逻辑
const handleGoogleLogin = async () => {
  console.log('Google登录开始')
  try {
    // 调用后端生成Google授权链接接口
    const response = await $fetch(API_ENDPOINTS.AUTH_GOOGLE, { method: 'GET' })
    console.log('Google登录初始化成功:', response.data)
    localStorage.setItem('google_auth_url', response.data)
    window.location.href = response.data.toString() // 跳转到Google授权页

  } catch (error) {
    console.error('Google登录初始化失败:', error)
    ElMessage.warning('Google登录暂不可用，请稍后重试')
  }
}

// Facebook登录逻辑
const handleFacebookLogin = async () => {
  try {
    // 替换为你的Facebook App ID和回调地址
    const FB_APP_ID = '你的Facebook App ID'
    const FB_REDIRECT_URI = `${window.location.origin}/auth/facebook/callback`
    const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&scope=email,public_profile&response_type=code`
    window.location.href = facebookAuthUrl
  } catch (error) {
    console.error('Facebook登录初始化失败:', error)
    ElMessage.error('Facebook登录暂不可用，请稍后重试')
  }
}

// 账号密码登录
const handleLoginByAccount = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  try {
    const response = await authStore.loginByAccount(username.value, password.value)
    if (response.code === 200) {
      // 登录成功跳转（支持回跳原页面）
      const redirectPath = route.query.redirectPath as string || '/'
      router.push(redirectPath)
      ElMessage.success('登录成功！')
    } else {
      ElMessage.error(response.message || '登录失败！')
    }
  } catch (error) {
    console.error('账号登录失败:', error)    
    ElMessage.error('登录失败，请检查账号密码或网络')
  }
}
</script>

<style scoped>
/* 全局重置 + 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 页面容器 - 黑色系背景 + 弹性布局撑满视口 */
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000; /* 主背景纯黑 */
  color: #fff; /* 全局文字默认白色 */
  min-height: 100vh;
  padding: 20px 16px; /* 移动端左右内边距 */
  background-image: url('/public/images/login-bg.png');
  background-repeat: no-repeat; /* 防止背景图片重复 */
  background-size: contain; /* 可选：让背景图片覆盖整个容器 */
  background-position: center; /* 可选：让背景图片居中显示 */
}

/* 主容器 - 响应式弹性布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 0;
  gap: 40px; /* 增大左右模块间距，优化视觉 */
}
.simurg-login-title {
  display: flex;
  flex-direction: column;
}
.login-title-text {
  font-size: 40px;
}

/* 左侧手机预览 - 优化比例 + 仅中等屏幕以上显示 */
.phone-preview {
  position: relative;
  display: none;
  width: 400px; /* 缩小宽度，优化比例 */
  height: 580px; /* 适配宽度调整高度，比例更协调 */
}

.phone-frame {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  object-fit: contain; /* 保证图片完整显示，不拉伸 */
}

.preview-image {
  position: absolute;
  top: 70px; /* 调整位置，适配新尺寸 */
  left: 22px; /* 调整位置，适配新尺寸 */
  width: 210px; /* 按比例缩小预览图 */
  height: 380px; /* 按比例缩小预览图 */
  border-radius: 24px; /* 适配尺寸调整圆角 */
  object-fit: cover;
}

/* 右侧登录表单容器 */
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 350px; /* 固定表单最大宽度 */
}

/* 登录卡片样式 - 黑色系适配 */
.auth-card {
  background-color: #1a1a1a; /* 卡片深灰黑，区分主背景 */
  border: 1px solid #333; /* 边框浅灰，适配黑色系 */
  border-radius: 8px; /* 增大圆角，更现代 */
  padding: 25px 0;
  width: 100%;
  margin-bottom: 12px;
  text-align: center;
}

/* Logo样式 */
.logo-container {
  margin: 18px auto 15px;
}

.logo {
  width: 160px; /* 微调logo大小，优化比例 */
  height: auto;
  filter: brightness(1.2); /* 提亮logo，适配黑色背景 */
}

/* 表单样式 - 黑色系适配 */
.login-form {
  margin-top: 20px;
  padding: 0 40px;
}

.form-group {
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  height: 40px; /* 增高输入框，优化交互 */
  padding: 10px 12px;
  background-color: #262626; /* 输入框背景深灰 */
  border: 1px solid #444; /* 输入框边框 */
  border-radius: 6px; /* 增大输入框圆角 */
  font-size: 14px;
  color: #fff; /* 输入框文字白色 */
  transition: border-color 0.2s ease;
}

.input-field::placeholder {
  color: #999; /* 占位符浅灰 */
}

.input-field:focus {
  outline: none;
  border-color: #0095f6; /* 聚焦边框蓝色，突出 */
}

/* 记住我选项 - 黑色系适配 */
.checkbox-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 8px 0 15px;
  padding: 0 4px;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
  accent-color: #0095f6; /* 复选框选中色 */
}

.checkbox-label {
  font-size: 13px;
  color: #e0e0e0; /* 浅白，适配黑色背景 */
  cursor: pointer;
}

/* 登录按钮 - 优化样式 */
.submit-btn {
  width: 100%;
  height: 38px; /* 增高按钮，优化点击体验 */
  margin: 10px 0;
  background-color: #0095f6; /* Instagram蓝 */
  color: #fff;
  border: none;
  border-radius: 6px; /* 增大按钮圆角 */
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.submit-btn:hover {
  opacity: 0.9;
  background-color: #0084e0; /* hover加深蓝色 */
}

/* 分隔线样式 - 黑色系适配 */
.divider {
  display: flex;
  align-items: center;
  margin: 15px 0 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #444; /* 分隔线深灰 */
}

.divider-text {
  margin: 0 20px;
  font-size: 13px;
  font-weight: 600;
  color: #999; /* 分隔文字浅灰 */
  text-transform: uppercase;
}

/* 社交媒体登录按钮 - 弹性布局平分宽度 + 黑色系适配 */
.social-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.social-btn {
  flex: 1; /* 平分宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #262626; /* 按钮背景深灰 */
  border: 1px solid #444; /* 按钮边框 */
  border-radius: 6px;
  color: #e0e0e0; /* 按钮文字浅白 */
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  padding: 8px 0;
  transition: background-color 0.2s ease;
}

.social-btn:hover {
  background-color: #333; /* hover加深背景 */
}

.social-icon {
  flex-shrink: 0; /* 防止图标压缩 */
}

/* 忘记密码链接 - 黑色系适配 */
.forgot-password {
  margin-top: 15px;
}

.link-text {
  color: #0095f6; /* 链接用Instagram蓝，突出 */
  font-size: 13px;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}

/* 注册卡片 - 黑色系适配 */
.signup-card {
  padding: 18px 0;
  background-color: #1a1a1a;
  border: 1px solid #333;
}

.signup-card p {
  color: #e0e0e0;
  font-size: 14px;
}

.signup-link {
  color: #0095f6;
  font-weight: 600;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

/* 应用下载区 - 黑色系适配 */
.app-download {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

.app-download p {
  color: #e0e0e0;
  font-size: 14px;
  margin-bottom: 12px;
}

.download-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.download-btn {
  width: 130px; /* 微调按钮宽度，优化比例 */
  height: 40px;
  display: inline-block;
}

.download-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(1.5); /* 提亮下载按钮图标，适配黑色背景 */
}

/* 页脚样式 - 黑色系适配 */
.footer {
  margin-top: 50px;
  padding: 0 20px;
  max-width: 935px;
  width: 100%;
}

.footer-links {
  display: flex;
  flex-wrap: wrap; /* 自动换行 - 弹性布局适配 */
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.footer-links a {
  color: #999;
  font-size: 12px;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
  color: #e0e0e0;
}

.copyright {
  color: #999;
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
}

/* 响应式适配 - 弹性布局断点 */
/* 平板/桌面端显示左侧手机预览 */
@media (min-width: 768px) {
  .phone-preview {
    display: block;
  }
}

/* 移动端适配（小屏）- 黑色系优化 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px 0;
    gap: 0; /* 移动端取消间距 */
  }
  
  .auth-card {
    border: 1px solid #333; /* 保留边框，适配黑色系 */
    background-color: #1a1a1a;
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 16px;
  }
  
  .social-buttons {
    flex-direction: column; /* 移动端社交媒体按钮垂直排列 */
    gap: 8px;
  }

  .phone-preview {
    display: none !important; /* 小屏强制隐藏预览图 */
  }
}

/* 大屏适配，优化居中 */
@media (min-width: 1200px) {
  .login-container {
    gap: 60px; /* 大屏增大间距，更美观 */
  }
}
</style>
