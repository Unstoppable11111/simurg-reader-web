<template>
    <div class="home-page">
        <!-- 透明导航栏（通过绝对定位悬浮） -->
      <Header 
        @trigger-search="handleTriggerSearch"  
        @clear-search="clearSearchResult"    
        @search-result="handleSearchResult"
      />

      <!-- 核心：内容切换 - 有搜索关键词显示结果，否则显示原首页内容 -->
      <div v-if="searchQuery" class="search-result-section" v-loading="isSearching">
        <!-- 搜索结果列表 -->
        <div class="search-result-header">
          <span class="search-result-title">“{{ searchQuery }}” 的搜索结果</span>
          <span class="search-result-count">共 {{ searchResult.length }} 本</span>
        </div>
        <div class="search-result-list" v-if="searchResult.length > 0">
          <!-- 搜索结果项（根据实际数据结构调整） -->
          <div 
            v-for="book in searchResult" 
            :key="book.id" 
            class="search-result-item"
            @click="gotoBookDetail(book.id)"
          >
            <img :src="book.coverImageUrl" :alt="book.title || '书籍封面'" class="book-cover" loading="lazy">
            <div class="book-info">
              <div class="book-name">{{ book.title }}</div>
              <div class="book-author">作者：{{ book.authorPenName }}</div>
              <div class="book-desc">{{ book.protagonistIntroduction || '暂无简介' }}</div>
            </div>
          </div>
        </div>
        <!-- 无结果提示 -->
        <div v-if="!searchResult.length" class="no-result">
          未找到“{{ searchQuery }}”相关书籍
        </div>
      </div>
      
      <div v-else class="home-content-box">
        <!-- 轮播图（作为背景层） -->
        <!-- <Carousel  class="carousel" /> -->
        <BookBanner class="carousel" :banners="banners" />

        <!-- 精选专区 -->
        <div class="featured-section">
          <div class="featured-title-box">  
            <span class="featured-title">精选</span>
            <SvgIcon name="feature-noval" class="feature-noval" size="24" color="none"/>
          </div>
          <!-- 这里放精选内容 -->
          <FeatureCard :books="books" />
        </div>

        <!-- 推荐专区 -->
        <div class="recommend-section">
          <div class="recommend-title-box">
            <span class="recommend-title">推荐</span>
            <SvgIcon name="recommend" class="recommend" size="24" color="none"/>
          </div>
          <Recommend :recommendBooks="recommendBooks" />
        </div>

        <!-- 排行榜 -->
        <div class="ranking-section">
          <!-- 这里放排行榜内容 -->
          <div class="ranking-title-h2">
            <span class="ranking-title">排行榜</span>
            <SvgIcon name="ranking" class="ranking" size="24" color="none"/>
            <NuxtLink to="/ranking" class="ranking-more">
              更多
              <el-icon class="arrow-right"><ArrowRight /></el-icon>
            </NuxtLink>
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
            <SvgIcon name="i-category" class="i-category" size="24" color="none"/>
            <NuxtLink to="/bookcate" class="book-cate-more">
              更多
              <el-icon class="arrow-right"><ArrowRight /></el-icon>
            </NuxtLink>
          </div>
          <BookCate :bookCateList="bookCateList" />
        </div>

        <!-- 最近更新书籍日志 -->
        <div class="last-update-book-section">
          <div class="last-update-book-title">最近更新</div>
          <LastUpdateBook :recentUpdateBooks="recentUpdateBooks" />
        </div>

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
  import BookBanner from '@/components/home/BookBanner.vue';
  import FeatureCard from '@/components/home/FeatureCard.vue';
  import Recommend from '@/components/home/Recommend.vue';
  import Ranking from '@/components/home/Ranking.vue';
  import SvgIcon from '@/components/SvgIcon.vue';
  import BookCate from '@/components/home/BookCate.vue';
  import LastUpdateBook from '@/components/home/LastUpdateBook.vue';
  import Footer from '@/components/layout/Footer.vue';
  import { API_ENDPOINTS, apiRequest } from '@/utils/api';
  import { ArrowRight } from '@element-plus/icons-vue'

  definePageMeta({
    layout: 'default' // 可指定默认布局名称（可选）
  })
  const router = useRouter();
  const isSearching = ref(false);
  // 控制回到顶部按钮的显示
  const showBackToTop = ref(false);
  const banners = ref([]);
  const books = ref([]);
  const recommendBooks = ref([]);
  const bookCateList = ref([]);
  const recentUpdateBooks = ref([]);
  // 新增：搜索相关响应式状态
  const searchQuery = ref(''); // 搜索关键词
  const searchResult = ref([]); // 搜索结果列表

  // 新增：处理Header触发的搜索事件
  const handleTriggerSearch = async (query) => {
    if (!query.trim()) {
      handleClearSearch();
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
      }
    } catch (error) {
      searchResult.value = [];
    }
  };
  // 新增：清空搜索结果，恢复原首页内容
  const clearSearchResult = () => {
    searchQuery.value = '';
    searchResult.value = [];
    isSearching.value = false;
  };
  // 可选：接收Header返回的搜索结果（若搜索逻辑在Header中）
  const handleSearchResult = (result) => {
    searchResult.value = result;
  };
  // 新增：跳转到书籍详情页（根据实际路由调整）
  const gotoBookDetail = (bookId) => {
    router.push(`/book/${bookId}`);
  };

  // 性能优化：首页 5 个接口由串行改为并行，大幅缩短 SSR 首屏白屏时间
  const [featureResult, recommendResult, cateResult, recentResult, bannerResult] = await Promise.allSettled([
    // 精选书籍
    apiRequest(new URL(`${API_ENDPOINTS.TAG_BOOKS}/FEATURED`)),
    // 推荐书籍
    apiRequest(new URL(`${API_ENDPOINTS.TAG_BOOKS}/RECOMMEND`)),
    // 书籍分类
    apiRequest(API_ENDPOINTS.CATEGORIES, { method: 'GET' }),
    // 最近更新
    apiRequest(API_ENDPOINTS.RECENT_UPDATE_BOOKS, {
      method: 'POST',
      body: JSON.stringify({ size: 10 })
    }),
    // 轮播图
    apiRequest(API_ENDPOINTS.BANNERS)
  ]);

  // 安全赋值：fulfilled 状态才取值，rejected 状态使用默认空数组
  if (featureResult.status === 'fulfilled' && featureResult.value?.code === 200 && Array.isArray(featureResult.value.data)) {
    books.value = featureResult.value.data;
  }
  if (recommendResult.status === 'fulfilled' && recommendResult.value?.code === 200 && Array.isArray(recommendResult.value.data)) {
    recommendBooks.value = recommendResult.value.data.slice(0, 4);
  }
  if (cateResult.status === 'fulfilled' && cateResult.value?.code === 200 && Array.isArray(cateResult.value.data)) {
    bookCateList.value = cateResult.value.data;
  }
  if (recentResult.status === 'fulfilled' && recentResult.value?.code === 200 && Array.isArray(recentResult.value.data)) {
    recentUpdateBooks.value = recentResult.value.data;
  }
  if (bannerResult.status === 'fulfilled' && bannerResult.value?.code === 200 && Array.isArray(bannerResult.value.data)) {
    banners.value = bannerResult.value.data;
  }

  // 回到顶部功能
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };
  // 修复：使用具名函数，避免匿名函数导致 removeEventListener 无法正确移除（内存泄漏）
  const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300;
  };
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });

</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('/icon/backgroud.svg');
  background-size: cover;
  background-position: unset;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.home-content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel {
  width: 100vw;
  height: 420px;
  max-width: 100%;
  overflow: hidden;
}
.featured-section {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: calc(100% - 32px);
  height: 493px;
  align-items: center;
  margin-top: 38px;
}
.featured-title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
}
.recommend-section {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: calc(100% - 32px);
  height: 349px;
  margin-top: 50px;
}
.recommend-title-box {
  display: flex;
  align-items: center;
}
.recommend {
  width: 24px;
  height: 24px;
  color: transparent;
}
.book-carousel {
  width: 1360px;
  height: 396px;
}
.ranking-section {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: calc(100% - 32px);
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
.ranking {
  width: 24px;
  height: 24px;
  color: transparent;
  margin-top: 2px;
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
  // background: linear-gradient(0deg, #F9A825 0%, #F9A825 100%);
   /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
  background: linear-gradient(90deg, #F9A825 0%, #ED5B00 100%);
  /* 关键：让背景裁剪成文字形状 */
  -webkit-background-clip: text; 
  /* 文字填充色设透明，让渐变背景透出来 */
  -webkit-text-fill-color: transparent; 
  /* 兼容其他浏览器 */
  background-clip: text; 
  text-fill-color: transparent; 
}
.feature-noval {
  width: 24px;
  height: 24px;
  color: transparent;
}
.ranking-title {
  width: 80px;
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
  &:hover {
    cursor: pointer;
  }
}
.arrow-right {
  line-height: 29px;
}
.newly-signed-section {
  width: 1360px;
  height: 438px;
}
.newly-signed-title {
  width: 112px;
}
.i-category {
  width: 24px;
  height: 24px;
  color: transparent;
}
.book-cate-container {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative; /* 为了定位“更多”按钮 */
}
.book-cate-section {
  max-width: 1200px;
  width: calc(100% - 32px);
  height: 260px;
  margin-top: 50px;
  overflow: hidden;
}
.last-update-book-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: calc(100% - 32px);
  // max-height: 830px;
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
  background: linear-gradient(90deg, #F9A825 0%, #F9A825 100%);
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

// 新增：搜索结果区域样式
.search-result-section {
  width: 1200px;
  margin: 40px auto;
  padding: 54px 0;
}

.search-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}

.search-result-title {
  font-size: 18px;
  color: #FFFFFF;
  font-weight: 600;
}

.search-result-count {
  font-size: 14px;
  color: #A2A0A0;
}

.search-result-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4列布局，可调整
  gap: 20px;
}

.search-result-item {
  display: flex;
  flex-direction: column;
  background: #424242;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.book-info {
  color: #FFFFFF;
}

.book-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.book-author {
  font-size: 12px;
  color: #A2A0A0;
  margin-bottom: 5px;
}

.book-desc {
  font-size: 12px;
  color: #777;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2; // 最多显示2行
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-tag {
  font-size: 12px;
  color: #F9A825;
  background: rgba(255, 155, 81, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

.no-result {
  grid-column: 1 / -1; // 占满所有列
  text-align: center;
  font-size: 16px;
  color: #FFFFFF;
  padding: 40px 0;
}
@media (max-width: 768px) {
  .home-page {
    background-attachment: scroll;
  }
  .home-content-box {
    width: 100%;
    padding: 0 16px;
  }
  .carousel {
    max-width: 100vw;
    height: 220px;
  }
  .featured-section,
  .recommend-section,
  .ranking-section,
  .book-cate-section,
  .last-update-book-section,
  .search-result-section {
    width: 100%;
    height: auto;
  }
  .featured-title-box,
  .recommend-title-box,
  .ranking-title-h2,
  .book-cate-container {
    width: 100%;
  }
  .ranking-more,
  .book-cate-more {
    position: static;
    margin-left: auto;
  }
  .search-result-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .book-cover {
    height: 160px;
  }
  .ranking-section {
    margin-top: 32px;
  }
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
