<template>
  <div class="header" :class = "{ 'scrolled': isScrolled} " :key="isAuthor.toString()">
    <img src="/public/images/simurg-reader-logo.svg" alt="simurg reader" class="logo" :style="{marginLeft: marginLeft}"/>
    <div class="header-right-nav">
      <NuxtLink to="/" class="header-nav to-simurg-reader-index" :class="{ 'header-nav-active': $route.path === '/' }">首页</NuxtLink>
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
        @search="handleSearch"/>
      <NuxtLink v-if="!isLoggedIn" class="login-btn" to="/login">登录</NuxtLink>
      <div v-else style="display: flex;">
        <!-- <img class="user-avatar" src="http://www.tireba.com/simurg-reader/images/author1.png" alt=""> -->
        <img class="user-avatar" :src="userAvatar" alt="">
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>
     
  </div>
</template>

<script setup>
  import { isScroll } from 'element-plus/es/utils/index.mjs';
  import { useAuth } from '@/composables/useAuth';

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
  }, { immediate: true });
  watch(isAuthor, (newVal) => {
    console.log('isAuthor changed to:', newVal);
  }, { immediate: true });
  // 检查原始 cookie 值
  const accessTokenCookie = useCookie('accessToken');
  const userCookie = useCookie('user');
  console.log('Raw cookies:', accessTokenCookie.value, userCookie.value);

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
  const handleSearch = (query) => {
    console.log('搜索内容:', query)
  }
  const handleScroll = () => { 
    isScrolled.value = window.scrollY > 84;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
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
  position: absolute;
  right: 360px;
}
.logo {
  width: 192px;
  height: 30px;
  margin-left: 244px;
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
  color: #FF9B51;
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
</style>