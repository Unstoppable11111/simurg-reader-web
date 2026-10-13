<template>
  <div class="last-update-book-box">
    <div class="table-container">
      <!-- 桌面端表头 -->
      <div class="table-header">
        <div class="th col-type">类型</div>
        <div class="th col-title">书名</div>
        <div class="th col-chapter">最新章节</div>
        <div class="th col-author">作者</div>
        <div class="th col-time">更新时间</div>
      </div>

      <!-- 数据行列表 -->
      <div class="table-body">
        <div 
          v-for="book in recentUpdateBooks" 
          :key="book.bookId" 
          class="table-row"
        >
          <!-- 桌面端展示 -->
          <div class="tr col-type">
            <span class="type-badge">
              {{ book.bookCategoryResponseList?.[0]?.categoryName || '小说' }}
            </span>
          </div>

          <div 
            class="tr col-title book-link" 
            @click="gotoBookDetail(book.bookId)"
            :title="book.title"
          >
            {{ book.title }}
          </div>

          <div 
            class="tr col-chapter chapter-link"
            @click="startReading(book.bookId, book.lastChapterNumber)"
            :title="book.chapterTitle || '最新章节'"
          >
            {{ book.chapterTitle || '暂无更新' }}
          </div>

          <div 
            class="tr col-author author-link" 
            @click="gotoAuthorDetail(book.authorId)"
            :title="book.authorPenName"
          >
            {{ book.authorPenName || '未知作家' }}
          </div>

          <div class="tr col-time">
            {{ formatTimestamp(book.lastUpdateTime) }}
          </div>

          <!-- 移动端紧凑排版 -->
          <div class="mobile-row-content">
            <div class="mobile-top">
              <span class="type-badge-mini">
                {{ book.bookCategoryResponseList?.[0]?.categoryName || '小说' }}
              </span>
              <span class="mobile-title" @click="gotoBookDetail(book.bookId)">
                {{ book.title }}
              </span>
              <span class="mobile-time">
                {{ formatTimestamp(book.lastUpdateTime) }}
              </span>
            </div>
            <div class="mobile-bottom">
              <span 
                class="mobile-chapter" 
                @click="startReading(book.bookId, book.lastChapterNumber)"
              >
                {{ book.chapterTitle || '暂无更新' }}
              </span>
              <span 
                class="mobile-author" 
                @click="gotoAuthorDetail(book.authorId)"
              >
                {{ book.authorPenName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/dataFormatter';

const router = useRouter();

const props = defineProps({
  recentUpdateBooks: {
    type: Array,
    default: () => [],
    required: true
  }
});

const gotoBookDetail = (bookId) => {
  if (bookId) {
    router.push(`/book/${bookId}`);
  }
};

const startReading = (bookId, chapterNumber) => {
  if (!bookId) return;
  if (chapterNumber) {
    router.push(`/book/read?book=${bookId}&chapter=${chapterNumber}`);
  } else {
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
.last-update-book-box {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.table-container {
  width: 100%;
  border-radius: var(--radius-lg, 12px);
  background: var(--color-surface-base, #18191b);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 240px 1fr 160px 140px;
  align-items: center;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));

  .th {
    font-size: var(--font-size-small, 13px);
    font-weight: 500;
    color: var(--color-text-muted, #7c7e82);
    text-align: left;
  }

  .col-time {
    text-align: right;
  }
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 240px 1fr 160px 140px;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.04));
  transition: background-color var(--transition-fast, 150ms ease);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-surface-hover, rgba(255, 255, 255, 0.03));
  }

  .tr {
    font-size: var(--font-size-body, 14px);
    color: var(--color-text-secondary, #b0b1b3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-link {
    color: var(--color-text-primary, #ffffff);
    font-weight: 500;
    cursor: pointer;
    padding-right: 16px;

    &:hover {
      color: var(--color-brand-primary, #e59344);
    }
  }

  .chapter-link {
    cursor: pointer;
    color: var(--color-text-secondary, #a8a9aa);
    padding-right: 16px;

    &:hover {
      color: var(--color-brand-light, #f0ad6a);
      text-decoration: underline;
    }
  }

  .author-link {
    cursor: pointer;
    &:hover {
      color: var(--color-brand-primary, #e59344);
    }
  }

  .col-time {
    font-size: var(--font-size-caption, 12px);
    color: var(--color-text-muted, #7c7e82);
    text-align: right;
  }
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text-secondary, #b0b1b3);
  font-size: var(--font-size-caption, 12px);
}

.mobile-row-content {
  display: none;
}

/* 响应式断点适配 */
@media (max-width: 900px) {
  .table-header {
    display: none;
  }

  .table-row {
    display: block;
    padding: 12px 16px;

    .tr {
      display: none;
    }
  }

  .mobile-row-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mobile-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .type-badge-mini {
    padding: 1px 6px;
    border-radius: 3px;
    background: rgba(229, 147, 68, 0.12);
    color: var(--color-brand-primary, #e59344);
    font-size: 11px;
    flex-shrink: 0;
  }

  .mobile-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary, #ffffff);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .mobile-time {
    font-size: 11px;
    color: var(--color-text-muted, #7c7e82);
    flex-shrink: 0;
  }

  .mobile-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
  }

  .mobile-chapter {
    color: var(--color-text-secondary, #a8a9aa);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    cursor: pointer;
  }

  .mobile-author {
    color: var(--color-text-muted, #828488);
    flex-shrink: 0;
    cursor: pointer;
  }
}
</style>
