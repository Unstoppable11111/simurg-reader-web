<!-- pages/author/index.vue -->
<template>
  <div class="author-page">
    <Header :margin-left="'360px'" :isAuthor="true"/>
    <AuthorContainer ref="authorContainer">
      <template #default="{ activeNav }">
        <div class="author-nav-content" key="author-home" v-if="activeNav === 'author-home'">
          <AuthorHome 
            :author-info="authorInfo"
            @to-edit-book="handleToEditBook" 
            @to-work-management="handleToWorkManagement"
            @to-create-book="handleToCreateBook"
          />
        </div>
        <ClientOnly>
          <WorkManagement v-if="activeNav === 'work-management'" ref="workManagementRef" />
        </ClientOnly>
        <div class="author-nav-content" key="author-info" v-if="activeNav === 'author-info'">
          <AuthorInfo />
        </div>
      </template>
    </AuthorContainer>
  </div>
</template>

<script setup lang="ts">
  import Header from "@/components/layout/Header.vue";
  import AuthorContainer from "@/components/author/AuthorContainer.vue";
  import AuthorHome from "@/components/author/AuthorHome.vue";
  import AuthorInfo from "@/components/author/AuthorInfo.vue";
  import WorkManagement from "@/components/author/WorkManagement.vue";
  import { useAuth } from '@/composables/useAuth';
import { resolve } from "node:dns";
import { tr } from "element-plus/es/locale/index.mjs";

  const route = useRoute();
  const {isLoggedIn, isAuthor, userId} = useAuth();
  const authorContainer = ref();
  const authorInfo = ref(null);
  const workManagementRef = ref(null);

  // 查询作者信息
  const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}`;
  const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
    method: 'GET'
  });
  console.log("作者信息", authorInfoResult);
  authorInfo.value = authorInfoResult.data;
  // 处理authorHome的作品设置点击事件
  const handleToEditBook = async (bookData: any) => {
    if ( !authorContainer.value ) return;
    authorContainer.value.switchNav('work-management');
    const maxWaitTime = 2000;
    const checkInterval = 50;
    let elapsedTime = 0;
    let isMounted = false;
    while ( elapsedTime < maxWaitTime ) {
      if (workManagementRef.value && typeof workManagementRef.value.openCreateBook === 'function') {
        workManagementRef.value.openCreateBook(bookData);
        isMounted = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      elapsedTime += checkInterval;
    }
    if (!isMounted) {
      console.error('❌ WorkManagement 组件或 openCreateBook 方法未找到');
    }
  };
  // 点击更多跳转到作品管理
  const handleToWorkManagement  = async (chapterData: any) => { 
    if (authorContainer.value) {
      authorContainer.value.switchNav('work-management');
    }
  };
  // 新增跳转到创建新书
  const handleToCreateBook = async () => {
    if ( !process.client || !authorContainer.value) return;
    authorContainer.value.switchNav('work-management');

    
    const maxWaitTime = 1000;
    const checkInterval = 50;
    let elapsedTime = 0;
    while ( !workManagementRef.value && elapsedTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval)); 
      elapsedTime += checkInterval;
    }  
    
    if (workManagementRef.value) {
      workManagementRef.value.openCreateBook();
    } else {
      console.error('❌ WorkManagement ref为空，请检查：');
    }
  }

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