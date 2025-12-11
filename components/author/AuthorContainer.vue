<!-- components/author/AuthorContainer.vue -->
<template>
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
          :class="{ active: activeNav === 'author-info' }"
          @click="switchNav('author-info')"
        >
          个人信息
        </div>
      </div>
    </div>
    <div class="author-right-content-box">
      <slot :active-nav="activeNav"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeNav = ref('author-home');

const switchNav = (nav: string) => {
  activeNav.value = nav;
};

defineExpose({
  activeNav,
  switchNav
});
</script>

<style lang="scss" scoped>
/* 这里保留原来的相关样式 */
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
  display: flex;
  width: 1016px;
  margin-left: 24px;
}
</style>