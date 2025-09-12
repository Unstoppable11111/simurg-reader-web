<template>
  <div class="book-cate-box">
    <div class="book-cate-list">
      <!-- 使用v-for循环循环渲染分类项 -->
      <div 
        class="book-cate-item" 
        v-for="(category, index) in categories" 
        :key="index"
      >
        <img 
          :src="category.imgUrl" 
          :alt="category.name" 
          class="cate-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 分类数据数组
const categories = ref([
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate1.png",
    name: "青少年小说"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate2.png",
    name: "科幻小说"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate3.png",
    name: "历史传记"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate4.png",
    name: "悬疑推理"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate5.png",
    name: "浪漫爱情"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate6.png",
    name: "生活励志"
  },
  {
    imgUrl: "http://www.tireba.com/simurg-reader/images/cate7.png",
    name: "商业财经"
  }
]);
</script>

<style lang="scss" scoped>
  .book-cate-box {
    margin-top: 38px;
  }
  .book-cate-list {
    display: flex;
    gap: 24px;
  }
  
  .cate-img {
    width: 174px;
    height: 185px;
    background: #979797;
    box-shadow: 0px 4px 10px 0px rgba(197,195,195,0.5);
    border-radius: 10px;
    transition: transform 0.3s ease; /* 添加过渡效果 */
  }
  
  // 为分类项添加悬停效果
  .book-cate-item {
    cursor: pointer;
    
    &:hover .cate-img {
      transform: translateY(-5px); /* 悬停时上浮 */
      box-shadow: 0px 8px 15px 0px rgba(197,195,195,0.7); /* 增强阴影 */
    }
  }
</style>
