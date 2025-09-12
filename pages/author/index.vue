<template>
  <div class="author-page">
    <Header :margin-left="'244px'" :isAuthor="true"/>
    <div class="author-container">
      <div class="author-left-nav-box">
        <div class="nav-list">
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'author-home' }"
            @click="switchNav('author-home')"
          >
            作者首页
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'work-management' }"
            @click="switchNav('work-management')"
          >
            作品管理
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'work-data' }"
            @click="switchNav('work-data')"
          >
            作品数据
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'income-management' }"
            @click="switchNav('income-management')"
          >
            收入管理
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'personal-info' }"
            @click="switchNav('personal-info')"
          >
            个人信息
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'notifications' }"
            @click="switchNav('notifications')"
          >
            消息通知
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'benefits' }"
            @click="switchNav('benefits')"
          >
            福利中心
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'contracts' }"
            @click="switchNav('contracts')"
          >
            我的合同
          </div>
        </div>
      </div>
      <div class="author-right-content-box">
        <!-- 作者首页内容 -->
        <div v-if="activeNav === 'author-home'" class="author-home-content">
          <img class="author-avatar" src="http://www.tireba.com/simurg-reader/images/author1.png" alt="">
          <div class="author-info-box">
            <div class="author-name">田拽拽，晚上好啊</div>
            <div class="welcome-author-desc">今天是你在simurg reader创作的第1天，继续努力码字吧~</div>
          </div>
          <div class="author-work-num-box">
            <label class="author-work-num-label">作品数量</label>
            <span class="author-work-num">0</span>
          </div>
          <div class="author-reader-num-box">
            <label class="author-reader-num-label">累计读者</label>
            <span class="author-reader-num">0</span>
          </div>
          <div class="author-word-num-box">
            <label class="author-word-num-label">累计字数</label>
            <span class="author-word-num">0</span>
          </div>
        </div>

        <!-- 作品管理内容 -->
        <div v-if="activeNav === 'work-management'" class="author-content-section">
          <h2>作品管理</h2>
          <p>在这里管理你的作品</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 作品数据内容 -->
        <div v-if="activeNav === 'work-data'" class="author-content-section">
          <h2>作品数据</h2>
          <p>查看你的作品统计数据</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 收入管理内容 -->
        <div v-if="activeNav === 'income-management'" class="author-content-section">
          <h2>收入管理</h2>
          <p>查看和管理你的收入</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 个人信息内容 -->
        <div v-if="activeNav === 'personal-info'" class="author-content-section">
          <h2>个人信息</h2>
          <p>编辑和管理你的个人信息</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 消息通知内容 -->
        <div v-if="activeNav === 'notifications'" class="author-content-section">
          <h2>消息通知</h2>
          <p>查看系统消息和通知</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 福利中心内容 -->
        <div v-if="activeNav === 'benefits'" class="author-content-section">
          <h2>福利中心</h2>
          <p>查看可享受的福利和活动</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 我的合同内容 -->
        <div v-if="activeNav === 'contracts'" class="author-content-section">
          <h2>我的合同</h2>
          <p>查看和管理你的合同</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";

// 定义响应式数据，跟踪当前激活的导航项
const activeNav = ref('author-home');

// 切换导航的方法
const switchNav = (nav) => {
  activeNav.value = nav;
};
</script>

<style lang="scss" scoped>
.author-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.author-container {
  display: flex;
  color: #fff;
  margin-top: 38px;
}
.author-left-nav-box {
  width: 220px;
  text-align: center;
}
.nav-list {
  display: flex;
  flex-direction: column;
}
.nav-item {
  width: 220px;
  height: 54px;
  background: #424242;
  line-height: 54px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #A2A0A0;
  font-style: normal;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(249,110,8,0.35);
  }
  
  &.active {
    color: #F96E08;
    background: rgba(249,110,8,0.35);
    font-weight: bold;
  }
}
.nav-item:first-child.active, .nav-item:first-child:hover{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.nav-item:last-child.active, .nav-item:last-child:hover{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.author-right-content-box {
  width: 1116px;
  margin-left: 24px;
}
.author-home-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 146px;
  background: #424242;
  border-radius: 6px;
  padding: 0 20px;
}
.author-avatar { 
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 12px;
}
.author-info-box {
  flex: 1;
}
.author-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #FFFFFF;
  line-height: 28px;
  text-align: left;
  font-style: normal;
}
.welcome-author-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.author-work-num-box,
.author-reader-num-box,
.author-word-num-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.author-reader-num-box,
.author-word-num-box { 
  margin-left: 76px;
}
.author-work-num-box {
  margin-left: 176px;
}
.author-work-num-label,
.author-reader-num-label,
.author-word-num-label { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 18px;
  color: #A2A0A0;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.author-work-num,
.author-reader-num,
.author-word-num { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

// 新增的内容区域样式
.author-content-section {
  width: 100%;
  background: #424242;
  border-radius: 6px;
  padding: 30px;
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #fff;
  }
  
  p {
    color: #ccc;
    font-size: 16px;
    margin-bottom: 30px;
  }
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  
  .placeholder-image {
    width: 100px;
    height: 100px;
    opacity: 0.5;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 18px;
    color: #aaa;
  }
}
</style>