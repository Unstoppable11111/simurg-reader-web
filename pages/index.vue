<template>
    <div class="home-page">
        <!-- 透明导航栏（通过绝对定位悬浮） -->
      <Header :margin-left="'244px'"/>
      
      <!-- 轮播图（作为背景层） -->
      <Carousel  class="carousel" />

      <!-- 精选专区 -->
      <div class="featured-section">
        <span class="featured-title">精选</span>
        <!-- 这里放精选内容 -->
        <FeatureCard :books="books" />
      </div>

      <!-- 推荐专区 -->
      <div class="recommend-section">
        <span class="recommend-title">推荐</span>
        <Recommend :recommendBooks="recommendBooks" />
      </div>

      <!-- 排行榜 -->
      <div class="ranking-section">
        <!-- 这里放排行榜内容 -->
        <div class="ranking-title-h2">
          <span class="ranking-title">排行榜</span>
          <NuxtLink to="/ranking" class="ranking-more">更多</NuxtLink>
        </div>
        <Ranking />
      </div>

      <!-- 签约新书(第一期没有签约的书籍) -->
      <!-- <div class="newly-signed-section">
        <span class="newly-signed-title">签约新书</span>
        <NewlySigned />
      </div> -->

      <!-- 分类 -->
      <div class="book-cate-section">
        <div class="book-cate-container">
          <span class="book-cate-title">分类</span>
          <span class="book-cate-more">更多</span>
        </div>
        <BookCate :bookCateList="bookCateList" />
      </div>

      <!-- 最近更新书籍日志 -->
      <div class="last-update-book-section">
        <div class="last-update-book-title">最近更新</div>
        <LastUpdateBook :recentUpdateBooks="recentUpdateBooks" />
      </div>

      <Footer />

      <!-- 回到顶部按钮 -->
      <div 
        v-if="showBackToTop" 
        class="back-to-top"
        @click="scrollToTop"
      >
        ↑
      </div>

    </div>
</template>

<script setup>
  import Header from '@/components/layout/Header.vue';
  import Carousel from '@/components/home/Carousel.vue';
  import FeatureCard from '~/components/home/FeatureCard.vue';
  import Recommend from '~/components/home/Recommend.vue';
  import Ranking from '~/components/home/Ranking.vue';
  import NewlySigned from '~/components/home/NewlySigned.vue';
  import BookCate from '~/components/home/BookCate.vue';
  import LastUpdateBook from '~/components/home/LastUpdateBook.vue';
  import Footer from '@/components/layout/Footer.vue';
  import { API_ENDPOINTS, apiRequest } from '@/utils/api';
  import { tr } from 'element-plus/es/locale/index.mjs';

  definePageMeta({
    layout: 'default' // 可指定默认布局名称（可选）
  })

  const banners = ref([]);
  const books = ref([]);
  const recommendBooks = ref([]);
  const bookCateList = ref([]);
  const recentUpdateBooks = ref([]);

  try {
    const featureBookUrl = new URL(`${API_ENDPOINTS.TAG_BOOKS}/FEATURED`);
    const bookResult = await apiRequest(featureBookUrl);
    console.log("精选书籍", bookResult);
    if (bookResult.code === 200 && Array.isArray(bookResult.data)) {
      books.value = bookResult.data;
    }
  } catch (error) {
  }
  
  // 获取推荐书籍
  try {
    const recommendBookUrl = new URL(`${API_ENDPOINTS.TAG_BOOKS}/RECOMMEND`);
    const recommendBookResult = await apiRequest(recommendBookUrl);
    console.log("推荐书籍", recommendBookResult);
    if (recommendBookResult.code === 200 && Array.isArray(recommendBookResult.data)) {
      recommendBooks.value = recommendBookResult.data.slice(0, 4);
    }
  } catch (error) {
  }

  // 获取书籍分类
  try {
    const bookCateResult = await apiRequest(API_ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify({})
    });
    console.log("书籍分类", bookCateResult)
    if (!bookCateResult.code === 200) {
      throw new Error(`HTTP error! status: ${bookCateResult.status}`)
    }
    
    const result = await bookCateResult
    
    if (result.code === 200 && Array.isArray(result.data)) {
      bookCateList.value = result.data;
    }
  } catch (error) {
  }

  // 获取最近更新书籍
  try {
    const recentUpdateBookUrl = {
      size: 10, // 获取书籍数量
    };
    const recentUpdateBookResult = await apiRequest(API_ENDPOINTS.RECENT_UPDATE_BOOKS, {
      method: 'POST',
      body: JSON.stringify(recentUpdateBookUrl)
    });
    if (recentUpdateBookResult.code === 200 && Array.isArray(recentUpdateBookResult.data)) {
      recentUpdateBooks.value = recentUpdateBookResult.data;
    }
    console.log("最近更新书籍", recentUpdateBookResult)
  } catch (error) {
  }

  // 获取轮播图数据（完全保留原有逻辑）
  try {
    const bannerResult = await apiRequest(API_ENDPOINTS.BANNERS)
    console.log("轮播图数据", bannerResult)
    if (!bannerResult.code === 200) {
      throw new Error(`HTTP error! status: ${bannerResult.status}`)
    }
    
    const result = await bannerResult
    
    if (result.code === 200 && Array.isArray(result.data)) {
      banners.value = result.data
    } 
  } catch (error) {
  }
  

  // 回到顶部功能
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };
  
  // 控制回到顶部按钮的显示
  const showBackToTop = ref(false);
  
  // 监听滚动事件
  onMounted(() => {
    window.addEventListener('scroll', () => {
      showBackToTop.value = window.scrollY > 300;
    });
  });

</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
.carousel {
  width: 100vw;  /* 使用视口宽度单位，占满整个浏览器宽度 */
  max-width: 100%; /* 确保不会超出视口 */
  /* 可选：移除可能存在的内边距或边框 */
  padding: 0;
  border: none;
  margin-top: -84px;
  z-index: -1;
}
.featured-section {
  display: flex;
  flex-direction: column;
  width: 1200px;
  height: 493px;
  align-items: center;
  margin-top: 38px;
}
.recommend-section {
  display: flex;
  flex-direction: column;
  width: 1200px;
  height: 349px;
  margin-top: 50px;
}
.book-carousel {
  width: 1360px;
  height: 396px;
}
.ranking-section {
  display: flex;
  flex-direction: column;
  width: 1200px;
  height: 704px;
  align-items: center;
  margin-bottom: 40px; /* 底部留白，避免内容贴边 */
  margin-top: 50px;
}
.ranking-title-h2 {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 38px; /* 标题与内容间距 */
  position: relative; /* 为了定位“更多”按钮 */
}
.featured-title, .recommend-title, .ranking-title, .newly-signed-title, .book-cate-title {
  width: 56px;
  height: 40px;
  font-family: TrajanPro;
  font-weight: 600;
  font-size: 24px;
  color: #FFFFFF;
  line-height: 40px;
  text-align: left;
  font-style: normal;
  // background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
   /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
  background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
  /* 关键：让背景裁剪成文字形状 */
  -webkit-background-clip: text; 
  /* 文字填充色设透明，让渐变背景透出来 */
  -webkit-text-fill-color: transparent; 
  /* 兼容其他浏览器 */
  background-clip: text; 
  text-fill-color: transparent; 
}
.featured-title {
  margin-top: 28px;
}
.ranking-title {
  width: 84px;
}
.ranking-more, .book-cate-more {
  position: absolute;
  right: 0;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 29px;
  text-align: left;
  font-style: normal;
}
.newly-signed-section {
  width: 1360px;
  height: 438px;
}
.newly-signed-title {
  width: 112px;
}
.book-cate-container {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative; /* 为了定位“更多”按钮 */
}
.book-cate-section {
  width: 1200px;
  height: 260px;
  margin-top: 50px;
  overflow: hidden;
}
.last-update-book-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1200px;
  max-height: 830px;
  margin-top: 50px;
}
.last-update-book-title {
  width: 112px;
  height: 40px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 24px;
  color: #FFFFFF;
  line-height: 40px;
  text-align: left;
  font-style: normal;
}

/* 回到顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background: linear-gradient(90deg, #FF9B51 0%, #ED5B00 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
  transition: opacity 0.3s, transform 0.3s;
}

.back-to-top:hover {
  transform: translateY(-5px);
}
.fluid-cursor {
  z-index: 9999 !important;
}
</style>