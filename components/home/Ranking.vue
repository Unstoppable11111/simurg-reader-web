<template>
  <div class="ranking-box">
    <div 
      v-for="board in rankingBoards" 
      :key="board.id"
      class="ranking-column"
      v-show="board.list && board.list.length > 0"
    >
      <!-- 排行榜头部 -->
      <div class="ranking-header">
        <SvgIcon name="ranking-icon-left" class="ranking-header-icon" width="16" height="24" color="none" />
        <h3 class="ranking-title">{{ board.title }}</h3>
        <SvgIcon name="ranking-icon-right" class="ranking-header-icon" width="16" height="24" color="none" />
      </div>

      <!-- 排行榜书籍列表 -->
      <div class="ranking-list">
        <div 
          v-for="(book, index) in board.list" 
          :key="book.bookId || index"
          class="ranking-item"
          @click="gotoBookDetail(book.bookId)"
        >
          <!-- 书籍封面 -->
          <div class="cover-wrapper">
            <img 
              :src="book.coverImageUrl" 
              :alt="book.title || '封面'" 
              class="book-cover" 
              loading="lazy"
            >
          </div>

          <!-- 排名角标 -->
          <div class="rank-badge-wrap">
            <img 
              :src="getRankIcon(index)" 
              :alt="`Rank ${index + 1}`"
              class="rank-icon"
            />
          </div>

          <!-- 书籍信息 -->
          <div class="book-info">
            <h4 class="book-title" :title="book.title">{{ book.title }}</h4>
            <span class="book-cate">
              {{ book.bookCategoryResponseList?.[0]?.categoryName || '精品小说' }}
            </span>
            <div class="book-hot-wrap">
              <span class="book-hot">{{ book.bookViews || 0 }} 热度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_ENDPOINTS } from '@/utils/api';
import SvgIcon from '@/components/SvgIcon.vue';

const router = useRouter();

const props = defineProps({
  apiUrl: {
    type: String,
    default: API_ENDPOINTS.RANKING_BOOKS
  }
});

const RANK_ICONS = [
  '/icon/one.svg',
  '/icon/two.svg',
  '/icon/three.svg',
  '/icon/fore.svg',
  '/icon/five.svg'
];

const getRankIcon = (index) => {
  return RANK_ICONS[index] || RANK_ICONS[4];
};

const gotoBookDetail = (bookId) => {
  if (bookId) {
    router.push(`/book/${bookId}`);
  }
};

const hotBooks = ref([]);
const newBooks = ref([]);
const bestSellersBooks = ref([]);

// 服务端渲染预取排行榜数据
const { data: rankingData } = await useAsyncData('home-ranking-data', async () => {
  const [hotResult, newResult, bestResult] = await Promise.allSettled([
    useRequest(props.apiUrl, {
      method: 'POST',
      body: { rankingType: 1, rankingSize: 5 }
    }),
    useRequest(props.apiUrl, {
      method: 'POST',
      body: { rankingType: 5, rankingSize: 5 }
    }),
    useRequest(props.apiUrl, {
      method: 'POST',
      body: { rankingType: 4, rankingSize: 5 }
    })
  ]);

  return {
    hot: hotResult.status === 'fulfilled' && hotResult.value?.code === 200 ? (hotResult.value.data || []) : [],
    newB: newResult.status === 'fulfilled' && newResult.value?.code === 200 ? (newResult.value.data || []) : [],
    best: bestResult.status === 'fulfilled' && bestResult.value?.code === 200 ? (bestResult.value.data || []) : []
  };
});

if (rankingData.value) {
  hotBooks.value = rankingData.value.hot || [];
  newBooks.value = rankingData.value.newB || [];
  bestSellersBooks.value = rankingData.value.best || [];
}

const rankingBoards = computed(() => [
  { id: 'hot', title: '大热榜', list: hotBooks.value },
  { id: 'new', title: '新书榜', list: newBooks.value },
  { id: 'best', title: '完结榜', list: bestSellersBooks.value }
]);
</script>

<style lang="scss" scoped>
.ranking-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.ranking-column {
  display: flex;
  flex-direction: column;
  background: var(--color-surface-base, #18191b);
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: var(--radius-lg, 12px);
  padding: 20px 16px;
  box-sizing: border-box;
  transition: border-color var(--transition-fast, 150ms ease);

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
}

.ranking-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.06));
}

.ranking-header-icon {
  display: inline-block;
  opacity: 0.85;
}

.ranking-title {
  margin: 0;
  font-size: var(--font-size-h3, 20px);
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  letter-spacing: var(--letter-spacing-wide, 0.02em);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  background: transparent;
  transition: all var(--transition-fast, 150ms ease);
  box-sizing: border-box;

  &:hover {
    background: var(--color-surface-hover, rgba(255, 255, 255, 0.04));
    transform: translateY(-2px);

    .book-title {
      color: var(--color-brand-primary, #e59344);
    }

    .book-cover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.3));
    }
  }
}

.cover-wrapper {
  width: 66px;
  height: 88px;
  flex-shrink: 0;
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: box-shadow var(--transition-fast, 150ms ease);
}

.rank-badge-wrap {
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 8px;
}

.rank-icon {
  width: 22px;
  height: 33px;
  object-fit: contain;
}

.book-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4px;
}

.book-title {
  margin: 0;
  font-size: var(--font-size-body, 15px);
  font-weight: 600;
  color: var(--color-text-primary, #ffffff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  transition: color var(--transition-fast, 150ms ease);
}

.book-cate {
  font-size: var(--font-size-caption, 12px);
  color: var(--color-text-muted, #7c7e82);
  line-height: 1.3;
}

.book-hot-wrap {
  margin-top: 4px;
}

.book-hot {
  font-size: var(--font-size-caption, 12px);
  color: var(--color-brand-primary, #e59344);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .ranking-box {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .ranking-box {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
}
</style>
