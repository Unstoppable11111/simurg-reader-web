<template>
  <div class="header">
    <img src="/public/images/simurg-reader-logo.png" alt="simurg reader" class="logo" :style="{marginLeft: marginLeft}"/>
    <img src="/public/images/simurg-reader.png" alt="simurg reader" class="simurg-reader" />
    <NuxtLink to="/" class="header-nav to-simurg-reader-index" :class="{ 'header-nav-active': $route.path === '/' }">首页</NuxtLink>
    <NuxtLink to="/bookshelf" class="header-nav to-bookshelf" :class="{ 'header-nav-active': $route.path === '/bookshelf' }">书架</NuxtLink>
    <NuxtLink to="/ranking" class="header-nav to-ranking" :class="{ 'header-nav-active': $route.path === '/ranking' }">排行榜</NuxtLink>
    <NuxtLink 
      v-if="!isAuthor" 
      to="/becomeAuthor" 
      class="header-nav to-become-author" 
      :class="{ 'header-nav-active': $route.path === '/becomeAuthor' }">
      成为作家
    </NuxtLink>
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
</template>

<script setup>
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

   // 从cookie中获取用户信息
  const userCookie = useCookie('user')
  const accessTokenCookie = useCookie('accessToken')
  
  // 计算属性：是否已登录
  const isLoggedIn = computed(() => {
     // 更详细的调试信息
    console.log('Checking login status:');
    console.log('- accessTokenCookie.value:', accessTokenCookie.value);
    console.log('- userCookie.value:', userCookie.value);
    console.log('- !!accessTokenCookie.value:', !!accessTokenCookie.value);
    console.log('- !!userCookie.value:', !!userCookie.value);
    
    const loggedIn = !!accessTokenCookie.value && !!userCookie.value;
    console.log('- isLoggedIn result:', loggedIn);
    return loggedIn;
  })
  
  // 用户头像和名称
  const userAvatar = computed(() => {
    const avatar = userCookie.value?.avatar || 'http://www.tireba.com/simurg-reader/images/author1.png';
    console.log('Computed userAvatar:', avatar);
    return avatar;
  })
  
  const userName = computed(() => {
    const name = userCookie.value?.username || '用户';
    console.log('Computed userName:', name);
    return name;
  })

    const handleSearch = (query) => {
    console.log('搜索内容:', query)
    }


</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  width: 1920px;
  height: 84px;
  align-items: center;
  z-index: 1000;
}
.logo {
  width: 54px;
  height: 30px;
  // margin-left: 244px;
}
.simurg-reader {
  width: 182px;
  height: 24px;
  margin-left: 6px;
}
.to-simurg-reader-index {
  margin-left: 318px;
  height: 25px;
  font-size: 18px;
  color: #FFFFFF;
  text-align: left;
}
.header-nav {
  margin-right: 44px;
  color: #FFFFFF;
  text-align: left;
  font-style: normal;
}
.to-bookshelf {
  height: 25px;
  font-size: 18px;
}
.to-ranking {
  height: 25px;
  font-size: 18px;
}
.to-become-author {
  height: 25px;
  font-size: 18px;
  color: #FF9B51;
}

.header-nav-active {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
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