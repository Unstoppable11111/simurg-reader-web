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
          <SvgIcon name="home" class="home" size="12" color=""/>
          作者首页
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeNav === 'work-management' }"
          @click="switchNav('work-management')"
        >
          <SvgIcon name="bookshelf" class="bookshelf" size="12" color=""/>
          作品管理
        </div>
        <!-- <div 
          class="nav-item" 
          :class="{ active: activeNav === 'work-data' }"
          @click="switchNav('work-data')"
        >
          作品数据
        </div> -->
        <div 
          class="nav-item" 
          :class="{ active: activeNav === 'author-info' }"
          @click="switchNav('author-info')"
        >
          <SvgIcon name="personal-msg" class="personal-msg" size="12" color=""/>
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
import SvgIcon from "@/components/SvgIcon.vue";
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
  width: 160px;
  text-align: center;
}
.nav-list {
  display: flex;
  flex-direction: column;
}
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 48px;
  background: #424242;
  line-height: 48px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  font-style: normal;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(249,110,8,0.35);
  }
  
  &.active {
    background: rgba(249,110,8,0.35);
    color: #F9A825;
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
.home, .personal-msg, .bookshelf {
  margin-right: 4px;
}

@media (max-width: 768px) {
  .author-container {
    flex-direction: column;
    margin-top: 90px;
    width: 100%;
    padding: 0 16px;
  }
  .author-left-nav-box {
    width: 100%;
  }
  .nav-list {
    flex-direction: row;
    gap: 8px;
  }
  .nav-item {
    width: calc(33.333% - 6px);
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    font-size: 12px;
  }
  .nav-item:first-child.active,
  .nav-item:first-child:hover,
  .nav-item:last-child.active,
  .nav-item:last-child:hover {
    border-radius: 10px;
  }
  .author-right-content-box {
    width: 100%;
    margin-left: 0;
    margin-top: 12px;
  }
}
</style>
