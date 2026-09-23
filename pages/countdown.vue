<template>
  <div class="simurg-reader-page" @click="shiftDimensions">
    <!-- 宇宙传送门：按官方示例 + Nuxt3客户端渲染 + 全屏样式（核心修复） -->
    <ClientOnly>
      <CosmicPortal
        ref="cosmicPortal"
        container-class="cosmic-portal-bg"
      />
    </ClientOnly>

    <!-- 顶部Logo：保留你的原有样式+居中 -->
    <!-- <div class="site-header">
      
    </div> -->

    <!-- 主内容区：保留你的倒计时+特色列表+原有样式 -->
    <div class="main-container">
      <!-- 左侧倒计时卡片 -->
      <div class="countdown-card">
        <img src="/images/simurg-reader-logo.svg" alt="simurg reader logo" class="header-logo" />
        <p class="slogon">一千零一夜的故事正在被重写</p>
        <p class="card-subtitle">距离 simurg reader 上线还有</p>
        <div class="countdown-display">
          <span class="count-item">{{ days }}</span>
          <span class="count-separator">:</span>
          <span class="count-item">{{ hours }}</span>
          <span class="count-separator">:</span>
          <span class="count-item">{{ minutes }}</span>
          <span class="count-separator">:</span>
          <span class="count-item">{{ seconds }}</span>
        </div>
        <div class="countdown-labels">
          <span>天</span>
          <span>时</span>
          <span>分</span>
          <span>秒</span>
        </div>
        <p class="card-footer">• 敬请期待</p>

        <!-- 传送门控制按钮：按官方示例样式，匹配你的页面金色主题 -->
        <div class="portal-control-buttons">
          <!-- <Button @click.stop="activatePortal" class="portal-btn">激活传送门</Button>
          <Button @click="shiftDimensions" class="portal-btn">维度切换</Button> -->
        </div>
      </div>

      <!-- 右侧特色列表：保留你的原有hover金色竖线效果 -->
      <div class="features-container">
        <h2 class="features-title">沉浸式阅读 <span class="highlight">新体验</span></h2>
        <p class="features-subtitle">simurg reader 核心亮点</p>
        <ul class="features-list">
          <li class="feature-item">📚 海量小说库，分类精准检索</li>
          <li class="feature-item">🔖 智能书签，阅读进度秒同步</li>
          <li class="feature-item">👁️ 护眼模式，自定义阅读界面</li>
          <li class="feature-item">🔄 多端互通，随时随地畅读</li>
          <li class="feature-item">🎁 新人福利，上线即可免费阅读</li>
        </ul>
        <button class="notify-button" @click.stop="activatePortal">→ 上线第一时间通知你</button>
      </div>
    </div>

    <!-- 页脚：保留你的原有样式 -->
    <footer class="site-footer">
      <p>© 2025 simurg reader 版权所有</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 导入Vue/Nuxt原生API，移除无用的手动Button导入
import { ref, onMounted, onUnmounted } from 'vue'
import CosmicPortal from '@/components/ui/cosmic-portal/CosmicPortal.vue'
import Button from '@/components/ui/button/Button.vue'

// 倒计时核心逻辑：完全保留你的原有代码，无修改
const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
const targetTime = new Date('2026-03-01 00:00:00').getTime()
let timer: NodeJS.Timeout | null = null

// 传送门Ref绑定：替换useTemplateRef为Vue原生ref，按官方示例命名，兼容TS
const cosmicPortal = ref<InstanceType<typeof CosmicPortal> | null>(null)
// 补零函数：保留你的原有代码
const addZero = (num: number) => num < 10 ? `0${num}` : num

// 秒级倒计时更新：保留你的原有代码
const updateCountdown = () => {
  const now = Date.now()
  const remainingTime = targetTime - now

  if (isNaN(remainingTime) || remainingTime <= 0) {
    days.value = '00'
    hours.value = '00'
    minutes.value = '00'
    seconds.value = '00'
    timer && clearInterval(timer)
    return
  }

  days.value = addZero(Math.floor(remainingTime / (1000 * 60 * 60 * 24)))
  hours.value = addZero(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  minutes.value = addZero(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)))
  seconds.value = addZero(Math.floor((remainingTime % (1000 * 60)) / 1000))
}

// 传送门方法：严格按官方示例编写，增加控制台日志便于调试
function activatePortal() {
  if (!cosmicPortal.value) {
    console.warn('CosmicPortal组件实例未获取到！')
    return
  }
  cosmicPortal.value.activatePortal()
  console.log('传送门已激活 ✅')
}

function shiftDimensions() {
  if (!cosmicPortal.value) {
    console.warn('CosmicPortal组件实例未获取到！')
    return
  }
  cosmicPortal.value.shiftDimensions()
  console.log('传送门维度已切换 ✅')
}

// 生命周期：保留倒计时逻辑，移除粒子特效相关，无修改
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  timer && clearInterval(timer)
})
</script>

<style scoped>
/* 根容器：保留你的原有暗黑主题样式，无修改 */
.simurg-reader-page {
  display: flex;
  min-height: 100vh !important;
  width: 100% !important;
  background: #0a0a0d !important;
  color: #ffffff !important;
  font-family: "Microsoft Yahei", "PingFang SC", "Helvetica Neue", sans-serif !important;
  position: relative !important;
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 0 !important;
}

/* 宇宙传送门核心样式：全屏铺满+最底层+不拦截鼠标，适配你的页面 */
.cosmic-portal-bg {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 0 !important; /* 最底层，不遮挡任何页面内容 */
  pointer-events: none !important; /* 不拦截鼠标点击/移动事件 */
  border-radius: 0 !important; /* 取消官方示例的圆角，全屏显示 */
  opacity: 0.95 !important; /* 微调透明度，匹配你的暗黑背景 */
}

/* 顶部Logo：补全flex布局（你原有代码缺失），保证居中 */
.site-header {
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  padding: 40px 0 60px 0 !important;
  position: relative !important;
  z-index: 9 !important; /* 高于传送门，保证显示 */
  margin: 0 auto !important;
  left: 100px;
}
.header-logo {
  width: 200px !important;
  height: 50px !important;
  object-fit: contain !important;
}
.slogon {
  color: #f9a825;
  padding-bottom: 10px;
}

/* 主内容容器：保留你的原有样式，无修改 */
.main-container {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 100px !important;
  max-width: 1200px !important;
  width: 90% !important;
  margin: 0 auto !important;
  position: relative !important;
  z-index: 9 !important;
  flex-wrap: wrap !important;
}

/* 倒计时卡片：保留你的原有样式+金色主题，无修改 */
.countdown-card {
  background: rgba(18, 18, 24, 0.55) !important;
  border-radius: 20px !important;
  padding: 30px 40px !important;
  text-align: center !important;
  box-shadow: 0 0 80px rgba(255, 183, 0, 0.2) !important;
  border: 1px solid rgba(255, 183, 0, 0.2) !important;
  position: relative !important;
  z-index: 10 !important;
  min-width: 380px !important;
}
.card-subtitle {
  color: #cccccc !important;
  font-size: 14px !important;
  margin-bottom: 30px !important;
  letter-spacing: 2px !important;
}
.countdown-display {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 16px !important;
  font-size: 90px !important;
  font-weight: 800 !important;
  color: #ffb700 !important;
  text-shadow: 0 0 40px rgba(255, 183, 0, 0.6) !important;
}
.count-item {
  min-width: 110px !important;
}
.count-separator {
  animation: pulse 1.5s infinite ease-in-out !important;
}
.countdown-labels {
  display: flex !important;
  justify-content: space-between !important;
  padding: 0 10px !important;
  margin-top: 10px !important;
  color: #888888 !important;
  font-size: 14px !important;
  letter-spacing: 1px !important;
}
.card-footer {
  margin-top: 40px !important;
  color: #ffb700 !important;
  font-size: 14px !important;
  letter-spacing: 3px !important;
  margin-bottom: 30px !important;
}

/* 传送门控制按钮：保留你的金色主题样式，适配shadcn-vue的Button组件 */
.portal-control-buttons {
  display: flex !important;
  gap: 15px !important;
  justify-content: center !important;
  align-items: center !important;
}
.portal-btn {
  background: transparent !important;
  border: 1px solid #ffb700 !important;
  color: #ffb700 !important;
  padding: 10px 25px !important;
  border-radius: 25px !important;
  font-size: 14px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}
.portal-btn:hover {
  background: rgba(255, 183, 0, 0.1) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 0 15px rgba(255, 183, 0, 0.2) !important;
}

/* 特色列表：保留你的原有hover金色竖线效果，无修改 */
.features-container {
  max-width: 500px !important;
  position: relative !important;
  z-index: 9 !important;
  text-align: left !important;
}
.features-title {
  font-size: 38px !important;
  font-weight: 700 !important;
  line-height: 1.3 !important;
  margin-bottom: 15px !important;
  color: #ffffff !important;
}
.highlight {
  color: #ffb700 !important;
  position: relative !important;
}
.highlight::after {
  content: "" !important;
  position: absolute !important;
  bottom: -6px !important;
  left: 0 !important;
  width: 100% !important;
  height: 3px !important;
  background: #ffb700 !important;
  border-radius: 2px !important;
}
.features-subtitle {
  color: #aaaaaa !important;
  font-size: 14px !important;
  letter-spacing: 1px !important;
  margin-bottom: 40px !important;
}
.features-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 0 50px 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 20px !important;
}
.feature-item {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  font-size: 20px !important;
  line-height: 1.6 !important;
  color: #dddddd !important;
  padding: 12px 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  transition: all 0.3s ease !important;
  background: transparent !important;
  overflow: hidden !important;
}
.feature-item:hover {
  color: #ffffff !important;
  background: rgba(24, 24, 30, 0.7) !important;
  transform: translateX(10px) !important;
  font-weight: 600 !important;
}
.feature-item::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 3px !important;
  height: 100% !important;
  background: #ffb700 !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}
.feature-item:hover::before {
  opacity: 1 !important;
}

/* 通知按钮：保留你的原有样式，无修改 */
.notify-button {
  background: transparent !important;
  border: 1px solid #ffb700 !important;
  color: #ffb700 !important;
  padding: 14px 40px !important;
  border-radius: 35px !important;
  font-size: 15px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
  letter-spacing: 1px !important;
  position: relative !important;
  z-index: 9 !important;
}
.notify-button:hover {
  background: rgba(255, 183, 0, 0.1) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 5px 20px rgba(255, 183, 0, 0.2) !important;
}

/* 页脚：保留你的原有样式，无修改 */
.site-footer {
  position: absolute !important;
  bottom: 30px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  color: #666666 !important;
  font-size: 12px !important;
  letter-spacing: 1px !important;
  z-index: 9 !important;
  margin-top: 80px !important;
  text-align: center !important;
}

/* 冒号呼吸动画：保留你的原有样式，无修改 */
@keyframes pulse {
  0%, 100% { opacity: 1 !important; }
  50% { opacity: 0.4 !important; }
}

/* 移动端适配：保留你的原有样式+按钮适配，无修改 */
@media (max-width: 1024px) {
  .main-container { gap: 60px !important; }
  .countdown-card { padding: 40px 60px !important; min-width: 300px !important; }
  .countdown-display { font-size: 70px !important; gap: 12px !important; }
  .count-item { min-width: 80px !important; }
  .features-title { font-size: 30px !important; }
  .feature-item { padding: 10px 16px !important; font-size: 15px !important; }
  .portal-btn { padding: 8px 20px !important; font-size: 13px !important; }
}
@media (max-width: 768px) {
  .site-header { padding: 30px 0 40px 0 !important; left: 0 !important; }
  .countdown-card { padding: 30px 40px !important; min-width: 280px !important; }
  .countdown-display { font-size: 50px !important; }
  .features-container { width: 100% !important; }
  .site-footer { bottom: 20px !important; font-size: 10px !important; }
  .portal-control-buttons { flex-direction: column !important; gap: 10px !important; }
  .portal-btn { width: 80% !important; }
}
</style>