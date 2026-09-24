<template>
  <div class="recommend-box">
    <div 
      class="recommend-book-item"
      :class="{ 'book-recommend-active': activeIndex === index }"
      @mouseenter="activeIndex = index"
      v-for="(book, index) in displayBooks" 
      :key="book.bookId || index"
      @click="gotoBookDetail(book.bookId)"
    >
      <!-- 未激活卡片：紧凑展示封面与标题 -->
      <div v-show="activeIndex !== index" class="collapsed-card">
        <div class="collapsed-cover-wrap">
          <img 
            :src="book.coverImageUrl" 
            :alt="book.title || '书籍封面'" 
            class="collapsed-img" 
            loading="lazy"
          >
          <div class="cover-gradient"></div>
        </div>
        <div class="collapsed-info">
          <span class="collapsed-title" :title="book.title">{{ book.title }}</span>
          <span class="collapsed-hot">
            <svg class="hot-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.32 1.83-6.23 4.54-7.75.48-.27 1.09-.07 1.32.42.23.49.03 1.08-.43 1.34C6.18 9.29 5 11.51 5 14c0 3.86 3.14 7 7 7s7-3.14 7-7c0-2.31-1.04-4.4-2.83-5.77-.42-.32-.52-.92-.23-1.37.28-.44.88-.58 1.33-.27C19.78 8.44 21 11.08 21 14c0 4.97-4.03 9-9 9z"/>
              <path d="M12 18c-2.21 0-4-1.79-4-4 0-1.5.82-2.8 2.05-3.5.43-.24.97-.07 1.2.36.23.43.07.97-.36 1.2C10.36 12.36 10 13.14 10 14c0 1.1.9 2 2 2s2-.9 2-2c0-.7-.37-1.33-.94-1.68-.43-.27-.56-.84-.3-1.28.27-.43.84-.57 1.28-.3C15.17 11.39 16 12.6 16 14c0 2.21-1.79 4-4 4z"/>
            </svg>
            {{ book.bookViews || 0 }}
          </span>
        </div>
      </div>

      <!-- 激活聚焦卡片：展开高亮展示详细信息 -->
      <div v-show="activeIndex === index" class="active-card">
        <div class="active-cover-wrap">
          <img 
            :src="book.coverImageUrl" 
            :alt="book.title || '书籍封面'" 
            class="active-img" 
            loading="lazy"
          >
        </div>
        <div class="active-info">
          <h3 class="active-title" :title="book.title">{{ book.title }}</h3>
          <div 
            class="active-author" 
            @click.stop="gotoAuthorDetail(book.authorId)"
            title="查看作者主页"
          >
            <span class="author-label">作者：</span>
            <span class="author-name">{{ book.authorPenName || '未知作家' }}</span>
          </div>

          <div class="active-meta-tags">
            <span class="meta-tag status" v-if="book.serialStatus !== undefined">
              {{ formatSerialStatus(book.serialStatus) }}
            </span>
            <span class="meta-divider" v-if="book.serialStatus !== undefined">•</span>
            <span class="meta-tag hot">热度 {{ book.bookViews || 0 }}</span>
            <span class="meta-divider" v-if="book.publishDate">•</span>
            <span class="meta-tag date" v-if="book.publishDate">
              更新于 {{ formatTimestamp(book.publishDate) }}
            </span>
          </div>

          <p class="active-desc">
            {{ book.description || '暂无作品简介。' }}
          </p>

          <div class="active-action">
            <span class="read-btn">
              立即阅读
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';

const router = useRouter();

const props = defineProps({
  recommendBooks: {
    type: Array,
    default: () => [],
    required: true
  }
});

// 桌面端最多展示4本精选推荐，确保手风琴宽度自适应不溢出
const displayBooks = computed(() => {
  return props.recommendBooks?.slice(0, 4) || [];
});

const activeIndex = ref(0);

const gotoBookDetail = (bookId) => {
  if (bookId) {
    router.push(`/book/${bookId}`);
  }
};

const gotoAuthorDetail = (authorId) => {
  if (authorId) {
    router.push(`/author/${authorId}`);
  }
};
</script>

<style lang="scss" scoped>
.recommend-box {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0 24px;
  gap: 16px;
  box-sizing: border-box;
}

.recommend-book-item {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 140px;
  height: 290px;
  cursor: pointer;
  border-radius: var(--radius-lg, 12px);
  background: var(--color-surface-base, #18191b);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  overflow: hidden;
  box-sizing: border-box;
  transition: flex 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.25s ease,
              border-color 0.25s ease,
              box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }

  &.book-recommend-active {
    flex: 3.2;
    min-width: 480px;
    background: var(--color-surface-elevated, #212327);
    border-color: var(--color-brand-primary, #e59344);
    box-shadow: var(--shadow-md, 0 8px 24px rgba(0, 0, 0, 0.35));
  }
}

/* 折叠卡片 */
.collapsed-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.collapsed-cover-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.collapsed-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.collapsed-info {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 4px;
}

.collapsed-title {
  font-size: var(--font-size-body, 14px);
  font-weight: 600;
  color: var(--color-text-primary, #ffffff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.collapsed-hot {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-caption, 12px);
  color: var(--color-brand-primary, #e59344);
}

.hot-icon {
  flex-shrink: 0;
}

/* 激活卡片 */
.active-card {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 20px 24px;
  gap: 24px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease-out;
}

.active-cover-wrap {
  width: 175px;
  height: 250px;
  flex-shrink: 0;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}

.active-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.active-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  justify-content: space-between;
}

.active-title {
  margin: 0;
  font-size: var(--font-size-h3, 20px);
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--transition-fast, 150ms ease);

  &:hover {
    color: var(--color-brand-primary, #e59344);
  }
}

.active-author {
  margin-top: 6px;
  font-size: var(--font-size-small, 14px);
  color: var(--color-text-secondary, #b0b1b3);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;

  .author-name {
    color: var(--color-brand-light, #f0ad6a);
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
}

.active-meta-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  font-size: var(--font-size-caption, 12px);
}

.meta-tag {
  color: var(--color-text-muted, #7c7e82);

  &.status {
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(229, 147, 68, 0.12);
    color: var(--color-brand-primary, #e59344);
    font-weight: 500;
  }

  &.hot {
    color: var(--color-brand-light, #f0ad6a);
  }
}

.meta-divider {
  color: rgba(255, 255, 255, 0.2);
}

.active-desc {
  margin: 12px 0 0;
  font-size: var(--font-size-small, 13px);
  color: var(--color-text-secondary, #a8a9aa);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-action {
  margin-top: auto;
  padding-top: 12px;
}

.read-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full, 9999px);
  background: rgba(229, 147, 68, 0.15);
  color: var(--color-brand-primary, #e59344);
  font-size: var(--font-size-small, 13px);
  font-weight: 600;
  transition: all var(--transition-fast, 150ms ease);

  &:hover {
    background: var(--color-brand-primary, #e59344);
    color: #ffffff;
    transform: translateX(2px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 900px) {
  .recommend-box {
    flex-direction: column;
    padding: 8px 16px;
    gap: 12px;
  }

  .recommend-book-item {
    width: 100%;
    min-width: 0;
    height: auto;
    flex: none !important;

    &.book-recommend-active {
      min-width: 0;
    }
  }

  /* 移动端统一使用展开卡片样式，不再隐藏详情 */
  .collapsed-card {
    display: none !important;
  }

  .active-card {
    display: flex !important;
    padding: 14px;
    gap: 14px;
  }

  .active-cover-wrap {
    width: 90px;
    height: 120px;
  }

  .active-title {
    font-size: 16px;
  }

  .active-desc {
    -webkit-line-clamp: 2;
    margin-top: 6px;
  }
}
</style>
