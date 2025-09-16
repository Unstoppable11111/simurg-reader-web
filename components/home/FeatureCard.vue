<template>
  <div class="feature-card-carousel">

    <!-- 左箭头 -->
    <button 
      class="carousel-arrow left-arrow" 
      @click="moveLeft" 
      aria-label="上一页"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="view-port">
      <div class="feature-card-track">
        <div
          class="feature-card"
          v-for="(book, idx) in books"
          :key="book.id"
          :class="{ 
          'first-part': idx === 0,
          'active-part': idx === activeIndex
          }"
          @click="gotoBookDetail(book.id)"
          :style="getItemStyles(idx)"
        >
          <img :src="book.picUrl" :alt="book.title" class="book-img" />
          <div class="book-title">{{ book.title }}</div>
          <div class="book-cate">{{ book.bookCate }}</div>
        </div>
      </div>
    </div>

    <!-- 右箭头 -->
    <button 
      class="carousel-arrow right-arrow" 
      @click="moveRight" 
      aria-label="下一页"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L16 12L9 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
  const props = defineProps({
    books: {
      type: Array,
      default: () => [],
      required: true
    }
  })

  const router = useRouter()

  // 跟踪当前active-part的索引，初始值为2（第三个元素）
  const activeIndex = ref(3)
  // 定义.first-part的样式状态
  const firstPartStyles = ref({
    marginLeft: '-117px',
    // 可以添加其他初始样式
    transition: 'margin-left 0.5s ease-in-out' // 添加过渡动画属性
  })
  // 激活元素的样式（带过渡）
  const activePartStyle = {
    // 基础过渡动画
    width: '234px',
    height: '396px',
    transition: 'all 0.5s ease-in-out',
    // 激活状态样式
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  }

  // 根据索引获取元素样式
  const getItemStyles = (idx) => {
    // 第一个元素的样式
    if (idx === 0) {
      return { ...firstPartStyles.value };
    }
    // 激活元素的样式
    else if (idx === activeIndex.value) {
      return { ...activePartStyle };
    }
    // 其他元素的默认样式
    else {
      return { ...{} };
    }
  }

  // 点击书籍跳转到详情页
  const gotoBookDetail = async (bookId) => {
      router.push(`/book/${bookId}`)
  }


  // 点击左箭头时调整样式
  const moveLeft = () => {
    activeIndex.value--
    console.log('向右移动')
    // 每次点击左箭头，增加margin-left值（示例：每次增加50px）
    const currentMargin = parseInt(firstPartStyles.value.marginLeft)
    console.log('当前margin-left:', currentMargin)
    firstPartStyles.value.marginLeft = currentMargin + 224 + 'px'
    console.log('更新后margin-left:', firstPartStyles.value.marginLeft)
  }

  const moveRight = () => {
    activeIndex.value++
    console.log('向右移动')
    // 每次点击左箭头，增加margin-left值（示例：每次增加50px）
    const currentMargin = parseInt(firstPartStyles.value.marginLeft)
    console.log('当前margin-left:', currentMargin)
    firstPartStyles.value.marginLeft = currentMargin - 224 + 'px'
    console.log('更新后margin-left:', firstPartStyles.value.marginLeft)
    
    // 可以同时调整其他样式
  }
    
</script>

<style lang="scss" scoped>
  $card-width: 192px;
  $card-height: 396px;
  $card-gap: 32px;
  $card-part: calc($card-width / 3);

  .feature-card-carousel {
    // width: calc($card-width * 5 + $card-gap * 6 + $card-part * 2); // 5张完整卡片+6个间距+两侧各三分之一
    width: 1360px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
  }

  // 可视区域 - 固定宽度1360px，超出部分隐藏
  .view-port {
    width: 1360px;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 38px;
  }

  // 书籍轨道
  .feature-card-track {
    display: flex;
    will-change: transform; // 性能优化
  }

  .feature-card-track {
    display: flex;
    transition: transform 0.4s;
  }

  .feature-card {
    width: $card-width;
    height: $card-height;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin-right: $card-gap;
    position: relative;
  }

  .feature-card .book-img {
    margin-top: 28px;
  }

  .active-part .book-img{
    margin-top: 0;
  }

  .first-part {
    margin-left: -117px;
    z-index: 1;
  }

  .last-part {
    z-index: 1;
  }

  .active-part .book-img{
    width: 234px;
    height: 396px;
    z-index: 3;
  }

  .book-img {
    width: 192px;
    height: 256px;
    object-fit: cover;
    margin: 0;
  }

  .book-title {
    width: 198px;
    height: 62px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 22px;
    color: #FFFFFF;
    line-height: 30px;
    text-align: left;
    font-style: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 28px;
  }
   // 鼠标悬停时的颜色变化
  .book-title:hover {
    color: #ED5B00; /* 悬停时的颜色，与热度数值同色保持协调 */
    cursor: pointer; /* 鼠标变为手型，提示可点击 */
  }

  .book-cate {
    width: 64px;
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #A2A0A0;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  // 箭头样式 - 确保能点击到
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    border: none;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    padding: 0; // 去除默认按钮内边距
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%) scale(1.05);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background-color: rgba(0, 0, 0, 0.4);
      transform: translateY(-50%); // 禁用状态不缩放
    }
    
    // 确保箭头图标可点击
    svg {
      pointer-events: none;
    }
  }

  .left-arrow {
    left: 20px; // 调整位置确保可见且可点击
  }

  .right-arrow {
    right: 20px; // 调整位置确保可见且可点击
  }
</style>