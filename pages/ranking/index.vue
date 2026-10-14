<template>
  <div class="ranking-page">
    <Header />
    <div class="ranking-container">
      <!-- 面包屑导航 -->
      <nav class="ranking-breadcrumb" aria-label="面包屑导航">
        <NuxtLink to="/" class="breadcrumb-link">首页</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">排行榜</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current active-sub">{{ currentRanking }}</span>
      </nav>

      <div class="ranking-main-layout">
        <div class="ranking-box">
          <div class="ranking-nav-box">
            <div class="ranking-nav-list">
              <!-- 丝滑移动的活动高亮滑块（带白金发光指示条） -->
              <div 
                class="sliding-nav-active-pill"
                :style="{ transform: `translateY(${activeItemIndex * 56}px)` }"
              >
                <div class="nav-active-indicator"></div>
              </div>

              <!-- 导航选项列表 -->
              <div 
                v-for="(item, index) in rankingNavItems" 
                :key="item.id"
                class="ranking-nav-item"
                :class="{ 'is-active': item.active }"
                @click="selectRanking(item)">
                  <SvgIcon :name="item.active ? item.iconActivePath : item.iconPath" :class="item.active ? item.iconActivePath : item.iconPath" color=""/>
                  <div class="nav-item-name" :class="{ 'active-text': item.active }">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="ranking-content-box">
          <div class="ranking-title-box">
            <div class="ranking-title-wrapper">
              <span class="ranking-title-bar"></span>
              <div class="ranking-title">{{ currentRanking }}</div>
              <span class="ranking-badge-tag">TOP 10</span>
            </div>
          </div>

          <div class="ranking-book-box">
            <!-- 统一平滑淡入淡出 Transition 容器（彻底消除状态切换与首屏闪烁） -->
            <Transition name="ranking-fade-slide" mode="out-in">
              <!-- 1. 骨架屏：数据加载中 -->
              <div v-if="isLoading" key="skeleton" class="ranking-skeleton-grid">
                <div v-for="n in 6" :key="n" class="skeleton-card motion-card">
                  <div class="skeleton-cover skeleton-shimmer"></div>
                  <div class="skeleton-info">
                    <div class="skeleton-line skeleton-title skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-author skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-desc skeleton-shimmer"></div>
                  </div>
                </div>
              </div>

              <!-- 2. 数据列表：有数据时 -->
              <div v-else-if="rankingBooks && rankingBooks.length > 0" :key="currentRankingCode" class="ranking-book-list" v-reveal>
                <div 
                  v-for="(book, index) in rankingBooks" 
                  :key="book.bookId || index"
                  @click="gotoBookDetail(book.bookId)"
                  class="ranking-book-item motion-card">
                  <div class="cover-wrapper">
                    <span class="rank-badge" :class="index < 3 ? `rank-${index + 1}` : 'rank-other'">
                      {{ index + 1 }}
                    </span>
                    <img class="book-img" :src="book.coverImageUrl" :alt="book.title || '封面'" loading="lazy">
                  </div>
                  <div class="book-info">
                    <div class="book-title">{{ book.title }}</div>
                    <div class="book-author">{{ book.penName }}</div>
                    <div class="book-desc">{{ book.description }}</div>
                    <div class="book-status">
                        {{ formatSerialStatus(book.serialStatus) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. 顶级空数据状态视觉体验 -->
              <div v-else :key="'empty-' + currentRankingCode" class="ranking-empty-card">
                <div class="empty-glow-ambient"></div>
                <div class="empty-content">
                  <div class="empty-artwork-wrap">
                    <div class="empty-rings"></div>
                    <div class="empty-icon-box">
                      <svg viewBox="0 0 48 48" width="46" height="46" fill="none" class="empty-svg-emblem">
                        <path d="M8 38V10C8 7.79086 9.79086 6 12 6H38C39.1046 6 40 6.89543 40 8V38" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M8 38C8 35.7909 9.79086 34 12 34H40V42H12C9.79086 42 8 40.2091 8 38Z" fill="url(#goldGradMuted)" stroke="url(#goldGrad)" stroke-width="2.5"/>
                        <path d="M16 16H32M16 24H26" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="34" cy="24" r="2" fill="#F9A825"/>
                        <defs>
                          <linearGradient id="goldGrad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#F9A825"/>
                            <stop offset="1" stop-color="#ED5B00"/>
                          </linearGradient>
                          <linearGradient id="goldGradMuted" x1="8" y1="34" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                            <stop stop-color="rgba(249, 168, 37, 0.2)"/>
                            <stop offset="1" stop-color="rgba(237, 91, 0, 0.08)"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <h3 class="empty-title">【{{ currentRanking }}】好书整理中</h3>
                  <p class="empty-desc">该榜单正在火热统计与收录最新优质作品，稍候片刻或先去发现更多精彩故事吧</p>

                  <div class="empty-actions">
                    <NuxtLink to="/" class="empty-btn primary-btn motion-btn">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span>前往首页逛逛</span>
                    </NuxtLink>
                    <button class="empty-btn ghost-btn motion-btn" @click="fetchRankingData(currentRankingCode)">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span>刷新试试</span>
                    </button>
                  </div>

                  <!-- 热门流派探索入口快捷胶囊（实时分类数据 + 选中联动跳转） -->
                  <div class="empty-tags-box" v-if="realCategories && realCategories.length > 0">
                    <span class="tags-hint">猜你想看：</span>
                    <div class="tags-list">
                      <NuxtLink 
                        v-for="cat in realCategories" 
                        :key="cat.categoryId" 
                        :to="`/bookcate?categoryId=${cat.categoryId}`" 
                        class="quick-cat-pill">
                        {{ cat.categoryName }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import Footer from "@/components/layout/Footer.vue";
  import SvgIcon from "@/components/SvgIcon.vue";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  
  // 榜单导航项数据
  const rankingNavItems = ref([
    { id: 1, name: '热门榜', code: '1', active: true, iconPath: 'ranking-hot', iconActivePath: 'ranking-hot-active', },
    { id: 2, name: '新书榜', code: '2', active: false, iconPath: 'ranking-new', iconActivePath: 'ranking-new-active', },
    { id: 3, name: '畅销榜', code: '3', active: false, iconPath: 'ranking-selling', iconActivePath: 'ranking-selling-active', },
    { id: 4, name: '完结榜', code: '4', active: false, iconPath: 'ranking-finish', iconActivePath: 'ranking-finish-active', },
    { id: 5, name: '大神榜', code: '5', active: false, iconPath: 'ranking-god', iconActivePath: 'ranking-god-active', },
    { id: 6, name: '热搜榜', code: '6', active: false, iconPath: 'ranking-search', iconActivePath: 'ranking-search-active', }
  ]);
  
  // 当前选中的榜单
  const currentRanking = ref('热门榜');
  const currentRankingCode = ref('1');
  
  const router = useRouter()
  // 榜单类型（日榜、月榜）
  const rankingType = ref('日榜');
  
  // 当前激活项的索引（驱动绝对定位滑块平移动效）
  const activeItemIndex = computed(() => {
    const idx = rankingNavItems.value.findIndex(item => item.active);
    return idx >= 0 ? idx : 0;
  });

  // 模拟书籍数据
  const rankingBooks = ref([]);
  // 加载中状态指示
  const isLoading = ref(true);

  // 实时分类列表
  const realCategories = ref([]);

  // 获取服务端实时分类数据
  const fetchCategories = async () => {
    try {
      const res = await apiRequest(API_ENDPOINTS.CATEGORIES, { method: 'GET' });
      if (res?.code === 200 && Array.isArray(res.data)) {
        realCategories.value = res.data.slice(0, 8);
      }
    } catch (err) {
      console.error('获取分类列表失败:', err);
    }
  };

  const fetchRankingData = async (rankingCode) => {
    isLoading.value = true;
    const startTime = Date.now();
    try {
      const targetCode = rankingCode || currentRankingCode.value;
      const rankingBookListReq = {
        rankingType: targetCode,
        rankingSize: 10
      }
      console.log("请求参数：", rankingBookListReq);
      const rankingBookResult = await apiRequest(API_ENDPOINTS.RANKING_BOOKS, {
        method: 'POST',
        body: JSON.stringify(rankingBookListReq)
      });
      console.log("rankingCode书籍榜单", targetCode, rankingBookResult);

      // 防闪烁平滑缓冲：避免接口 30ms 极速返回导致骨架屏闪跳
      const elapsed = Date.now() - startTime;
      if (elapsed < 160) {
        await new Promise(resolve => setTimeout(resolve, 160 - elapsed));
      }

      if (rankingBookResult && rankingBookResult.code === 200 && Array.isArray(rankingBookResult.data)) {
        rankingBooks.value = rankingBookResult.data;
      } else {
        rankingBooks.value = [];
      }
    } catch (error) {
      console.error("加载榜单数据失败:", error);
      rankingBooks.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    fetchRankingData(currentRankingCode.value);
    fetchCategories();
  });
  
  // 选择榜单
  const selectRanking = async (item) => {
    if (currentRankingCode.value === item.code && !isLoading.value) return;

    // 更新导航项的激活状态
    rankingNavItems.value.forEach(navItem => {
      navItem.active = navItem.id === item.id;
    });
    
    // 更新当前榜单名称
    currentRanking.value = item.name;
    currentRankingCode.value = item.code;
    
    console.log(`切换到${item.name}`);
    await fetchRankingData(item.code);
  };

  // 点击书籍跳转到详情页
  const gotoBookDetail = (bookId) => {
    router.push(`/book/${bookId}`)
  }
</script>

<style lang="scss" scoped>
  .ranking-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .ranking-container {
    max-width: 1200px;
    width: calc(100% - 32px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding-top: 96px;
    padding-bottom: 60px;
    flex: 1;
  }
  .ranking-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #7c7e82;
    margin-bottom: 24px;
    .breadcrumb-link {
      color: #b0b1b3;
      text-decoration: none;
      transition: color 0.15s ease;
      &:hover {
        color: #e59344;
      }
    }
    .breadcrumb-separator {
      color: rgba(255, 255, 255, 0.2);
    }
    .breadcrumb-current {
      color: #7c7e82;
      &.active-sub {
        color: #e59344;
        font-weight: 500;
      }
    }
  }
  .ranking-main-layout {
    display: flex;
    width: 100%;
    align-items: flex-start;
  }
  .ranking-box {
    width: 190px;
    margin-right: 36px;
    flex-shrink: 0;
  }
  .ranking-nav-box {
    width: 100%;
    background: #232428;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
  .ranking-nav-list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* 独立的高亮活动滑块（从上一个按钮平滑滑动过渡到下一个按钮） */
  .sliding-nav-active-pill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 56px;
    background: linear-gradient(90deg, #F9A825 0%, #ED5B00 100%);
    box-shadow: 0 4px 18px rgba(237, 91, 0, 0.4);
    z-index: 1;
    pointer-events: none;
    /* 特调丝滑弹性过渡贝塞尔曲线 */
    transition: transform 300ms cubic-bezier(0.34, 1.25, 0.64, 1);
    will-change: transform;
  }

  .nav-active-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #FFFFFF;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.95);
  }

  .ranking-nav-item {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    width: 100%;
    height: 56px;
    padding: 0 22px;
    font-family: PingFangSC, PingFang SC, sans-serif;
    font-weight: 400;
    font-size: 15px;
    color: #A2A0A0;
    background-color: transparent !important;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: color 240ms ease, padding-left 220ms cubic-bezier(0.16, 1, 0.3, 1);

    &:last-child {
      border-bottom: none;
    }

    &:hover:not(.is-active) {
      color: #FFFFFF;
      background-color: rgba(255, 255, 255, 0.05) !important;
      padding-left: 26px;
    }

    &.is-active {
      color: #FFFFFF;
      font-weight: 600;

      .nav-item-name {
        font-weight: 600;
        color: #FFFFFF;
      }
    }
  }

  .nav-item-name {
    margin-left: 12px;
    transition: color 240ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ranking-hot, .ranking-new, 
  .ranking-hot-active, .ranking-new-active,
  .ranking-selling, .ranking-selling-active,
  .ranking-finish, .ranking-finish-active,
  .ranking-god, .ranking-god-active,
  .ranking-search, .ranking-search-active {
    width: 20px;
    height: 20px;
    color: transparent;
    transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .ranking-content-box {
    flex: 1;
    min-width: 0;
  }

  .ranking-title-box {
    width: 100%;
    margin-bottom: 20px;
  }
  .ranking-title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 48px;
  }
  .ranking-title-bar {
    width: 4px;
    height: 22px;
    background: linear-gradient(180deg, #F9A825 0%, #ED5B00 100%);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(249, 168, 37, 0.6);
  }
  .ranking-title {
    font-family: PingFangSC, PingFang SC, sans-serif;
    font-weight: 600;
    font-size: 22px;
    color: #FFFFFF;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .ranking-badge-tag {
    font-size: 11px;
    font-weight: 700;
    color: #F9A825;
    background: rgba(249, 168, 37, 0.12);
    border: 1px solid rgba(249, 168, 37, 0.3);
    padding: 2px 8px;
    border-radius: 999px;
  }

  /* 骨架屏样式 */
  .ranking-skeleton-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 26px;
  }
  .skeleton-card {
    width: 310px;
    height: 480px;
    background: var(--bg-surface-1, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
    border-radius: 20px;
    padding: 24px 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  .skeleton-cover {
    width: 240px;
    height: 320px;
    border-radius: 10px;
  }
  .skeleton-info {
    width: 100%;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .skeleton-line {
    border-radius: 6px;
  }
  .skeleton-title {
    width: 70%;
    height: 20px;
  }
  .skeleton-author {
    width: 45%;
    height: 14px;
  }
  .skeleton-desc {
    width: 90%;
    height: 14px;
  }

  /* 顶级空数据状态卡片设计 */
  .ranking-empty-card {
    position: relative;
    width: 100%;
    min-height: 480px;
    background: radial-gradient(circle at 50% 30%, rgba(249, 168, 37, 0.08) 0%, rgba(20, 21, 24, 0.85) 65%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    overflow: hidden;
    backdrop-filter: blur(12px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  .empty-glow-ambient {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(237, 91, 0, 0.16) 0%, rgba(249, 168, 37, 0.06) 45%, transparent 70%);
    filter: blur(48px);
    pointer-events: none;
  }
  .empty-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 520px;
  }
  .empty-artwork-wrap {
    position: relative;
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  .empty-rings {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px dashed rgba(249, 168, 37, 0.28);
    animation: ring-rotate 24s linear infinite;
  }
  .empty-icon-box {
    width: 68px;
    height: 68px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: emblem-float 3.6s ease-in-out infinite;
  }
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #f5f5f7;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  .empty-desc {
    font-size: 14px;
    line-height: 1.6;
    color: #90949d;
    margin-bottom: 28px;
  }
  .empty-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 34px;
  }
  .empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &.primary-btn {
      background: linear-gradient(135deg, #F9A825 0%, #ED5B00 100%);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 16px rgba(237, 91, 0, 0.35);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(237, 91, 0, 0.5);
      }
    }

    &.ghost-btn {
      background: rgba(255, 255, 255, 0.06);
      color: #cfd1d6;
      border: 1px solid rgba(255, 255, 255, 0.12);

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
      }
    }
  }
  .empty-tags-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    width: 100%;
  }
  .tags-hint {
    font-size: 13px;
    color: #7c7e82;
  }
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .quick-cat-pill {
    font-size: 12px;
    color: #a2a0a0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 5px 12px;
    border-radius: 999px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      color: #F9A825;
      border-color: rgba(249, 168, 37, 0.4);
      background: rgba(249, 168, 37, 0.08);
      transform: translateY(-1px);
    }
  }

  /* 切换过渡动画 */
  .ranking-fade-slide-enter-active,
  .ranking-fade-slide-leave-active {
    transition: opacity 280ms cubic-bezier(0.2, 0, 0, 1),
                transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ranking-fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .ranking-fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  @keyframes emblem-float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  @keyframes ring-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .ranking-book-list {
    display: flex;
    flex-wrap: wrap;
    gap: 26px;
  }
  .ranking-book-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 310px;
    height: 480px;
    background: var(--bg-surface-1, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
    border-radius: 20px;
    cursor: pointer;
    overflow: hidden;

    &:hover {
      border-color: var(--brand-primary, #e59344);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);

      .book-img {
        transform: scale(1.03);
      }
    }
  }
  .cover-wrapper {
    position: relative;
    overflow: hidden;
    margin: 24px 35px 0 35px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
  }
  .rank-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);

    &.rank-1 {
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      color: #000000;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
    }

    &.rank-2 {
      background: linear-gradient(135deg, #e0e0e0 0%, #9e9e9e 100%);
      color: #000000;
      box-shadow: 0 4px 12px rgba(200, 200, 200, 0.4);
    }

    &.rank-3 {
      background: linear-gradient(135deg, #e6a875 0%, #b8652e 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
    }

    &.rank-other {
      background: rgba(0, 0, 0, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e0e0e0;
    }
  }
  .book-img {
    width: 240px;
    height: 320px;
    border-radius: 10px;
    object-fit: cover;
    transition: transform var(--duration-medium, 300ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
  }
  .book-info {
    display: flex;
    flex-direction: column;
    width: 310px;
    height: 182px;
    background: #FFFFFF;
    border-radius: 16px;
    margin-top: -50px;
    z-index: 2;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(13px);
    color: #fff;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    margin: 16px 14px 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-author {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #B2B2B2;
    line-height: 20px;
    margin: 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #B2B2B2;
    line-height: 20px;
    /** 超出3行显示省略号 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 14px;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-status {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #B2B2B2;
    line-height: 18px;
    margin: 20px 0 0 14px;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    .ranking-container {
      width: 100%;
      flex-direction: column;
      padding: 90px 16px 20px;
    }
    .ranking-main-layout {
      flex-direction: column;
    }
    .ranking-box {
      width: 100%;
      margin: 0 0 16px 0;
    }
    .ranking-nav-box {
      background: transparent;
      border: none;
      box-shadow: none;
      border-radius: 0;
    }
    .ranking-nav-list {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sliding-nav-active-pill {
      display: none;
    }
    .ranking-nav-item {
      width: calc(50% - 4px);
      height: 44px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: #232428 !important;
      padding: 0 14px;
      justify-content: center;

      &:hover:not(.is-active) {
        padding-left: 14px;
      }

      &.is-active {
        background: linear-gradient(90deg, #F9A825 0%, #ED5B00 100%) !important;
      }
    }
    .nav-active-indicator {
      display: none;
    }
    .ranking-title-box {
      width: 100%;
      height: auto;
    }
    .ranking-title {
      font-size: 18px;
    }
    .ranking-skeleton-grid {
      gap: 12px;
      justify-content: space-between;
    }
    .skeleton-card {
      width: calc(50% - 6px);
      height: auto;
      padding: 16px 12px;
      border-radius: 16px;
    }
    .skeleton-cover {
      width: 100%;
      height: 200px;
    }
    .ranking-empty-card {
      padding: 40px 16px;
      min-height: 380px;
    }
    .empty-actions {
      flex-direction: column;
      width: 100%;
      gap: 10px;
    }
    .empty-btn {
      width: 100%;
      justify-content: center;
    }
    .ranking-book-list {
      gap: 12px;
      justify-content: space-between;
    }
    .ranking-book-item {
      width: calc(50% - 6px);
      height: auto;
      border-radius: 16px;
    }
    .book-img {
      width: 100%;
      height: 200px;
      margin: 16px 0 0 0;
    }
    .book-info {
      width: 100%;
      height: auto;
      margin-top: -24px;
    }
  }

  @media (max-width: 480px) {
    .ranking-book-item,
    .skeleton-card {
      width: 100%;
    }
    .book-img,
    .skeleton-cover {
      height: 220px;
    }
  }
</style>
