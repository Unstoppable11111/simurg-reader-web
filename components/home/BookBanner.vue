<template>
  <div class="block text-center">
    <el-carousel height="420px" class="custom-carousel">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <!-- <h3 class="small justify-center" text="2xl">{{ item }}</h3> -->
        <img :src="item.imageUrl" :alt="item.bannerTitle" @click="handleClick(item)" class="banner-img">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
  const router = useRouter()
  const props = defineProps({
    banners: {
      type: Array,
      default: () => [],
      required: true
    }
  })
  const handleClick = (banner) => { 
    console.log("点击轮播图：", banner);
    router.push(`/book/${banner.redirectUrl}`)
  }
</script>

<style scoped>
.custom-carousel {
  /* 修改指示器激活状态的颜色 */
  --el-carousel-indicator-active-color: #ff9b51;
  /* 修改指示器默认状态的颜色 */
  --el-carousel-indicator-inactive-color: #ffffff;
  /* 修改指示器宽度 */
  --el-carousel-indicator-width: 20px;
  /* 修改指示器高度 */
  --el-carousel-indicator-height: 2px;
}
/* 或者使用深度选择器确保样式生效 */
::v-deep(.custom-carousel .el-carousel__indicator button) {
  background-color: rgba(188,188,188,0.6);
  opacity: 0.5;
  width: 20px;
  height: 2px;
}

::v-deep(.custom-carousel .el-carousel__indicator.is-active button) {
  background-color: #ff9b51;
  opacity: 1;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .custom-carousel {
    height: 220px !important;
  }
  :deep(.custom-carousel .el-carousel__container) {
    height: 220px !important;
  }
}
</style>
