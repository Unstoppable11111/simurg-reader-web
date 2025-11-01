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
          <!-- 作者信息 -->
          <div class="author-info-box">
            <img class="author-avatar" :src="userAvatar" alt="">
            <div class="author-info">
              <div class="author-name"> {{userName}}，晚上好啊</div>
              <div class="welcome-author-desc">今天是你在simurg reader创作的第1天，继续努力码字吧~</div>
            </div>
            <div class="author-work-num-box">
              <label class="author-work-num-label">作品数量</label>
              <span class="author-work-num"> {{ authorInfo.bookCount }} </span>
            </div>
            <div class="author-reader-num-box">
              <label class="author-reader-num-label">累计读者</label>
              <span class="author-reader-num">0</span>
            </div>
            <div class="author-word-num-box">
              <label class="author-word-num-label">累计字数</label>
              <span class="author-word-num"> {{ authorInfo.totalCompletedWords }} </span>
            </div>
          </div>

          <!-- 作品小说 -->
          <div class="author-works-box">
            <div style="position: relative;height: 68px;">
              <label class="author-works-box-title">作品小说</label>
              <NuxtLink to="/" class="to-work-management">更多</NuxtLink>
            </div>
            <!-- 如果作者还没创建作品，则展示空的盒子 -->
            <div class="empty-box">
              <img class="empty-img" src="" alt="">
              <label class="empty-label">你还没有作品，快去创建你的新作品吧～</label>
              <NuxtLink to="/becomeAuthor/writeBook" class="to-write-book">新建小说</NuxtLink>
            </div>
          </div>
          <el-calendar ref="calendar" class="calendar">
            <template #header="{ date }">
              <span class="calendar-title">作者更新日历</span>
              <span>{{ date }}</span>
              <el-button-group>
                <el-button size="small" @click="selectDate('prev-year')">
                  Previous Year
                </el-button>
                <el-button size="small" @click="selectDate('prev-month')">
                  Previous Month
                </el-button>
                <el-button size="small" @click="selectDate('today')">Today</el-button>
                <el-button size="small" @click="selectDate('next-month')">
                  Next Month
                </el-button>
                <el-button size="small" @click="selectDate('next-year')">
                  Next Year
                </el-button>
              </el-button-group>
            </template>
          </el-calendar>
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
  import { useAuth } from '@/composables/useAuth';
  const {isLoggedIn, isAuthor, userAvatar, userName, userId} = useAuth();
  const authorInfo = ref(null);
  console.log("userId", userId.value);
  // 查询作者信息
  const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}${userId.value}`;
  const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
    method: 'GET'
  });
  console.log("作者信息：", authorInfoResult);
  authorInfo.value = authorInfoResult.data;

  // 查询作者书籍列表
  const authorBookList = await apiRequest(API_ENDPOINTS.LIST_AUTHOR_BOOKS, {
    method: 'GET'
  });
  console.log("作者书籍列表：", authorBookList);


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
  margin-top: 122px;
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
  flex-direction: column;
}
.author-info-box {
  display: flex;
  align-items: center;
  width: 1016px;
  height: 146px;
  background: #424242;
  border-radius: 6px;
}
.author-avatar { 
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 12px;
  margin-left: 38px;
}
.author-info {
  flex: 1;
}
.author-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.welcome-author-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
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
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}
.author-work-num,
.author-reader-num,
.author-word-num { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 8px;
}
.author-works-box {
  width: 1016px;
  height: 287px;
  background: #424242;
  border-radius: 6px;
  margin-top: 16px;
}
.author-works-box-title {
  position: absolute;
  top: 24px;
  left: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.to-work-management {
  position: absolute;
  top: 24px;
  right: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-img {
  width: 100px;
  height: 100px;
  background: #A2A0A0;
}
.empty-label {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #999797;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 7px;
}
.to-write-book {
  width: 200px;
  height: 49px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  text-align: center;
  line-height: 49px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  font-style: normal;
  margin-top: 12px;
}
.calendar {
  width: 625px;
  height: 465px;
  background: #424242;
  border-radius: 6px;
  margin-top: 16px;
}
.calendar-title { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
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