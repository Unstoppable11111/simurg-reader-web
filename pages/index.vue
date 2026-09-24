<template>
  <div class="home-page">
    <!-- 透明/毛玻璃吸顶导航栏 -->
    <Header 
      @trigger-search="handleTriggerSearch"  
      @clear-search="clearSearchResult"    
      @search-result="handleSearchResult"
    />

    <main class="home-main-content">
      <!-- 搜索结果覆盖层 -->
      <HomeSearchResult 
        v-if="searchQuery" 
        :search-query="searchQuery"
        :search-result="searchResult"
        :is-searching="isSearching"
        @select-book="gotoBookDetail"
        @clear-search="clearSearchResult"
      />
      
      <!-- 原首页主内容流 -->
      <div v-else class="home-sections-flow">
        <!-- 1. Hero 顶流轮播图 -->
        <section class="carousel-section" aria-label="推荐焦点图">
          <BookBanner :banners="banners" />
        </section>

        <!-- 2. 精选专区 -->
        <section class="home-section app-container" aria-labelledby="section-featured">
          <SectionHeader 
            id="section-featured"
            title="精选" 
            icon-name="feature-noval" 
          />
          <FeatureCard :books="books" />
        </section>

        <!-- 3. 推荐专区 -->
        <section class="home-section app-container" aria-labelledby="section-recommend">
          <SectionHeader 
            id="section-recommend"
            title="推荐" 
            icon-name="recommend" 
          />
          <Recommend :recommendBooks="recommendBooks" />
        </section>

        <!-- 4. 排行榜专区 -->
        <section class="home-section app-container" aria-labelledby="section-ranking">
          <SectionHeader 
            id="section-ranking"
            title="排行榜" 
            icon-name="ranking" 
            more-link="/ranking" 
          />
          <Ranking />
        </section>

        <!-- 5. 分类专区 -->
        <section class="home-section app-container" aria-labelledby="section-category">
          <SectionHeader 
            id="section-category"
            title="分类" 
            icon-name="i-category" 
            more-link="/bookcate" 
          />
          <BookCate :bookCateList="bookCateList" />
        </section>

        <!-- 6. 最近更新日志 -->
        <section class="home-section app-container" aria-labelledby="section-recent-updates">
          <SectionHeader 
            id="section-recent-updates"
            title="最近更新" 
          />
          <LastUpdateBook :recentUpdateBooks="recentUpdateBooks" />
        </section>
      </div>
    </main>

    <!-- 全局页脚 -->
    <Footer />

    <!-- 规范平滑回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import BookBanner from '@/components/home/BookBanner.vue';
import FeatureCard from '@/components/home/FeatureCard.vue';
import Recommend from '@/components/home/Recommend.vue';
import Ranking from '@/components/home/Ranking.vue';
import BookCate from '@/components/home/BookCate.vue';
import LastUpdateBook from '@/components/home/LastUpdateBook.vue';
import Footer from '@/components/layout/Footer.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import BackToTop from '@/components/common/BackToTop.vue';
import HomeSearchResult from '@/components/home/HomeSearchResult.vue';
import { API_ENDPOINTS, apiRequest } from '@/utils/api';

definePageMeta({
  layout: 'default'
});

const router = useRouter();
const isSearching = ref(false);
const banners = ref([]);
const books = ref([]);
const recommendBooks = ref([]);
const bookCateList = ref([]);
const recentUpdateBooks = ref([]);
const searchQuery = ref('');
const searchResult = ref([]);

// 处理 Header 触发的搜索事件 (业务逻辑 100% 保留)
const handleTriggerSearch = async (query) => {
  if (!query || !query.trim()) {
    clearSearchResult();
    return;
  }
  searchQuery.value = query.trim(); 
  isSearching.value = true;
  try {
    const bookSearchUrl = { keyword: query.trim() };
    const bookSearchResult = await apiRequest(API_ENDPOINTS.BOOK_SEARCH_BY_KEYWORDS, {
      method: 'POST',
      body: JSON.stringify(bookSearchUrl)
    });
    if (bookSearchResult.code === 200 && bookSearchResult.data?.records) {
      searchResult.value = bookSearchResult.data.records || []; 
    } else {
      searchResult.value = [];
    }
  } catch (error) {
    searchResult.value = [];
  } finally {
    isSearching.value = false;
  }
};

// 清空搜索结果，恢复原首页内容
const clearSearchResult = () => {
  searchQuery.value = '';
  searchResult.value = [];
  isSearching.value = false;
};

// 接收 Header 返回的搜索结果
const handleSearchResult = (result) => {
  searchResult.value = result || [];
};

// 跳转到书籍详情页
const gotoBookDetail = (bookId) => {
  if (bookId) {
    router.push(`/book/${bookId}`);
  }
};

// 核心 SSR 数据预取 (useAsyncData 机制 100% 保留)
const { data: homeInitData } = await useAsyncData('home-init-data', async () => {
  const [featureRes, recommendRes, cateRes, recentRes, bannerRes] = await Promise.allSettled([
    useRequest(`${API_ENDPOINTS.TAG_BOOKS}/FEATURED`),
    useRequest(`${API_ENDPOINTS.TAG_BOOKS}/RECOMMEND`),
    useRequest(API_ENDPOINTS.CATEGORIES, { method: 'GET' }),
    useRequest(API_ENDPOINTS.RECENT_UPDATE_BOOKS, {
      method: 'POST',
      body: { size: 10 }
    }),
    useRequest(API_ENDPOINTS.BANNERS)
  ]);
  return {
    books: featureRes.status === 'fulfilled' && featureRes.value?.code === 200 && Array.isArray(featureRes.value.data) ? featureRes.value.data : [],
    recommendBooks: recommendRes.status === 'fulfilled' && recommendRes.value?.code === 200 && Array.isArray(recommendRes.value.data) ? recommendRes.value.data.slice(0, 4) : [],
    bookCateList: cateRes.status === 'fulfilled' && cateRes.value?.code === 200 && Array.isArray(cateRes.value.data) ? cateRes.value.data : [],
    recentUpdateBooks: recentRes.status === 'fulfilled' && recentRes.value?.code === 200 && Array.isArray(recentRes.value.data) ? recentRes.value.data : [],
    banners: bannerRes.status === 'fulfilled' && bannerRes.value?.code === 200 && Array.isArray(bannerRes.value.data) ? bannerRes.value.data : []
  };
});

if (homeInitData.value) {
  books.value = homeInitData.value.books || [];
  recommendBooks.value = homeInitData.value.recommendBooks || [];
  bookCateList.value = homeInitData.value.bookCateList || [];
  recentUpdateBooks.value = homeInitData.value.recentUpdateBooks || [];
  banners.value = homeInitData.value.banners || [];
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-canvas);
  background-image: url('/icon/backgroud.svg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: var(--text-primary);
  overflow-x: hidden;
}

.home-main-content {
  width: 100%;
  flex: 1;
}

.home-sections-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.carousel-section {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  margin-bottom: var(--space-8);
}

/* 统一各板块外边距与弹性自适应，彻底消除写死高度 */
.home-section {
  margin-bottom: var(--space-12);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 优雅的轻量 Section Reveal 动画 */
@keyframes section-reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-section {
  animation: section-reveal var(--duration-medium) var(--ease-out-smooth) both;
}

@media (max-width: 768px) {
  .home-page {
    background-attachment: scroll;
  }
  .carousel-section {
    margin-bottom: var(--space-6);
  }
  .home-section {
    margin-bottom: var(--space-8);
  }
}
</style>
