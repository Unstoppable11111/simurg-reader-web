<template>
  <section class="search-result-section" aria-label="搜索结果">
    <div class="search-result-header">
      <div class="search-query-info">
        <h2 class="search-result-title">“<span class="highlight">{{ searchQuery }}</span>” 的搜索结果</h2>
        <span class="search-result-count">共 {{ searchResult.length }} 本书籍</span>
      </div>
      <button 
        type="button" 
        class="clear-search-btn" 
        @click="$emit('clear-search')"
        aria-label="关闭搜索结果，返回首页"
      >
        <span>返回首页推荐</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 加载中状态 -->
    <div v-if="isSearching" class="search-loading-grid">
      <div v-for="i in 8" :key="i" class="skeleton-card">
        <div class="skeleton-cover"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line author"></div>
      </div>
    </div>

    <!-- 有结果列表 -->
    <div v-else-if="searchResult.length > 0" class="search-result-grid">
      <article 
        v-for="book in searchResult" 
        :key="book.id || book.bookId" 
        class="search-book-card"
        @click="$emit('select-book', book.id || book.bookId)"
        tabindex="0"
        @keyup.enter="$emit('select-book', book.id || book.bookId)"
      >
        <div class="cover-wrapper">
          <img 
            :src="book.coverImageUrl" 
            :alt="book.title ? `${book.title} 封面` : '书籍封面'" 
            class="book-cover"
            loading="lazy"
          />
        </div>
        <div class="book-info">
          <h3 class="book-name">{{ book.title }}</h3>
          <p class="book-author">作者：{{ book.authorPenName || '未知' }}</p>
          <p class="book-desc">{{ book.protagonistIntroduction || book.description || '暂无简介' }}</p>
        </div>
      </article>
    </div>

    <!-- 无结果空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8 11H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">未找到相关书籍</h3>
      <p class="empty-desc">没有找到与 “{{ searchQuery }}” 匹配的内容，请尝试更换书名或作者名关键词</p>
      <button type="button" class="empty-action-btn" @click="$emit('clear-search')">
        返回首页
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string;
  searchResult: any[];
  isSearching?: boolean;
}

withDefaults(defineProps<Props>(), {
  searchResult: () => [],
  isSearching: false
});

defineEmits<{
  (e: 'select-book', bookId: string | number): void;
  (e: 'clear-search'): void;
}>();
</script>

<style scoped>
.search-result-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--space-8) auto;
  padding: 0 var(--space-6);
  box-sizing: border-box;
}

.search-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
}

.search-query-info {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.search-result-title {
  margin: 0;
  font-size: var(--text-h3);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}

.highlight {
  color: var(--brand-primary);
}

.search-result-count {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

.clear-search-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: var(--text-caption);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-small) var(--ease-standard);
}

.clear-search-btn:hover {
  background: var(--bg-surface-3);
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.search-result-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.search-book-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  cursor: pointer;
  transition: transform var(--duration-small) var(--ease-out-smooth),
              box-shadow var(--duration-small) var(--ease-standard),
              border-color var(--duration-small) var(--ease-standard);
  outline: none;
}

.search-book-card:hover,
.search-book-card:focus-visible {
  transform: translateY(-4px);
  border-color: var(--brand-muted);
  box-shadow: var(--shadow-card-hover);
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-surface-2);
  margin-bottom: var(--space-3);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.book-name {
  margin: 0 0 var(--space-1) 0;
  font-size: var(--text-body-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.book-desc {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--text-muted);
  line-height: var(--leading-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 骨架屏加载 */
.search-loading-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.skeleton-card {
  background: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--bg-surface-2);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-3);
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-line {
  background: var(--bg-surface-2);
  border-radius: var(--radius-xs);
  margin-bottom: var(--space-2);
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-line.title {
  height: 16px;
  width: 70%;
}

.skeleton-line.author {
  height: 12px;
  width: 40%;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-4);
  text-align: center;
}

.empty-icon-box {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--bg-surface-2);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.empty-title {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-h4);
  color: var(--text-primary);
}

.empty-desc {
  margin: 0 0 var(--space-6) 0;
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  max-width: 400px;
}

.empty-action-btn {
  background: var(--brand-primary);
  color: var(--text-inverse);
  border: none;
  font-size: var(--text-body-sm);
  font-weight: var(--weight-medium);
  padding: 8px 24px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-small) var(--ease-standard);
}

.empty-action-btn:hover {
  background: var(--brand-hover);
}

@media (max-width: 1024px) {
  .search-result-grid,
  .search-loading-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .search-result-section {
    padding: 0 var(--space-4);
  }
  .search-result-grid,
  .search-loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }
}
</style>
