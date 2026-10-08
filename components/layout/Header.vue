<template>
  <header class="header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- 网站 Logo -->
      <NuxtLink to="/" class="logo-link" title="返回首页">
        <img src="/images/simurg-reader-logo.svg" alt="Simurg Reader" class="logo" />
      </NuxtLink>
      
      <!-- 桌面端导航 -->
      <nav class="header-right-nav">
        <NuxtLink to="/" class="header-nav" :class="{ 'header-nav-active': $route.path === '/' }">
          首页
        </NuxtLink>
        <NuxtLink 
          to="/bookshelf"
          @click.prevent="handleBookShelfClick" 
          class="header-nav" 
          :class="{ 'header-nav-active': $route.path === '/bookshelf' }"
        >
          书架
        </NuxtLink>
        <NuxtLink to="/bookcate" class="header-nav" :class="{ 'header-nav-active': $route.path.startsWith('/bookcate') }">
          分类
        </NuxtLink>
        <NuxtLink to="/ranking" class="header-nav" :class="{ 'header-nav-active': $route.path.startsWith('/ranking') }">
          排行榜
        </NuxtLink>
        
        <client-only>
          <NuxtLink 
            v-if="!isAuthorEffective"
            @click="handleBecomeAuthorClick" 
            class="header-nav"
            :class="{ 'header-nav-active': $route.path === '/becomeAuthor' }"
          >
            成为作家
          </NuxtLink>
          <NuxtLink 
            v-else 
            to="/author" 
            class="header-nav" 
            :class="{ 'header-nav-active': $route.path.startsWith('/author') }"
          >
            作家专区
          </NuxtLink>
        </client-only>
        
        <!-- 搜索框 -->
        <Search 
          class="search" 
          placeholder="请输入书名或作者名"
          @search="handleSearch"
          @input="handleSearchInput"
          @input-change="handleSearchInput"
          @clear="handleSearchClear"  
        />
        
        <!-- 用户登录状态 -->
        <NuxtLink v-if="!isLoggedIn" class="login-btn" to="/login">登录</NuxtLink>
        
        <div v-else class="user-menu-container" @click.stop>
          <div class="user-info" @click="toggleUserDropdown">
            <img class="user-avatar" :src="userAvatar || '/icon/author-default-avatar.svg'" alt="用户头像" />
            <span class="user-name">{{ userName || '用户' }}</span>
            <svg class="dropdown-arrow" :class="{ 'arrow-open': isDropdownOpen }" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 7L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <transition name="dropdown-fade">
            <div class="user-dropdown" v-show="isDropdownOpen">
              <div class="dropdown-item" @click="goToUserCenter">个人中心</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout-btn" @click="handleLogout">退出登录</div>
            </div>
          </transition>
        </div>

        <!-- 移动端汉堡菜单触发按钮 -->
        <button 
          class="mobile-menu-btn" 
          @click.stop="toggleMobileMenu" 
          :aria-expanded="isMobileMenuOpen"
          aria-label="切换导航菜单"
        >
          <svg v-if="!isMobileMenuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </nav>
    </div>

    <!-- 移动端抽屉导航 -->
    <transition name="mobile-drawer">
      <div class="mobile-drawer" v-show="isMobileMenuOpen" @click.stop>
        <div class="mobile-nav-list">
          <NuxtLink to="/" class="mobile-nav-item" @click="closeMobileMenu">
            首页
          </NuxtLink>
          <NuxtLink to="/bookshelf" @click.prevent="handleBookShelfClickMobile" class="mobile-nav-item">
            我的书架
          </NuxtLink>
          <NuxtLink to="/bookcate" class="mobile-nav-item" @click="closeMobileMenu">
            全部分类
          </NuxtLink>
          <NuxtLink to="/ranking" class="mobile-nav-item" @click="closeMobileMenu">
            畅销榜单
          </NuxtLink>
          <NuxtLink 
            v-if="!isAuthorEffective"
            to="/becomeAuthor" 
            class="mobile-nav-item" 
            @click="closeMobileMenu"
          >
            成为作家
          </NuxtLink>
          <NuxtLink 
            v-else 
            to="/author" 
            class="mobile-nav-item" 
            @click="closeMobileMenu"
          >
            作家专区
          </NuxtLink>

          <div class="mobile-drawer-divider"></div>

          <div v-if="!isLoggedIn" class="mobile-auth-section">
            <NuxtLink to="/login" class="mobile-login-btn" @click="closeMobileMenu">
              立即登录
            </NuxtLink>
          </div>
          <div v-else class="mobile-user-section">
            <div class="mobile-user-profile" @click="goToUserCenter">
              <img :src="userAvatar || '/icon/author-default-avatar.svg'" class="mobile-avatar" alt="Avatar">
              <span class="mobile-username">{{ userName || '用户' }}</span>
            </div>
            <button class="mobile-logout-btn" @click="handleLogout">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import Search from '@/components/search/Search.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const emit = defineEmits(['trigger-search', 'clear-search']);

const props = defineProps({
  marginLeft: { type: String, default: "0px" },
  isAuthor: { type: Boolean, default: false }
});

const { isLoggedIn, isAuthor: authIsAuthor, userAvatar, userName } = useAuth();
const isAuthorEffective = computed(() => props.isAuthor || authIsAuthor.value);

const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

watch(isLoggedIn, (newVal) => {
  if (!newVal) isDropdownOpen.value = false;
}, { immediate: true });

watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false;
  isDropdownOpen.value = false;
});

const toggleUserDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.user-menu-container')) {
    isDropdownOpen.value = false;
  }
  if (!target.closest('.mobile-drawer') && !target.closest('.mobile-menu-btn')) {
    isMobileMenuOpen.value = false;
  }
};

const handleLogout = async () => {
  try {
    isDropdownOpen.value = false;
    isMobileMenuOpen.value = false;
    await authStore.logout();
    ElMessage.success('成功退出登录');
    router.push('/');
  } catch (error) {
    ElMessage.error('退出登录失败，请重试');
  }
};

const goToUserCenter = () => {
  isDropdownOpen.value = false;
  isMobileMenuOpen.value = false;
  if (isAuthorEffective.value) {
    router.push({ path: '/author', query: { tab: 'author-home' } });
  } else {
    router.push('/bookshelf');
  }
};

const handleBookShelfClick = () => {
  if (!isLoggedIn.value) {
    router.push('/login?redirectPath=/bookshelf');
  } else {
    router.push('/bookshelf');
  }
};

const handleBookShelfClickMobile = () => {
  closeMobileMenu();
  handleBookShelfClick();
};

const handleBecomeAuthorClick = () => {
  if (!isLoggedIn.value) {
    router.push('/login?redirectPath=/becomeAuthor');
  } else {
    router.push('/becomeAuthor');
  }
};

const handleSearch = (query: string) => {
  if (!query?.trim()) {
    emit('clear-search');
    return;
  }
  const trimmed = query.trim();
  if (route.path !== '/') {
    // 跨页面搜索：跳转首页并携带搜索参数
    router.push({ path: '/', query: { q: trimmed } });
  } else {
    emit('trigger-search', trimmed);
  }
};

const handleSearchInput = (value: string) => {
  if (route.path === '/') {
    value?.trim() ? emit('trigger-search', value.trim()) : emit('clear-search');
  }
};

const handleSearchClear = () => {
  emit('clear-search');
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', closeDropdown);
});
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: var(--z-index-sticky, 1020);
  background-color: transparent;
  transition: background-color var(--transition-normal, 250ms ease),
              box-shadow var(--transition-normal, 250ms ease),
              backdrop-filter var(--transition-normal, 250ms ease);

  &.scrolled {
    background-color: rgba(19, 20, 21, 0.88);
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  width: 160px;
  height: 28px;
  object-fit: contain;
}

.header-right-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.header-nav {
  position: relative;
  color: var(--color-text-secondary, #b0b1b3);
  font-size: var(--font-size-body, 14px);
  text-decoration: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color var(--duration-small, 180ms) var(--ease-standard);
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--color-brand-primary, #e59344);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform var(--duration-small, 200ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
  }

  &:hover {
    color: var(--color-brand-primary, #e59344);

    &::after {
      transform: scaleX(0.6);
    }
  }

  &.header-nav-active {
    color: var(--color-text-primary, #ffffff);
    font-weight: 600;

    &::after {
      transform: scaleX(1);
    }
  }
}

.search {
  margin: 0;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  background: var(--color-brand-primary, #e59344);
  border-radius: var(--radius-full, 9999px);
  font-size: var(--font-size-body, 14px);
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  transition: all var(--transition-fast, 150ms ease);

  &:hover {
    background: var(--color-brand-hover, #cc7b30);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(229, 147, 68, 0.3);
  }
}

.user-menu-container {
  position: relative;
  display: flex;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-full, 9999px);
    transition: background-color var(--transition-fast, 150ms ease);

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .user-name {
      font-size: var(--font-size-body, 14px);
      color: var(--color-text-primary, #ffffff);
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-arrow {
      color: var(--color-text-muted, #7c7e82);
      transition: transform var(--transition-fast, 150ms ease);

      &.arrow-open {
        transform: rotate(180deg);
      }
    }
  }

  .user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 150px;
    background: var(--color-surface-elevated, #212327);
    border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.5));
    z-index: 1050;
    padding: 6px 0;

    .dropdown-item {
      padding: 10px 16px;
      color: var(--color-text-primary, #ffffff);
      font-size: var(--font-size-small, 13px);
      cursor: pointer;
      transition: background-color var(--transition-fast, 150ms ease);

      &:hover {
        background-color: var(--color-surface-hover, rgba(255, 255, 255, 0.05));
      }
    }

    .dropdown-divider {
      height: 1px;
      background-color: var(--color-border-subtle, rgba(255, 255, 255, 0.08));
      margin: 4px 0;
    }

    .logout-btn {
      color: var(--color-status-error, #f87171);
      &:hover {
        background-color: rgba(248, 113, 113, 0.1);
      }
    }
  }
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-primary, #ffffff);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

/* 移动端抽屉菜单 */
.mobile-drawer {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(19, 20, 21, 0.96);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  padding: 16px 24px 24px;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav-item {
  display: block;
  padding: 10px 12px;
  font-size: 15px;
  color: var(--color-text-secondary, #b0b1b3);
  text-decoration: none;
  border-radius: 6px;
  transition: all var(--transition-fast, 150ms ease);

  &:hover, &.router-link-active {
    background: rgba(255, 255, 255, 0.06);
    color: var(--color-brand-primary, #e59344);
  }
}

.mobile-drawer-divider {
  height: 1px;
  background: var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  margin: 8px 0;
}

.mobile-auth-section {
  display: flex;
  padding-top: 6px;
}

.mobile-login-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 10px;
  background: var(--color-brand-primary, #e59344);
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.mobile-user-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
}

.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.mobile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.mobile-username {
  color: var(--color-text-primary, #ffffff);
  font-size: 14px;
}

.mobile-logout-btn {
  background: none;
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: var(--color-status-error, #f87171);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

/* 用户下拉菜单动画 */
.dropdown-fade-enter-active {
  transition: opacity var(--duration-micro, 120ms) ease,
              transform var(--duration-small, 180ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
}
.dropdown-fade-leave-active {
  transition: opacity var(--duration-micro, 120ms) ease,
              transform var(--duration-micro, 120ms) ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* 抽屉过渡动画 */
.mobile-drawer-enter-active {
  transition: opacity var(--duration-small, 200ms) ease, 
              transform var(--duration-small, 200ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
}
.mobile-drawer-leave-active {
  transition: opacity 160ms ease, 
              transform 160ms var(--ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 900px) {
  .header {
    height: 60px;
  }

  .header-container {
    padding: 0 16px;
  }

  .logo {
    width: 120px;
    height: 24px;
  }

  .header-nav {
    display: none;
  }

  .header-right-nav {
    gap: 8px;
  }

  .login-btn {
    padding: 4px 12px;
    font-size: 13px;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  .user-name {
    display: none !important;
  }

  .dropdown-arrow {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 10px;
  }

  .logo {
    width: 100px;
    height: 20px;
  }

  .header-right-nav {
    gap: 6px;
  }

  .login-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>