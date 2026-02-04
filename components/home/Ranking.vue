<template>
  <div class="ranking-box">
    <!-- 大热榜 -->
    <div class="ranking-hot-section" v-if="hotBooks.length > 0">
      <div class="ranking-hot-list">
        <div>
          <SvgIcon name="ranking-icon-left" class="ranking-icon-left" />
          <span class="ranking-hot-title">大热榜</span>
          <SvgIcon name="ranking-icon-right" class="ranking-icon-right" />
        </div>
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-hot-itme" 
          v-for="(book, index) in hotBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.coverImageUrl" :alt="book.title" class="book-cover">
          <img 
            :src="getRankIcon(index)" 
            :class="getRankClass(index)"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.bookCategoryResponseList && book.bookCategoryResponseList.length > 0 
              ? book.bookCategoryResponseList[0].categoryName 
              : ''  }}</span>
            <span class="book-hot">{{ book.bookViews }} 热度</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新书榜 -->
    <div class="ranking-new-section" v-if="newBooks.length > 0">
      <div class="ranking-new-list">
        <SvgIcon name="ranking-icon-left" class="ranking-icon-left" />
        <span class="ranking-new-title">新书榜</span>
        <SvgIcon name="ranking-icon-right" class="ranking-icon-right" />
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-new-itme" 
          v-for="(book, index) in newBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.coverImageUrl" :alt="book.title" class="book-cover">
          <img 
            :src="getRankIcon(index)" 
            :class="getRankClass(index)"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.bookCategoryResponseList && book.bookCategoryResponseList.length > 0 
              ? book.bookCategoryResponseList[0].categoryName 
              : ''  }}</span>  
            <span class="book-hot">{{ book.bookViews }} 热度</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 畅销榜 -->
    <div class="ranking-best-sellers-section" v-if="bestSellersBooks.length > 0">
      <div class="ranking-best-sellers-list">
        <SvgIcon name="ranking-icon-left" class="ranking-icon-left" />
        <span class="ranking-best-sellers-title">完结榜</span>
        <SvgIcon name="ranking-icon-right" class="ranking-icon-right" />
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-best-sellers-itme" 
          v-for="(book, index) in bestSellersBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.coverImageUrl" :alt="book.title" class="book-cover">
          <img 
            :src="getRankIcon(index)" 
            :class="getRankClass(index)"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.bookCategoryResponseList && book.bookCategoryResponseList.length > 0 
              ? book.bookCategoryResponseList[0].categoryName 
              : ''  }}</span>  
            <span class="book-hot">{{ book.bookViews }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_ENDPOINTS, apiRequest } from '@/utils/api'
import SvgIcon from '@/components/SvgIcon.vue';
const router = useRouter();
const props = defineProps({
    apiUrl: {
    type: String,
    default: API_ENDPOINTS.RANKING_BOOKS
    },
})

// 定义排名图标和类名
const RANK_ICONS = {
  first: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FFECB3" /><stop offset="100%" style="stop-color:%23FFD700" /></linearGradient></defs><path fill="url(%23g1)" d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>`,
  
  second: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FFFFFF" /><stop offset="100%" style="stop-color:%23BDBDBD" /></linearGradient></defs><path fill="url(%23g2)" d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>`,
  
  third: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FFAB91" /><stop offset="100%" style="stop-color:%23FF5722" /></linearGradient></defs><path fill="url(%23g3)" d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>`,
  
  fore: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="12" y="18" font-family="Verdana" font-size="16" fill="%23888888" text-anchor="middle" font-weight="bold">4</text></svg>`,
  
  five: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="12" y="18" font-family="Verdana" font-size="16" fill="%23888888" text-anchor="middle" font-weight="bold">5</text></svg>`
};

const RANK_CLASSES = ['first', 'second', 'third', 'fore', 'five'];

// 根据索引获取排名图标
const getRankIcon = (index) => {
  const rankClass = RANK_CLASSES[index] || 'five';
  return RANK_ICONS[rankClass];
};

// 根据索引获取排名类名
const getRankClass = (index) => {
  return RANK_CLASSES[index] || 'five';
};

// 点击书籍跳转到详情页
const gotoBookDetail = (bookId) => {
  console.log('点击了书籍，ID:', bookId)
  // 使用路由跳转到书籍详情页
  router.push(`/book/${bookId}`)
}

const fetchRankingData = async () => {
  // 热门榜
  try {
    const hotRankingData = {
      rankingType: 1,
      rankingSize: 5
    };

    const response = await apiRequest(props.apiUrl, {
      method: 'POST',
      body: JSON.stringify(hotRankingData)
    });
    const result = response;
    console.log('热门榜数据:', result);
    if (result.code === 200 && result.data) {
      hotBooks.value = result.data || [];
    }
  } catch (error) {
  }

  // 新书榜
  try {
    const newBookRankingData = {
      rankingType: 5,
      rankingSize: 5
    };

    const response = await apiRequest(props.apiUrl, {
      method: 'POST',
      body: JSON.stringify(newBookRankingData)
    });
    const result = response;
    console.log('新书榜数据:', result);
    if (result.code === 200 && result.data) {
      newBooks.value = result.data || [];
    }
  } catch (error) {
  }

  // 完结榜
  try {
    const bestsellerRankingData = {
      rankingType: 4,
      rankingSize: 5
    };

    const response = await apiRequest(props.apiUrl, {
      method: 'POST',
      body: JSON.stringify(bestsellerRankingData)
    });
    const result = response;
    console.log('完结榜数据:', result);
    if (result.code === 200 && result.data) {
      bestSellersBooks.value = result.data || [];
    }
  } catch (error) {
  }
};

// 大热榜数据
const hotBooks = ref([]);
// 新书榜数据
const newBooks = ref([]);
// 畅销榜数据
const bestSellersBooks = ref([]);


// 组件挂载时获取数据
onMounted(() => {
  fetchRankingData();
});
</script>

<style lang="scss" scoped>
  .ranking-box {
    display: flex;
  }
  .ranking-hot-section, 
  .ranking-new-section, 
  .ranking-best-sellers-section { 
    width: 400px;
    height: 633px;
  }
  .ranking-hot-title, 
  .ranking-new-title, 
  .ranking-best-sellers-title {
    height: 40px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: left;
    font-style: normal;
  }
  .ranking-icon-left, .ranking-icon-right {
    width: 34px;
    height: 34px;
  }

  .ranking-hot-itme, 
  .ranking-new-itme, 
  .ranking-best-sellers-itme {
    display: flex;
    width: 400px;
    height: 96px;
    margin-top: 14px;
    margin-bottom: 18px;
  }

  .ranking-hot-itme img, 
  .ranking-new-itme img, 
  .ranking-best-sellers-itme img {
    width: 72px;
    height: 96px;
    border-radius: 4px
  }
  .book-info {
    display: flex;
    width: 290px;
    height: 96px;
    flex-direction: column;
    margin-left: 8px;
  }
  .ranking-hot-itme .first, 
  .ranking-hot-itme .second, 
  .ranking-hot-itme .third, 
  .ranking-hot-itme .fore, 
  .ranking-hot-itme .five,
  .ranking-new-itme .first,
  .ranking-new-itme .second,
  .ranking-new-itme .third,
  .ranking-new-itme .fore,
  .ranking-new-itme .five,
  .ranking-best-sellers-itme .first,
  .ranking-best-sellers-itme .second,
  .ranking-best-sellers-itme .third,
  .ranking-best-sellers-itme .fore,
  .ranking-best-sellers-itme .five {
    width: 22px;
    height: 33px;
    margin-left: 8px;
  }
  .book-title {
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    /* 单行超出省略号核心样式 */
    white-space: nowrap;    // 强制文本在一行显示
    overflow: hidden;       // 隐藏超出容器的内容
    text-overflow: ellipsis; // 超出部分显示省略号
    max-width: 300px;
  }
  .book-title:hover {
    color: #F9A825; /* 悬停时的颜色，与热度数值同色保持协调 */
    cursor: pointer; /* 鼠标变为手型，提示可点击 */
    }
  .book-cate {
    height: 17px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #DADADA;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .book-hot {
    height: 17px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #DB975A;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 36px;
  }

    // 书籍图片样式及动画
  .book-cover {
    width: 72px;
    height: 96px;
    // 添加过渡动画：所有属性变化在0.3秒内完成，动画曲线为ease
    transition: all 0.3s ease;
    // 初始阴影（轻微，增强质感）
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    // 防止缩放时内容溢出
    transform-origin: center;
    &:not(:valid) {
      background-color: #828282;
    }
  }

  // 鼠标悬停时的动画效果
  .book-cover:hover {
    // 轻微放大（1.05倍）
    transform: scale(1.05);
    // 加深阴影，增强立体感
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    // 可选：添加亮度调整
    filter: brightness(1.05);
  }
</style>