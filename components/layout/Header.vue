<template>
  <div class="header" :class = "{ 'scrolled': isScrolled} " :key="isAuthor.toString()">
    <img src="/public/images/simurg-reader-logo.svg" alt="simurg reader" class="logo" :style="{marginLeft: marginLeft}"/>
    <div class="header-right-nav">
      <a href="/" class="header-nav to-simurg-reader-index" :class="{ 'header-nav-active': $route.path === '/' }">首页</a>
      <a
        @click="handleBookShelfClick" 
        class="header-nav to-bookshelf"
        :class="{ 'header-nav-active': $route.path === '/bookshelf' }"
      >书架</a>
      <NuxtLink to="/ranking" class="header-nav to-ranking" :class="{ 'header-nav-active': $route.path === '/ranking' }">排行榜</NuxtLink>
      <a
        v-if="!isAuthor"
        @click="handleBecomeAuthorClick" 
        to="/becomeAuthor" 
        class="header-nav to-become-author"
        :class="{ 'header-nav-active': $route.path === '/becomeAuthor' }">
        成为作家
      </a>
      <NuxtLink 
        v-else 
        to="/author" 
        class="header-nav to-become-author" 
        :class="{ 'header-nav-active': $route.path === '/author' }">
        作家专区
      </NuxtLink>
      <Search class="search" 
        placeholder="请输入书名或作者名"
        @search="handleSearch"
        @input-change="handleSearchInput"
        @clear="handleSearchClear"  
      />
      <NuxtLink v-if="!isLoggedIn" class="login-btn" to="/login">登录</NuxtLink>
      <!-- 已登录：用户信息 + 下拉框 -->
      <div v-else class="user-menu-container" @click.stop>
        <div class="user-info" @click="toggleUserDropdown">
          <img class="user-avatar" :src="userAvatar" alt="用户头像" />
          <span class="user-name">{{ userName }}</span>
          <!-- 下拉箭头 -->
          <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 7L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- 下拉菜单 -->
        <div class="user-dropdown" v-show="isDropdownOpen">
          <div class="dropdown-item" @click="goToUserCenter">个人中心</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout-btn" @click="handleLogout">注销</div>
        </div>
      </div>
      
      <!-- <div v-else style="display: flex;">
        <img class="user-avatar" :src="userAvatar" alt="" @click="goToUserCenter">
        <span class="user-name" @click="goToUserCenter">{{ userName }}</span>
      </div> -->
    </div>
     
  </div>
</template>

<script setup lang="ts">
  import { isScroll } from 'element-plus/es/utils/index.mjs';
  import { useAuth } from '@/composables/useAuth';
  import { useAuthStore } from '@/stores/auth';
  const authStore = useAuthStore();
  // 新增：定义emit事件，向父组件传递搜索关键词
  const emit = defineEmits(['trigger-search', 'clear-search']);
  const isDropdownOpen = ref(false);
  const router = useRouter();
  const props = defineProps({
    marginLeft: {
      type: String,
      default: "0px" // 默认值，可选
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  });
  const {isLoggedIn, isAuthor, userAvatar, userName} = useAuth();
  // 调试日志
  console.log('Initial isLoggedIn:', isLoggedIn.value);
  watch(isLoggedIn, (newVal) => {
    console.log('isLoggedIn changed to:', newVal);
    if (!newVal) isDropdownOpen.value = false;
  }, { immediate: true });
  watch(isAuthor, (newVal) => {
    console.log('isAuthor changed to:', newVal);
  }, { immediate: true });
  // 检查原始 cookie 值
  const accessTokenCookie = useCookie('accessToken');
  const userCookie = useCookie('user');
  console.log('Raw cookies:', accessTokenCookie.value, userCookie.value);

  // 切换下拉框显隐
  const toggleUserDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  // 关闭下拉框（点击页面其他区域）
  const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      isDropdownOpen.value = false;
    }
  };

  // 注销登录逻辑
  const handleLogout = async () => {
    try {
      
      isDropdownOpen.value = false;
      const response = await authStore.logout();
      // 4. 跳转首页
      ElMessage.success('注销成功'); // 需引入ElMessage
      router.push('/');
    } catch (error) {
      console.error('注销失败:', error);
      ElMessage.error('注销失败，请重试');
    }
  };

  const goToUserCenter = () => {
    isDropdownOpen.value = false; // 进入个人中心时关闭下拉框
    if (isAuthor.value) {
      router.push('/author?tab=personal-info');
    } else {
      router.push('/user');
    }
  };

  const handleBookShelfClick = () => {
    if (!isLoggedIn.value) {
      router.push('/login?redirectPath=/bookshelf');
    } else {
      router.push('/bookshelf');
    }
  }
  const handleBecomeAuthorClick = () => {
    if (!isLoggedIn.value) {
      router.push('/login?redirectPath=/becomeAuthor');
    } else {
      router.push('/becomeAuthor');
    }
  }

  const isScrolled = ref(false);
  const handleSearch = async (query) => {
    if (!query.trim()) {
      emit('clear-search'); // 搜索按钮点击时若为空，也清空
      return;
    }
    emit('trigger-search', query.trim());
  }

  // 新增：可选 - 实时输入时触发（比如输入完成后自动搜索）
  const handleSearchInput = (value) => {
    const trimedValue = value.trim();
    if (trimedValue) {
      // 有内容：触发搜索（可选加防抖）
      emit('trigger-search', trimedValue);
    } else {
      // 无内容：通知首页清空搜索，恢复原内容
      emit('clear-search');
    }
  };
  // 2. 监听输入框清空按钮（如Search组件有清除按钮时）
  const handleSearchClear = () => {
    emit('clear-search');
  };
  const handleScroll = () => { 
    isScrolled.value = window.scrollY > 84;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', closeDropdown);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', closeDropdown);
  });


</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  width: 100vw;
  height: 84px;
  align-items: center;
  z-index: 1000;
}
.header.scrolled {
  background-color: rgba(0, 0, 0, 0.8); // 可以根据需要调整颜色和透明度
  backdrop-filter: blur(10px); // 添加模糊效果（可选）
}
.header-right-nav {
  display: flex;
  align-items: center;
  position: absolute;
  right: 360px;
}
.logo {
  width: 192px;
  height: 30px;
  margin-left: 360px;
}
.simurg-reader {
  width: 182px;
  height: 24px;
  margin-left: 6px;
}
.to-simurg-reader-index {
  margin-left: 318px;
  height: 25px;
  color: #FFFFFF;
  text-align: left;
}
.header-nav {
  margin-right: 44px;
  color: #FFFFFF;
  font-size: 14px;
  text-align: left;
  font-style: normal;
}
.to-bookshelf {
  height: 25px;
  &:hover {
    cursor: pointer;
  }
}
.to-ranking {
  height: 25px;
}
.to-become-author {
  height: 25px;
  color: #F9A825;
  &:hover {
    cursor: pointer;
  }
}

.header-nav-active {
  font-weight: 600;
}
.search {
  margin-right: 44px;
}
.login-btn {
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: #FFFFFF;
  border-radius: 16px;
  text-align: center;
  font-size: 14px;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: 46px;
}
.user-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: left;
  font-style: normal;
  margin-left: 9px;
}

// 新增：用户菜单样式
.user-menu-container {
  position: relative;
  display: flex;
  align-items: center;
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-left: 46px;
    }
    
    .user-name {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      line-height: 25px;
      text-align: left;
      font-style: normal;
      margin-left: 9px;
      margin-right: 6px;
    }
    
    .dropdown-arrow {
      transition: transform 0.2s ease;
    }
  }
  
  // 下拉框样式
  .user-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 160px;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1001;
    padding: 8px 0;
    
    .dropdown-item {
      padding: 10px 16px;
      color: #FFFFFF;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 4px 0;
    }
    
    .logout-btn {
      color: #FF4D4F; // 注销按钮红色突出
      
      &:hover {
        background-color: rgba(255, 77, 79, 0.2);
      }
    }
  }
}

// 下拉框展开时箭头旋转
.user-menu-container:has(.user-dropdown[style*="display: block"]) .dropdown-arrow {
  transform: rotate(180deg);
}
</style>