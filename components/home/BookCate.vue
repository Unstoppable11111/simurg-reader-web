<template>
  <div class="book-cate-box">
    <div class="book-cate-list">
      <!-- 使用v-for循环循环渲染分类项 -->
      <div 
        class="book-cate-item" 
        v-for="(category, index) in bookCateList" 
        :key="index"
      >
        <img 
          :src="category.iconImageUrl" 
          :alt="category.categoryName" 
          class="cate-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_ENDPOINTS, apiRequest } from '@/utils/api'
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
})
</script>

<style lang="scss" scoped>
  .book-cate-box {
    margin-top: 38px;
  }
  .book-cate-list {
    display: flex;
    gap: 20px;
  }
  
  .cate-img {
    width: 154px;
    height: 185px;
    box-shadow: 0px 4px 10px 0px rgba(197,195,195,0.5);
    border-radius: 10px;
    transition: transform 0.3s ease; /* 添加过渡效果 */
    &:not(:valid) {
      background-color: #828282;
    }
  }
  
  // 为分类项添加悬停效果
  .book-cate-item {
    cursor: pointer;
    
    &:hover .cate-img {
      transform: translateY(-5px); /* 悬停时上浮 */
      box-shadow: 0px 8px 15px 0px rgba(197,195,195,0.7); /* 增强阴影 */
    }
  }
  @media (max-width: 768px) {
    .book-cate-box {
      width: 100%;
    }
    .book-cate-list {
      flex-wrap: wrap;
      gap: 12px;
    }
    .book-cate-item {
      width: calc(33.333% - 8px);
    }
    .cate-img {
      width: 100%;
      height: 120px;
    }
  }

  @media (max-width: 480px) {
    .book-cate-item {
      width: calc(50% - 6px);
    }
    .cate-img {
      height: 140px;
    }
  }
</style>
