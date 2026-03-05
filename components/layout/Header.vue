<template>
  <div class="header" :class="{ 'scrolled': isScrolled }" :key="isAuthor.toString()">
    <img src="/public/images/simurg-reader-logo.svg" alt="simurg reader" class="logo" />
    
    <div class="header-right-nav">
      <a href="/" class="header-nav to-simurg-reader-index" :class="{ 'header-nav-active': $route.path === '/' }">首页</a>
      <a
        @click="handleBookShelfClick" 
        class="header-nav to-bookshelf"
        :class="{ 'header-nav-active': $route.path === '/bookshelf' }"
      >书架</a>
      <NuxtLink to="/ranking" class="header-nav to-ranking" :class="{ 'header-nav-active': $route.path === '/ranking' }">排行榜</NuxtLink>
      <client-only>
      <NuxtLink 
        v-if="!isAuthor"
        @click="handleBecomeAuthorClick" 
        class="header-nav to-become-author"
        :class="{ 'header-nav-active': $route.path === '/becomeAuthor' }">
        成为作家
      </NuxtLink >
      <NuxtLink 
        v-else 
        to="/author" 
        class="header-nav to-become-author" 
        :class="{ 'header-nav-active': $route.path === '/author' }">
        作家专区
      </NuxtLink>
      </client-only>
      
      
      <Search class="search" 
        placeholder="请输入书名或作者名"
        @search="handleSearch"
        @input-change="handleSearchInput"
        @clear="handleSearchClear"  
      />
      
      <NuxtLink v-if="!isLoggedIn" class="login-btn" to="/login">登录</NuxtLink>
      
      <div v-else class="user-menu-container" @click.stop>
        <div class="user-info" @click="toggleUserDropdown">
          <img class="user-avatar" :src="userAvatar" alt="用户头像" />
          <span class="user-name">{{ userName }}</span>
          <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 7L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <div class="user-dropdown" v-show="isDropdownOpen">
          <div class="dropdown-item" @click="goToUserCenter">个人中心</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout-btn" @click="handleLogout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from '@/composables/useAuth';
  import { useAuthStore } from '@/stores/auth';
  const authStore = useAuthStore();
  const emit = defineEmits(['trigger-search', 'clear-search']);
  const isDropdownOpen = ref(false);
  const router = useRouter();
  const props = defineProps({
    marginLeft: { type: String, default: "0px" },
    isAuthor: { type: Boolean, default: false }
  });
  const {isLoggedIn, isAuthor, userAvatar, userName} = useAuth();

  watch(isLoggedIn, (newVal) => {
    if (!newVal) isDropdownOpen.value = false;
  }, { immediate: true });

  const toggleUserDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value; };
  const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-container')) isDropdownOpen.value = false;
  };

  const handleLogout = async () => {
    try {
      isDropdownOpen.value = false;
      await authStore.logout();
      ElMessage.success('成功退出登录'); 
      router.push('/');
    } catch (error) {
      ElMessage.error('退出登录失败，请重试');
    }
  };

  const goToUserCenter = () => {
    isDropdownOpen.value = false; 
    // isAuthor.value ? router.push('/author?tab=author-home') : router.push('/user');
    isAuthor.value ? toAuthorHome() : router.push('/user');
  };

  const toAuthorHome = () => {
    useRouter().push({
      path: '/author',
      query: { tab: 'author-home' }
    })
  }

  const handleBookShelfClick = () => {
    !isLoggedIn.value ? router.push('/login?redirectPath=/bookshelf') : router.push('/bookshelf');
  }
  const handleBecomeAuthorClick = () => {
    !isLoggedIn.value ? router.push('/login?redirectPath=/becomeAuthor') : router.push('/becomeAuthor');
  }

  const isScrolled = ref(false);
  const handleSearch = async (query) => {
    if (!query.trim()) { emit('clear-search'); return; }
    emit('trigger-search', query.trim());
  }

  const handleSearchInput = (value) => {
    value.trim() ? emit('trigger-search', value.trim()) : emit('clear-search');
  };
  const handleSearchClear = () => { emit('clear-search'); };
  const handleScroll = () => { isScrolled.value = window.scrollY > 84; }

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
  width: 100%;
  height: 84px;
  align-items: center;
  z-index: 1000;
  background-color: transparent;
  padding: 0 40px;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: -1;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::before,
  &.scrolled::before {
    transform: scaleY(1);
  }
}

.logo {
  width: 192px;
  height: 30px;
  flex-shrink: 0;
}

.header-right-nav {
  display: flex;
  align-items: center;
  margin-left: auto; // 自动推至右侧
}

.header-nav {
  margin-right: 44px;
  color: #FFFFFF;
  font-size: 14px;
  text-decoration: none;
}

.header-nav-active {
  font-weight: 600;
}
.to-bookshelf {
  cursor: pointer;
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
  color: #000;
  text-decoration: none;
}

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
      font-size: 18px;
      color: #FFFFFF;
      margin-left: 9px;
      margin-right: 6px;
    }

    .dropdown-arrow {
      transition: transform 0.2s ease;
    }
  }
  
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
      color: #FF4D4F;
      &:hover {
        background-color: rgba(255, 77, 79, 0.2);
      }
    }
  }
}

/* PC 端特定边距补偿 */
@media screen and (min-width: 1440px) {
  .header {
    padding: 0 360px; // 保持你设计稿的超大边距
  }
}

/* --- 移动端兼容性调整 --- */
@media screen and (max-width: 768px) {
  .header {
    height: 60px;
    padding: 0 16px;
    justify-content: flex-end;
    .logo {
      width: 120px;
    }

    .header-nav:not(.search) {
      display: none; // 移动端隐藏文字导航
    }

    .search {
      margin-right: 15px;
    }

    .user-menu-container {
      .user-info {
        .user-avatar {
          margin-left: 10px;
        }
        .user-name, .dropdown-arrow {
          display: none; // 仅保留头像
        }
      }
    }
  }
}
</style>