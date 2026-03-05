<template>
  <div class="feature-card-carousel">
    <button class="carousel-arrow left-arrow" aria-label="上一页">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="view-port">
      <swiper
        :modules="modules"
        :slides-per-view="6"
        :space-between="24"
        :centered-slides="true"
        :loop="true"
        :navigation="{
          prevEl: '.left-arrow',
          nextEl: '.right-arrow',
        }"
        class="mySwiper"
      >
        <swiper-slide 
          v-for="(book, idx) in [...books, ...books]" 
          :key="`${book.bookId}-${idx}`"
          v-slot="{ isActive }"
        >
          <div 
            class="feature-card" 
            :class="{ 'active-part': isActive }"
            @click="gotoBookDetail(book.bookId)"
          >
            <div class="book-img-box">
              <img :src="book.coverImageUrl" :alt="book.title" class="book-img" />
            </div>
            <div class="book-info">
              <div class="book-title">{{ book.title }}</div>
              <div class="book-cate">
                {{ book.bookCategoryResponseList?.[0]?.categoryName }}
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <button class="carousel-arrow right-arrow" aria-label="下一页">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L16 12L9 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { useRouter } from 'vue-router';

import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
  books: {
    type: Array,
    default: () => [],
    required: true
  }
});

const modules = [Navigation];
const router = useRouter();

const gotoBookDetail = (bookId) => {
  router.push(`/book/${bookId}`);
};
</script>

<style lang="scss" scoped>
$base-w: 168px;
$base-h: 224px;
/* 这里的 active 尺寸用于计算比例，我们主要通过 scale 实现等比放大 */
$active-w: 216px; 
$active-h: 288px;
$info-h: 60px;

.feature-card-carousel {
  width: 1200px;
  position: relative;
  margin: 0 auto;
  padding: 50px 0; /* 上下留出空间给放大后的图片 */
}

.view-port {
  width: 100%;
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center; /* 改为居中对齐，实现上下等比放大 */
  height: 400px; 
  transition: transform 0.4s ease;
}

.feature-card {
  width: $base-w;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .book-img-box {
    width: $base-w;
    height: $base-h;
    border-radius: 10px;
    overflow: hidden;
    background-color: #333;
    transition: inherit;
    
    .book-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .book-info {
    margin-top: 15px;
    height: $info-h;
    text-align: center;
    transition: inherit;
    width: 100%; 
    
    .book-title {
      font-size: 14px;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      &:hover { color: #F9A825; }
    }
    .book-cate {
      font-size: 12px;
      color: #A2A0A0;
      margin-top: 4px;
    }
  }

  /* 激活状态 */
  &.active-part {
    /* 通过 transform 实现中心等比放大 */
    transform: scale(1.25); 
    z-index: 10;

    .book-img-box {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    }

    .book-info {
      /* 放大后图片变长，为了不遮挡文字且保持视觉比例，轻微向下偏移 */
      transform: translateY(10px); 
      
      .book-title {
        font-weight: 800; /* 字体加重 */
        color: #FFFFFF;
        /* 抵消整体 scale 导致的模糊，微调字号 */
        font-size: 14px; 
      }
      .book-cate {
        font-weight: 600;
        color: #F9A825; /* 选中时类别文字高亮，增加质感 */
      }
    }
  }
}

.carousel-arrow {
  position: absolute;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgb(255, 255, 255, 0.5);
  // border: 1px solid rgb(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -3%;
  transform: translateY(-50%); /* 按钮居中 */
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled, &.swiper-button-disabled {
    opacity: 0.3;
  }
}

.left-arrow { left: 0px; }
.right-arrow { right: 0px; }
</style>