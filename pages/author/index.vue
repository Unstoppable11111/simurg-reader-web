<!-- pages/author/index.vue -->
<template>
  <div class="author-page">
    <Header :margin-left="'360px'" :isAuthor="true"/>
    <AuthorContainer ref="authorContainer">
      <template #default="{ activeNav }">
        <AuthorHome 
          v-if="activeNav === 'author-home'"
          :author-info="authorInfo"
        />
        <WorkManagement 
          v-if="activeNav === 'work-management'"
        />
        <div v-if="activeNav === 'work-data'" class="author-content-section">
          <h2>作品数据</h2>
          <p>查看你的作品统计数据</p >
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p >
          </div>
        </div>
        <div v-if="activeNav === 'personal-info'" class="author-content-section">
          <div class="personal-info-title">个人信息</div>
          <p>编辑和管理你的个人信息</p >
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p >
          </div>
        </div>
      </template>
    </AuthorContainer>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import AuthorContainer from "@/components/author/AuthorContainer.vue";
import AuthorHome from "@/components/author/AuthorHome.vue";
import WorkManagement from "@/components/author/WorkManagement.vue";
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const {isLoggedIn, isAuthor, userId} = useAuth();
const authorContainer = ref();
const authorInfo = ref(null);

// 查询作者信息
const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}${userId.value}`;
const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
  method: 'GET'
});
authorInfo.value = authorInfoResult.data;

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && authorContainer.value && ['work-data', 'income-management', 'personal-info', 'notifications', 'benefits', 'contracts'].includes(newTab)) {
      authorContainer.value.switchNav(newTab)
    }
  },
  {immediate: true}
)

onMounted(() => {
  if (route.query.tab && authorContainer.value) {
    authorContainer.value.switchNav(route.query.tab);
  }
});
</script>

<style lang="scss" scoped>
.author-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.author-content-section {
  position: relative;
  width: 100%;
  height: 639px;
  background: #424242;
  border-radius: 6px;
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
}
.personal-info-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin: 35px 0 0 24px;
}
</style>