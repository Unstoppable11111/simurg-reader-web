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

// 必须引入的 Swiper 样式
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
/* 统一定义尺寸变量 */
$base-w: 168px;
$base-h: 224px;
$active-w: 216px;
$active-h: 288px;
$info-h: 50px; // 文字区域高度

.feature-card-carousel {
  width: 1200px;
  position: relative;
  margin: 0 auto;
  overflow: visible;
}

.view-port {
  width: 100%;
  /* 顶部留白 = 大图高度 - 小图高度 (288-224=64px)，确保大图不被裁切 */
  padding-top: 64px; 
}

/* 关键：设置 Slide 底部对齐 */
:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: flex-end; 
  height: 350px; // 固定高度，包含图片和文字
}

.feature-card {
  width: $base-w;
  display: flex;
  flex-direction: column;
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
    margin-top: 12px;
    height: $info-h;
    transition: inherit;
    
    .book-title {
      font-size: 14px;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover { color: #F9A825; }
    }
    .book-cate {
      font-size: 12px;
      color: #A2A0A0;
      margin-top: 4px;
    }
  }

  /* 激活状态：向两侧和向上生长 */
  &.active-part {
    width: $active-w;

    .book-img-box {
      width: $active-w;
      height: $active-h;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .book-info {
      .book-title { font-size: 16px; }
      .book-cate { font-size: 14px; }
    }
  }
}

/* 按钮精准对齐普通卡片（非选中图）的中心 */
.carousel-arrow {
  position: absolute;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  /* 计算公式：
     padding-top (64px) + 普通图片高度一半 (112px) = 176px
  */
  top: 224px; 
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
  
  &:disabled, &.swiper-button-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.left-arrow { left: -60px; }
.right-arrow { right: -60px; }

</style>