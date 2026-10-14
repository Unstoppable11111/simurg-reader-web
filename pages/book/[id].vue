<template>
  <div class="book-page"> 
    <Header />

    <main class="book-main app-container" v-if="book">
      <!-- 1. 面包屑导航 -->
      <nav class="breadcrumb" aria-label="面包屑导航">
        <NuxtLink to="/" class="breadcrumb-link">首页</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ book?.title || '书籍详情' }}</span>
      </nav>

      <!-- 2. 书籍核心头部 Hero 卡片 -->
      <section class="book-hero-card" aria-label="书籍基本信息">
        <!-- 左侧及中部：封面与元信息 -->
        <div class="book-hero-primary">
          <div class="book-cover-wrap">
            <img 
              :src="book.coverImageUrl" 
              :alt="book.title || '封面'" 
              class="book-cover-img"
              loading="lazy"
            />
          </div>

          <div class="book-meta-wrap">
            <h1 class="book-title" :title="book.title">{{ book.title }}</h1>

            <div class="book-tags">
              <span class="tag tag-status" v-if="book.serialStatus !== undefined">
                {{ formatSerialStatus(book.serialStatus) }}
              </span>
              <span 
                class="tag tag-cate" 
                v-for="bookCate in book.bookCategoryResponseList" 
                :key="bookCate.categoryId"
              >
                {{ bookCate.categoryName }}
              </span>
            </div>

            <div class="book-author" @click="gotoAuthorDetail(book.authorId)">
              <span class="author-label">作者：</span>
              <span class="author-link-text">{{ book.authorPenName || '未知作家' }}</span>
            </div>

            <div class="book-stats">
              <span class="stat-item">{{ formatBookWordCount(book.wordCount) }}</span>
              <span class="stat-divider">|</span>
              <span class="stat-item">{{ book.bookViews || 0 }} 次浏览</span>
              <span class="stat-divider">|</span>
              <span class="stat-item">{{ formatPopularity(book.totalFavorites) }}</span>
            </div>

            <div class="book-actions">
              <button class="btn-read-now" @click="startReading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                开始阅读
              </button>
              <button 
                class="btn-add-to-bookshelf" 
                :class="{ 'btn-in-bookshelf': isInBookshelf }"
                :disabled="isInBookshelf"
                @click="addToBookshelf"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                {{ isInBookshelf ? '已在书架' : '加入书架' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 中间自然分割线 -->
        <div class="hero-divider" role="separator"></div>

        <!-- 右侧：作者专栏卡片 -->
        <div class="author-side-card" aria-label="作者信息">
          <div class="author-header">
            <img 
              v-if="book.authorPictureUrl" 
              :src="book.authorPictureUrl" 
              alt="作者头像" 
              class="author-avatar-img"
              @error="book.authorPictureUrl = ''"
              @click="gotoAuthorDetail(book.authorId)"
            />
            <div 
              v-else 
              class="author-avatar-fallback"
              @click="gotoAuthorDetail(book.authorId)"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <div class="author-name-wrap">
              <div class="author-name-row">
                <span class="author-display-name" @click="gotoAuthorDetail(book.authorId)" :title="book.authorPenName">
                  {{ book.authorPenName || '未知作家' }}
                </span>
                <span class="author-badge">
                  <SvgIcon name="pen" class="pen-icon" size="12" />
                  作家
                </span>
              </div>
              <button 
                v-if="isLoggedIn && isFollowed" 
                class="btn-follow followed" 
                @click="followAuthor(book.authorId)"
              >
                已关注
              </button>
              <button 
                v-else 
                class="btn-follow" 
                @click="followAuthor(book.authorId)"
              >
                + 关注
              </button>
            </div>
          </div>

          <div class="author-stats-grid">
            <div class="author-stat-item">
              <span class="author-stat-label">作品总数</span>
              <span class="author-stat-value">{{ book?.authorBookCount || '1本' }}</span>
            </div>
            <div class="author-stat-item">
              <span class="author-stat-label">作品字数</span>
              <span class="author-stat-value">{{ formatBookWordCount(book?.wordCount) }}</span>
            </div>
            <div class="author-stat-item">
              <span class="author-stat-label">作品热度</span>
              <span class="author-stat-value">{{ book?.bookViews || 0 }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 书籍简介板块 -->
      <section class="book-card-section" aria-label="作品简介">
        <div class="section-title-wrap">
          <span class="title-bar"></span>
          <h2 class="section-title-text">作品简介</h2>
        </div>
        <div class="book-desc-content">
          <p class="book-desc-text">{{ book.description || '暂无作品简介。' }}</p>
        </div>
      </section>

      <!-- 4. 章节目录板块 -->
      <section class="book-card-section" aria-label="章节目录">
        <div class="section-title-wrap">
          <span class="title-bar"></span>
          <h2 class="section-title-text">章节目录</h2>
        </div>
        <div class="chapter-grid" v-if="chapterList && chapterList.length > 0">
          <div 
            class="chapter-item" 
            v-for="(item, index) in chapterList" 
            :key="item.chapterNumber || index"
            @click="switchToChapter(item.chapterNumber)"
            :class="{ 'chapter-active': chapterNumber === item.chapterNumber }"
          >
            <span class="chapter-num">第{{ item.chapterNumber }}章</span>
            <span class="chapter-title" :title="item.chapterTitle">{{ item.chapterTitle || '最新章节' }}</span>
          </div>
        </div>
        <div v-else class="empty-hint">暂无章节列表</div>

        <!-- 展开更多按钮 -->
        <div class="chapter-more-wrap" v-if="hasNextChapter">
          <button class="btn-more-chapters" @click="loadMoreChapters" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? '加载中...' : '展开更多章节' }}
          </button>
        </div>
      </section>

      <!-- 5. 快速试读板块 -->
      <section class="book-card-section" v-if="chapterContent" aria-label="在线试读">
        <div class="section-title-wrap">
          <span class="title-bar"></span>
          <h2 class="section-title-text">在线试读</h2>
        </div>
        <div class="reading-preview-box">
          <p class="reading-preview-text">
            {{ chapterContent?.chapterContent ? decryptData(chapterContent.chapterContent) : '暂无内容' }}
          </p>
        </div>
      </section>
    </main>

    <!-- 书籍不存在或加载失败兜底 -->
    <div v-else-if="isNotFound" class="book-empty-state app-container">
      <div class="empty-card">
        <div class="empty-icon-wrap">📖</div>
        <h2 class="empty-title">书籍不存在或已被下架</h2>
        <p class="empty-desc">很抱歉，未能找到该书籍的信息，可能已被下架或链接错误。</p>
        <div class="empty-actions">
          <NuxtLink to="/" class="btn-empty-home">返回首页</NuxtLink>
          <NuxtLink to="/bookcate" class="btn-empty-cate">浏览书库</NuxtLink>
        </div>
      </div>
    </div>

    <!-- 加载占位 -->
    <div v-else class="book-loading-placeholder app-container">
      <el-skeleton :rows="10" animated />
    </div>

    <Footer class="footer" />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { API_ENDPOINTS, apiRequest, apiAuthRequest } from '@/utils/api';
import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
import { useAuth } from '@/composables/useAuth';
import { decryptData } from '@/utils/crypto';

definePageMeta({
  keepalive: true
});

const { isLoggedIn } = useAuth();

// 获取路由参数
const route = useRoute();
const router = useRouter();
const bookId = route.params.id;

// 分页相关变量
const chapterList = ref([]);
const hasNextChapter = ref(false);
const currentPage = ref(1); // 当前页码
const pageSize = ref(12);   // 每页条数
const isLoading = ref(false); // 加载状态

const chapterNumber = ref(1);
const chapterContent = ref(null);
const isFollowed = ref(false);
const authorId = ref("");
const book = ref(null);

// 格式化字数展示，杜绝空值显示为"连载中"
const formatBookWordCount = (wordCount) => {
  if (!wordCount || isNaN(wordCount) || Number(wordCount) === 0) return '0字';
  const num = Number(wordCount);
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万字';
  }
  return `${num}字`;
};

// 格式化累计人气，超过1万显示万，低于1万显示真实数值，杜绝硬拼接"万"
const formatPopularity = (count) => {
  if (!count || isNaN(count) || Number(count) <= 0) return '0 累计人气';
  const num = Number(count);
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)} 万累计人气`;
  }
  return `${num} 累计人气`;
};

const isInBookshelf = ref(false);
const isNotFound = ref(false);

// 动态设置书籍详情页 SEO Meta
useSeoMeta({
  title: () => book.value?.title ? `${book.value.title} - ${book.value.authorPenName || '小说'} - Simurg Reader` : '书籍详情 - Simurg Reader',
  description: () => book.value?.description?.slice(0, 160) || 'Simurg Reader 在线小说阅读与创作平台',
  keywords: () => book.value ? `${book.value.title}, ${book.value.authorPenName || ''}, 小说阅读, Simurg Reader` : '小说阅读, Simurg Reader',
  ogTitle: () => book.value?.title || 'Simurg Reader',
  ogDescription: () => book.value?.description?.slice(0, 160) || '',
  ogImage: () => book.value?.coverImageUrl || '/favicon.svg'
});

// 获取书籍详情
try {
  const url = `${API_ENDPOINTS.BOOK_DETAIL}/${bookId}`;
  const bookResult = await apiRequest(url);
  if (bookResult.code === 200 && bookResult.data) {          
    authorId.value = bookResult.data.authorId;
    book.value = bookResult.data;
  } else {
    isNotFound.value = true;
  }
} catch (error) { 
  console.error('Error fetching book data:', error);
  isNotFound.value = true;
}

// 获取章节列表 - 封装成可复用方法
const fetchChapterList = async (page, isLoadMore = false) => {
  try {
    const chapterReq = {
      bookId: bookId,
      page: page,
      size: pageSize.value
    };
    
    if (isLoadMore) {
      isLoading.value = true;
    }
    
    const chapterResult = await apiRequest(API_ENDPOINTS.LIST_ALL_CHAPTER, {
      method: 'POST',
      body: JSON.stringify(chapterReq)
    });
    
    if (chapterResult.code === 200) {
      if (isLoadMore) {
        chapterList.value = [...chapterList.value, ...(chapterResult.data.records || [])];
      } else {
        chapterList.value = chapterResult.data.records || [];
      }
      
      hasNextChapter.value = !!chapterResult.data.hasNext;
      currentPage.value = page;
    }
  } catch (error) {
    console.error('Error fetching chapter data:', error);
  } finally {
    isLoading.value = false;
  }
};

// 初始化加载第一页章节
await fetchChapterList(currentPage.value);

// 加载更多章节方法
const loadMoreChapters = async () => {
  if (isLoading.value || !hasNextChapter.value) return;
  await fetchChapterList(currentPage.value + 1, true);
};

// 默认获取第一章数据
const fetchChapterDetail = async (chapterNum) => {
  try {
    const chapterDetailReq = {
      bookId: bookId,
      chapterNumber: chapterNum
    };
    const chapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
      method: 'POST',
      body: JSON.stringify(chapterDetailReq)
    });
    return chapterDetailResult;
  } catch (error) {
    console.error('Error fetching chapter data:', error);
  }
};

// 默认获取第一章数据（增加安全防护）
const chapterDetailResult = await fetchChapterDetail(chapterNumber.value);
const initalChapter = chapterDetailResult?.data ?? null;
chapterContent.value = initalChapter;

// 切换章节内容
const switchToChapter = async (chapterNum) => { 
  if (chapterNumber.value !== chapterNum) {
    chapterNumber.value = chapterNum;
    const newChapterContent = await fetchChapterDetail(chapterNum);
    chapterContent.value = newChapterContent?.data ?? null;
  }
};

/**
 * 加入书架
 */
const addToBookshelf = async () => {
  if (isInBookshelf.value) return;
  if (!isLoggedIn.value) {
    ElMessage.info('请先登录后再加入书架');
    router.push(`/login?redirectPath=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  const currentBookId = route.params.id;
  const addFavoriteReq = {
    bookIdList: [currentBookId]
  };
  
  try {
    const response = await apiAuthRequest(API_ENDPOINTS.ADD_BOOKS_TO_FAVORITE, {
      method: 'POST',
      body: JSON.stringify(addFavoriteReq)
    });
    if (response.code === 2008) {
      ElMessage.warning('登录已过期，请重新登录');
      router.push(`/login?redirectPath=${encodeURIComponent(route.fullPath)}`);
      return;
    }
    if (response.code === 200) {
      isInBookshelf.value = true;
      ElMessage.success('已加入书架！');
    } else {
      ElMessage.info(response.message || '加入书架失败');
    }
  } catch (error) {
    console.error('Error adding book to favorite:', error);
  }
};

// 检查是否已关注作者
try {
  if (authorId.value) {
    const checkFollowUrl = `${API_ENDPOINTS.CHECK_FOLLOW}${authorId.value}`;
    const checkFollowStatusResult = await apiRequest(checkFollowUrl, {
      method: 'GET'
    });
    if (checkFollowStatusResult.code === 200) {
      isFollowed.value = !!checkFollowStatusResult.data;
    }
  }
} catch (error) {
  console.error('Error fetching follow data:', error);
}

/**
 * 开始阅读
 */
const startReading = async () => {
  router.push(`/book/read?book=${bookId}&chapter=1`);
};

/**
 * 点击作者跳转到作者详情页
 */
const gotoAuthorDetail = (authorId) => {
  if (authorId) {
    router.push(`/author/${authorId}`);
  }
};

/**
 * 关注作者
 */
const followAuthor = async (authorId) => { 
  const operationType = isFollowed.value ? 1 : 0;
  try {
    const followReq = {
      userId: authorId,
      type: operationType,
      bookId: parseInt(bookId)
    };

    const response = await apiAuthRequest(API_ENDPOINTS.FOLLOW, {
      method: 'POST',
      body: JSON.stringify(followReq)
    });

    if (response.code === 200) {
      isFollowed.value = !isFollowed.value;
      if (isFollowed.value) {
        ElMessage.success('关注作者成功！');
      } else {
        ElMessage.info('已取消关注');
      }
    } else {
      ElMessage.error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('关注作者失败:', error);
    ElMessage.error('网络错误，请稍后重试');
  }
};

// 设置页面标题
useHead({
  title: book.value?.title ? `${book.value.title} - Simurg Reader` : '书籍详情',
  meta: [
    {
      name: 'description',
      content: book.value?.description || '书籍详情页面'
    }
  ]
});
</script>

<style lang="scss" scoped>
.book-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-canvas, #131415);
  background-image: url('/icon/backgroud.svg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: var(--color-text-primary, #ffffff);
  overflow-x: hidden;
}

.book-main {
  flex: 1;
  width: 100%;
  padding-top: 88px;
  padding-bottom: 64px;
  box-sizing: border-box;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-muted, #7c7e82);
  margin-bottom: 20px;
}

.breadcrumb-link {
  color: var(--color-text-secondary, #b0b1b3);
  text-decoration: none;
  transition: color var(--transition-fast, 150ms ease);

  &:hover {
    color: var(--color-brand-primary, #e59344);
  }
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.2);
}

.breadcrumb-current {
  color: var(--color-text-muted, #7c7e82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}

/* 核心 Hero 卡片 */
.book-hero-card {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 32px;
  background: var(--color-surface-base, #18191b);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 14px);
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.book-hero-primary {
  display: flex;
  gap: 28px;
  flex: 1;
  min-width: 0;
}

.book-cover-wrap {
  width: 168px;
  height: 224px;
  flex-shrink: 0;
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.04);
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-meta-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.book-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-status {
  background: linear-gradient(135deg, #e59344 0%, #c44f12 100%);
  color: #ffffff;
}

.tag-cate {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary, #b0b1b3);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.book-author {
  margin-top: 14px;
  font-size: 13px;
  color: var(--color-text-secondary, #b0b1b3);
  cursor: pointer;
  width: fit-content;

  .author-label {
    color: var(--color-text-muted, #7c7e82);
  }

  .author-link-text {
    color: var(--color-brand-light, #f0ad6a);
    font-weight: 500;
    transition: color var(--transition-fast, 150ms ease);

    &:hover {
      color: var(--color-brand-primary, #e59344);
      text-decoration: underline;
    }
  }
}

.book-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  font-size: 13px;
  color: var(--color-text-secondary, #b0b1b3);
}

.stat-divider {
  color: rgba(255, 255, 255, 0.15);
}

.book-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
}

.btn-read-now {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e59344 0%, #d87b28 100%);
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms ease);
  box-shadow: 0 4px 14px rgba(229, 147, 68, 0.35);

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(229, 147, 68, 0.45);
  }
}

.btn-add-to-bookshelf {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-primary, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms ease);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-brand-primary, #e59344);
    color: var(--color-brand-primary, #e59344);
    transform: translateY(-1px);
  }

  &.btn-in-bookshelf,
  &:disabled {
    opacity: 0.65;
    cursor: default;
    border-color: rgba(255, 255, 255, 0.15);
    color: #a2a0a0;
    background: rgba(255, 255, 255, 0.02);
    transform: none !important;
  }
}

/* 分割线 */
.hero-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  align-self: stretch;
}

/* 右侧作者专栏卡片 */
.author-side-card {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.author-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.12);
  transition: transform var(--transition-fast, 150ms ease);

  &:hover {
    transform: scale(1.05);
  }
}

.author-avatar-fallback {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-muted, #7c7e82);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.12);
}

.author-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-display-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;

  &:hover {
    color: var(--color-brand-primary, #e59344);
  }
}

.author-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  background: linear-gradient(135deg, #e59344 0%, #c44f12 100%);
  border-radius: 4px;
  font-size: 11px;
  color: #ffffff;
  font-weight: 500;
  flex-shrink: 0;
}

.btn-follow {
  width: fit-content;
  padding: 4px 14px;
  border-radius: 12px;
  background: var(--color-brand-primary, #e59344);
  color: #ffffff;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms ease);

  &:hover {
    filter: brightness(1.08);
  }

  &.followed {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-secondary, #b0b1b3);
    border: 1px solid rgba(255, 255, 255, 0.15);

    &:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
    }
  }
}

.author-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.author-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-stat-label {
  font-size: 11px;
  color: var(--color-text-muted, #7c7e82);
}

.author-stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* 统一各板块卡片容器 */
.book-card-section {
  margin-top: 24px;
  background: var(--color-surface-base, #18191b);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: var(--radius-lg, 14px);
  padding: 24px 28px;
  box-sizing: border-box;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.title-bar {
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: var(--color-brand-primary, #e59344);
}

.section-title-text {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

/* 简介文本 */
.book-desc-content {
  width: 100%;
}

.book-desc-text {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary, #cccccc);
  line-height: 1.8;
  letter-spacing: 0.02em;
  text-align: justify;
}

/* 章节目录 */
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms ease);
  min-width: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(229, 147, 68, 0.3);

    .chapter-title {
      color: var(--color-brand-primary, #e59344);
    }
  }

  &.chapter-active {
    background: rgba(229, 147, 68, 0.1);
    border-color: var(--color-brand-primary, #e59344);

    .chapter-badge {
      color: var(--color-brand-primary, #e59344);
      font-weight: 600;
    }

    .chapter-title {
      color: var(--color-brand-primary, #e59344);
      font-weight: 600;
    }
  }
}

.chapter-badge {
  font-size: 12px;
  color: var(--color-text-muted, #7c7e82);
  flex-shrink: 0;
}

.chapter-title {
  font-size: 13px;
  color: var(--color-text-secondary, #d0d1d3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.empty-hint {
  font-size: 14px;
  color: var(--color-text-muted, #7c7e82);
  text-align: center;
  padding: 32px 0;
}

.chapter-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.btn-more-chapters {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 28px;
  border-radius: 20px;
  border: 1px solid var(--color-brand-primary, #e59344);
  background: transparent;
  color: var(--color-brand-primary, #e59344);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms ease);

  &:hover:not(:disabled) {
    background: var(--color-brand-primary, #e59344);
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

/* 在线试读 */
.reading-preview-box {
  width: 100%;
}

.reading-preview-text {
  margin: 0;
  font-size: 15px;
  color: var(--color-text-secondary, #dcdcdc);
  line-height: 2;
  letter-spacing: 0.03em;
  text-align: justify;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 加载占位符 */
.book-loading-placeholder {
  margin: 100px auto 60px;
  padding: 40px;
  background: var(--color-surface-base, #18191b);
  border-radius: var(--radius-lg, 14px);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
}

/* 响应式断点适配 */
@media (max-width: 960px) {
  .book-hero-card {
    flex-direction: column;
    gap: 24px;
    padding: 20px;
  }

  .hero-divider {
    width: 100%;
    height: 1px;
  }

  .author-side-card {
    width: 100%;
  }

  .author-stats-grid {
    margin-top: 16px;
    padding-top: 14px;
  }
}

@media (max-width: 640px) {
  .book-main {
    padding-top: 76px;
    padding-bottom: 40px;
  }

  .book-hero-primary {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
  }

  .book-cover-wrap {
    width: 140px;
    height: 188px;
  }

  .book-title {
    font-size: 20px;
    white-space: normal;
  }

  .book-tags {
    justify-content: center;
  }

  .book-author {
    margin-left: auto;
    margin-right: auto;
  }

  .book-stats {
    justify-content: center;
    font-size: 12px;
  }

  .book-actions {
    width: 100%;
    gap: 12px;
  }

  .btn-read-now,
  .btn-add-to-bookshelf {
    flex: 1;
    padding: 0 12px;
    font-size: 13px;
  }

  .book-card-section {
    padding: 18px 16px;
    margin-top: 16px;
  }

  .chapter-grid {
    grid-template-columns: 1fr;
  }
}

.book-empty-state {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--bg-surface-1, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  padding: 48px 32px;
  max-width: 480px;
  width: 100%;
}

.empty-icon-wrap {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #ffffff);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary, #90949d);
  margin: 0 0 28px;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  gap: 16px;
}

.btn-empty-home,
.btn-empty-cate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 20px;
  border-radius: 19px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-empty-home {
  background: linear-gradient(135deg, #e59e2b 0%, #e06828 100%);
  color: #ffffff;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
}

.btn-empty-cate {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.12);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
}
</style>
