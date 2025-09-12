<template>
  <Header :margin-left="'244px'" :isAuthor="true"/>
  <div class="author-container">
    <div class="author-left-nav-box">
      <div class="nav-list">
        <div class="nav-item active">作者首页</div>
        <div class="nav-item">作品管理</div>
        <div class="nav-item">作品数据</div>
        <div class="nav-item">收入管理</div>
        <div class="nav-item">个人信息</div>
        <div class="nav-item">消息通知</div>
        <div class="nav-item">福利中心</div>
        <div class="nav-item">我的合同</div>
      </div>
    </div>
    <div class="author-right-content-box">
      <!-- 作者首页内容 -->
      <div class="author-home-content">
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
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  
  
</script>

<style lang="scss" scoped>
  .author-container {
    display: flex;
    color: #fff;
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
  }
  .active {
    background: rgba(249,110,8,0.35);
  }
  .author-right-content-box {
    display: flex;
    margin-left: 24px;
  }
  .author-home-content {
    display: flex;
    align-items: center;
    width: 1116px;
    height: 146px;
    background: #424242;
    border-radius: 6px;
  }
  .author-avatar { 
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-left: 38px;
  }
  .author-info-box {
    margin-left: 12px;
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
  .author-word-num-box
 {
    display: flex;
    flex-direction: column;
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
</style>