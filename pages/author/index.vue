<!-- pages/author/index.vue -->
<template>
  <div class="author-page">
    <Header :margin-left="'360px'" :isAuthor="true"/>
    <AuthorContainer ref="authorContainer">
      <template #default="{ activeNav }">
        <AuthorHome 
          v-if="activeNav === 'author-home'"
          :author-info="authorInfo"
          @to-edit-book="handleToEditBook" 
          @to-work-management="handleToWorkManagement"
          @to-create-book="handleToCreateBook"
        />
        <WorkManagement 
          v-show="activeNav === 'work-management'"
          ref="workManagementRef"
        />
        <AuthorInfo 
          v-if="activeNav === 'author-info'"
        />
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
    if (authorContainer.value) {
      authorContainer.value.switchNav('work-management');
    }
    await nextTick();
    if (workManagementRef.value) {
      console.log("调用子组件打开设置", workManagementRef.value);
      workManagementRef.value.openCreateBook(bookData);
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
    // 1. 强制客户端执行标签页切换
  if (process.client && authorContainer.value) {
    authorContainer.value.switchNav('work-management');
    // 2. 等待DOM更新 + 组件挂载（延长等待，适配Nuxt异步渲染）
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100)); // 兜底等待（可调整时长）
    
    // 3. 校验ref是否获取到实例
    console.log('WorkManagement实例:', workManagementRef.value);
    if (workManagementRef.value) {
      workManagementRef.value.openCreateBook();
    } else {
      console.error('❌ WorkManagement ref为空，请检查：');
      console.error('- 标签页是否真的切换到了「作品管理」');
      console.error('- WorkManagement组件是否加了 <ClientOnly> 但未处理');
    }
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