<template>
  <div class="banner-carousel">
    <!-- 加载状态（仅在使用真实接口且未加载完成时显示） -->
    <div v-if="isLoading && !useDefaultData" class="loading-state">
      <div class="spinner"></div>
    </div>

    <!-- 轮播图主体（始终展示，优先用接口数据，失败/未就绪则用默认数据） -->
    <div 
      v-if="displayBanners.length > 0"
      class="swiper" 
      :style="{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }"
    >
      <div class="swiper-wrapper">
        <div 
          class="swiper-slide" 
          v-for="(item, index) in displayBanners" 
          :key="item.id || index"
          @click="handleSlideClick(item)"
        >
          <div class="banner-image-container">
            <img 
              :src="item.imageUrl" 
              :alt="item.altText || '轮播图'" 
              class="banner-image"
              @error="handleImageError(item)"
            >
          </div>
          
          <!-- 轮播图文字内容（可选） -->
          <!-- <div v-if="item.caption" class="slide-caption">
            <h3>{{ item.caption.title }}</h3>
            <p>{{ item.caption.description }}</p>
          </div> -->
        </div>
      </div>
      
      <!-- 轮播控制 -->
      <div class="swiper-pagination custom-pagination"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

// 组件属性
const props = defineProps({
  // 轮播图尺寸
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: Number,
    default: 500
  },
  // 接口地址
  apiUrl: {
    type: String,
    default: '/api/banners'
  },
  // 强制使用默认数据（后端未开发时用）
  forceDefault: {
    type: Boolean,
    default: false
  },
  // 轮播配置
  carouselOptions: {
    type: Object,
    default: () => ({
      loop: true,
      autoplay: { delay: 3000 },
      speed: 500
    })
  }
})

// 状态管理
const banners = ref([])                  // 接口返回的数据
const isLoading = ref(false)             // 加载状态
const hasError = ref(false)              // 错误状态
const swiperInstance = ref(null)         // Swiper实例

// 默认备用数据（核心：请求失败或后端未就绪时展示）
const defaultBanners = ref([
  {
    id: 'default-1',
    imageUrl: 'http://www.tireba.com/simurg-reader/images/banner1.png',
    altText: '默认推荐书籍',
    link: '/books/recommendation',
    caption: {
      title: '精选图书推荐',
      description: '探索本周最受欢迎的读物'
    }
  },
  {
    id: 'default-2',
    imageUrl: 'http://www.tireba.com/simurg-reader/images/banner2.png',
    altText: '新书上架',
    link: '/books/new-arrivals',
    caption: {
      title: '新书上架',
      description: '最新出版的热门书籍'
    }
  },
  {
    id: 'default-3',
    imageUrl: 'http://www.tireba.com/simurg-reader/images/banner3.png',
    altText: '阅读活动',
    link: '/events',
    caption: {
      title: '夏季阅读挑战',
      description: '参与活动赢取精美礼品'
    }
  },
  {
    id: 'default-4',
    imageUrl: 'http://www.tireba.com/simurg-reader/images/banner4.png',
    altText: '作者专区',
    link: '/events',
    caption: {
      title: '夏季阅读挑战',
      description: '参与活动赢取精美礼品'
    }
  }
])

// 决定最终展示的数据（优先用接口数据，失败则用默认数据）
const displayBanners = computed(() => {
  // 强制使用默认数据，或接口数据为空且有错误时，展示默认数据
  if (props.forceDefault || (banners.value.length === 0 && hasError.value)) {
    return defaultBanners.value
  }
  // 否则展示接口数据（可能为空，但会被v-if处理）
  return banners.value
})

// 从接口获取数据
const fetchBannerData = async () => {
  // 如果强制使用默认数据，不发起请求
  if (props.forceDefault) return

  isLoading.value = true
  hasError.value = false
  
  try {
    const response = await fetch(props.apiUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    // 假设接口返回格式为 { code: 200, data: [...] }
    if (result.code === 200 && Array.isArray(result.data)) {
      banners.value = result.data
    } else {
      throw new Error('接口返回格式不正确')
    }
  } catch (error) {
    console.error('轮播图数据请求失败:', error)
    hasError.value = true  // 标记错误，触发默认数据展示
  } finally {
    isLoading.value = false
    initSwiper()  // 无论成功失败，都初始化轮播
  }
}

// 初始化轮播
const initSwiper = () => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy()
  }
  
  // 确保DOM已更新
  setTimeout(() => {
    if (document.querySelector('.swiper')) {
      swiperInstance.value = new Swiper('.swiper', {
        ...props.carouselOptions,
        pagination: {
          el: '.swiper-pagination.custom-pagination',
          clickable: true
        },
        navigation: {
        }
      })
    }
  }, 0)
}

// 处理轮播图点击
const handleSlideClick = (item) => {
  if (item.link) {
    // 可以使用Nuxt的导航方法
    navigateTo(item.link, {
      target: item.newTab ? '_blank' : '_self'
    })
  }
}

// 处理图片加载失败
const handleImageError = (item) => {
  // 图片加载失败时，替换为默认图片
  item.imageUrl = 'https://picsum.photos/1920/500?random=fallback'
}

// 组件挂载时执行
onMounted(() => {
  // 如果不强制使用默认数据，就尝试请求接口
  if (!props.forceDefault) {
    fetchBannerData()
  } else {
    // 直接使用默认数据初始化轮播
    initSwiper()
  }
})
</script>

<style scoped>
.banner-carousel {
  position: relative;
  /* width: 1920px; */
  overflow: hidden;
}
.swiper {
  /* width: 1920px !important; */
}

/* 加载状态样式 */
.loading-state {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 轮播图样式 */
.swiper {
  margin: 0 auto;
}

.swiper-slide {
  position: relative;
  width: 100%;
  height: 100%;
}
/* 图片容器 - 控制裁剪区域 */
.banner-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
/* 核心：图片自适应处理 */
.banner-image {
  width: 100%;
  height: 100%;
  /* 保持图片比例并覆盖容器，裁剪多余部分 */
  object-fit: cover;
  /* 可选：图片居中显示（确保主体内容不被裁剪） */
  object-position: center;
}
.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

/* 轮播文字内容 */
.slide-caption {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  padding: 0 20px;
}

.slide-caption h3 {
  font-size: 28px;
  margin-bottom: 10px;
}

.slide-caption p {
  font-size: 16px;
  max-width: 600px;
}

/* 轮播控制按钮样式 */
.swiper-button-prev,
.swiper-button-next {
  color: white;
  background-color: rgba(0,0,0,0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(0,0,0,0.5);
}

.swiper-pagination-bullet {
  background: rgba(255,255,255,0.7);
  width: 10px;
  height: 10px;
  margin: 0 5px;
}

.swiper-pagination-bullet-active {
  background: white;
  width: 30px;
  border-radius: 5px;
}
/* 分页容器（控制位置） */
:deep(.swiper-pagination) {
  /* 定位在轮播图底部，距离底部20px */
  bottom: 20px !important;
  /* 水平居中（默认） */
  left: 0 !important;
  right: 0 !important;
  text-align: center;
}

/* 普通分页点样式 */
:deep(.swiper-pagination-bullet) {
  /* 点的大小 */
  width: 18px !important;
  height: 2px !important;
  /* 点的形状 */
  border-radius: 2px !important;
  /* 未激活时的颜色（半透明白色） */
  background: rgba(188,188,188,0.6) !important;
  /* 点之间的间距 */
  margin: 0 6px !important;
  /* 过渡动画（切换时更平滑） */
  transition: all 0.3s ease !important;
  /* 去掉默认阴影 */
  box-shadow: none !important;
}
/* 激活状态的分页点样式 */
:deep(.swiper-pagination-bullet-active) {
  /* 激活时的大小（更大） */
  width: 18px !important;
  height: 2px !important;
  /* 激活时的形状 */
  border-radius: 4px !important;
  /* 激活时的颜色（纯白色） */
  background: #F96E08 !important;
  /* 可选：添加轻微缩放效果 */
  transform: scale(1.05);
}
</style>
    