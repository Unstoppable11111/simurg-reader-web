<template>
  <div class="book-cate-box">
    <div class="book-cate-list">
      <!-- 使用v-for循环渲染分类项 -->
      <div 
        class="book-cate-item" 
        v-for="(category, index) in bookCateList" 
        :key="category.categoryId || index"
        @click="gotoCategory(category.categoryId)"
      >
        <img 
          :src="category.iconImageUrl" 
          :alt="category.categoryName || '分类'" 
          class="cate-img"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const props = defineProps({
  bookCateList: {
    type: Array,
    default: () => [],
    required: true
  },
  apiUrl: {
    type: String,
    default: API_ENDPOINTS.RANKING_BOOKS
  },
});

const gotoCategory = (categoryId) => {
  if (categoryId) {
    router.push(`/bookcate?categoryId=${categoryId}`);
  } else {
    router.push('/bookcate');
  }
};
</script>

<style lang="scss" scoped>
.book-cate-box {
  width: 100%;
  box-sizing: border-box;
}

.book-cate-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.book-cate-item {
  width: 100%;
  cursor: pointer;
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  transition: transform 0.3s ease;
  aspect-ratio: 154 / 185;

  &:hover {
    transform: translateY(-4px);
    .cate-img {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      filter: brightness(1.06);
    }
  }
}

.cate-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-md, 10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s ease, filter 0.3s ease;
}

@media (max-width: 768px) {
  .book-cate-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}

@media (max-width: 520px) {
  .book-cate-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

@media (max-width: 360px) {
  .book-cate-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>
