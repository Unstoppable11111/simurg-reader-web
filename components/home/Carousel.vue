<template>
  <div class="banner-carousel">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state skeleton-shimmer">
      <div class="motion-spinner"></div>
    </div>

    <!-- 轮播图主体 -->
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
          :data-index="index"
        >
          <NuxtLink class="banner-image-container" :to="`/book/${item.id}`">
            <img 
              :src="item.imageUrl" 
              :alt="item.bannerTitle || '轮播图'" 
              class="banner-image"
              @error="handleImageError(item)"
              loading="lazy"
            />
          </NuxtLink>
          <div v-if="item.caption" class="slide-caption">
            <h3>{{ item.caption.title }}</h3>
            <p>{{ item.caption.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 轮播控制 -->
      <div class="swiper-pagination custom-pagination"></div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, onUnmounted } from 'vue'
  // 性能优化：按需导入 Swiper 核心 + 所需模块（替代全量 bundle 约减少 100KB）
  import Swiper from 'swiper'
  import { Pagination, Autoplay } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/pagination'
  import { API_ENDPOINTS, apiRequest } from '@/utils/api'
  // 关键：导入Nuxt路由跳转函数
  import { navigateTo } from 'nuxt/app'

  const route = useRoute();

  // 监听路由变化，当路径变为首页时重新获取数据
  // watch(
  //   () => route.path,
  //   (newPath) => {
  //     if (newPath === '/') {
  //       if (!props.forceDefault) {
  //         fetchBannerData()
  //       }
  //     }
  //   }
  // )

  // 组件属性（完全保留原有逻辑）
  const props = defineProps({
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: Number,
      default: 500
    },
    apiUrl: {
      type: String,
      default: API_ENDPOINTS.BANNERS
    },
    forceDefault: {
      type: Boolean,
      default: false
    },
    carouselOptions: {
      type: Object,
      default: () => ({
        loop: true,
        autoplay: { delay: 5000 },
        speed: 500,
        slidesPerView: 1,
        slidesPerGroup: 1
      })
    }
  })

  // 状态管理（完全保留原有逻辑）
  const banners = ref([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const swiperInstance = ref(null)

  // 默认备用数据（完全保留原有逻辑，确保跳转路径正确）
  const defaultBanners = ref([
    {
      id: 'default-1',
      imageUrl: 'http://www.tireba.com/simurg-reader/images/banner1.png',
      altText: '默认推荐书籍',
      redirectUrl: 'http://localhost:3000/book/1'
    },
    {
      id: 'default-2',
      imageUrl: 'http://www.tireba.com/simurg-reader/images/banner2.png',
      altText: '新书上架',
      redirectUrl: 'http://localhost:3000/book/2'
    }
  ])

  // 决定最终展示的数据（完全保留原有逻辑）
  const displayBanners = computed(() => {
    if (props.forceDefault || (banners.value.length === 0 && hasError.value)) {
      return defaultBanners.value
    }
    return banners.value
  })

  // 获取轮播图数据（完全保留原有逻辑）
  const fetchBannerData = async () => {
    if (props.forceDefault) return

    isLoading.value = true
    hasError.value = false
    
    try {
      // apiRequest 内部已完成 response.json()，返回的直接是业务数据对象
      const result = await apiRequest(props.apiUrl)
      
      if (result.code === 200 && Array.isArray(result.data)) {
        banners.value = result.data
      } else {
        throw new Error('接口返回格式不正确')
      }
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
      initSwiper()
    }
  }

  // 初始化轮播（完全保留原有逻辑）
  const initSwiper = () => {
    if (swiperInstance.value) {
      swiperInstance.value.destroy()
    }
    
    setTimeout(() => {
      if (document.querySelector('.swiper')) {
        swiperInstance.value = new Swiper('.swiper', {
          modules: [Pagination, Autoplay],
          ...props.carouselOptions,
          pagination: {
            el: '.swiper-pagination.custom-pagination',
            clickable: true
          },
          loop: displayBanners.value.length > 1,
          slidesPerView: 1,
          slidesPerGroup: 1,
          loopAdditionalSlides: 1
        })
      }
    }, 0)
  }

  // 处理图片加载失败（完全保留原有逻辑）
  const handleImageError = (item) => {
    if (!item.imageUrl || item.imageUrl.includes('picsum.photos')) {
      item.imageUrl = 'https://picsum.photos/1920/500?random=fallback'
    }
  }

  // 新增：全局点击事件处理（核心修复，不影响原有样式/逻辑）
  const handleGlobalBannerClick = (e) => {
    // 1. 找到点击的轮播图容器（向上查找swiper-slide）
    const slideEl = e.target.closest('.swiper-slide')
    if (!slideEl) return // 没点到轮播项，直接返回

    // 2. 获取当前点击轮播项的索引
    const slideIndex = slideEl.getAttribute('data-index')
    if (slideIndex === null || !displayBanners.value[slideIndex]) {
      console.warn('未找到对应轮播数据')
      return
    }

    // 3. 拿到对应轮播数据，执行跳转
    const targetBanner = displayBanners.value[slideIndex]
    console.log('点击轮播图：', targetBanner) // 此时会打印日志
    if (!targetBanner.redirectUrl) return

    // 4. 处理跳转路径（兼容原有localhost格式）
    let jumpPath = targetBanner.redirectUrl
    if (jumpPath.startsWith('http://localhost:3000')) {
      jumpPath = jumpPath.replace('http://localhost:3000', '')
    }

    // 5. 跳转到目标页面（/pages/book/[id].vue）
    if (jumpPath.startsWith('/')) {
      navigateTo(jumpPath).catch(err => {
        console.error('轮播跳转失败：', err)
      })
    } else {
      window.location.href = jumpPath
    }
  }

  // 组件挂载（新增全局事件绑定，其他逻辑不变）
  onMounted(() => {
    if (!props.forceDefault) {
      fetchBannerData()
    } else {
      initSwiper()
    }
    // 绑定全局点击事件（捕获阶段，避免被拦截）
    document.addEventListener('click', handleGlobalBannerClick, true)
  })

  // 组件卸载（新增全局事件移除，避免内存泄漏）
  onUnmounted(() => {
    if (swiperInstance.value) {
      swiperInstance.value.destroy()
    }
    document.removeEventListener('click', handleGlobalBannerClick, true)
  })
</script>

<style scoped>
/* 100% 保留你原有的所有样式，未做任何修改 */
.banner-carousel {
  position: relative;
  overflow: hidden;
}

/* 加载状态样式 */
.loading-state {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-surface-1, #17181c);
  border-radius: var(--radius-lg, 12px);
}

/* 轮播图样式 */
.swiper {
  margin: 0 auto;
  cursor: pointer;
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
}

.swiper-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 图片容器 */
.banner-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: block;
}

/* 核心：图片自适应处理与平滑微动效 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
  transition: transform var(--duration-large, 450ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
}

.banner-image-container:hover .banner-image {
  transform: scale(1.02);
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

/* 分页容器 */
:deep(.swiper-pagination) {
  bottom: 20px !important;
  left: 0 !important;
  right: 0 !important;
  text-align: center;
}

/* 普通分页点样式 */
:deep(.swiper-pagination-bullet) {
  width: 18px !important;
  height: 2px !important;
  border-radius: 2px !important;
  background: rgba(188,188,188,0.6) !important;
  margin: 0 6px !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
}

/* 激活状态的分页点样式 */
:deep(.swiper-pagination-bullet-active) {
  width: 18px !important;
  height: 2px !important;
  border-radius: 4px !important;
  background: #F96E08 !important;
  transform: scale(1.05);
}
</style>