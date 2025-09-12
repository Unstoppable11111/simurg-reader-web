<template>
  <div class="ranking-box">
    <!-- 大热榜 -->
    <div class="ranking-hot-section">
      <div class="ranking-hot-list">
        <span class="ranking-hot-title">大热榜</span>
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-hot-itme" 
          v-for="(book, index) in hotBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.imgUrl" :alt="book.title" class="book-cover">
          <img 
            :src="book.rankIcon" 
            :class="book.rankClass"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.category }}</span>
            <span class="book-hot">{{ book.hot }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新书榜 -->
    <div class="ranking-new-section">
      <div class="ranking-new-list">
        <span class="ranking-new-title">新书榜</span>
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-new-itme" 
          v-for="(book, index) in newBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.imgUrl" :alt="book.title" class="book-cover">
          <img 
            :src="book.rankIcon" 
            :class="book.rankClass"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.category }}</span>  
            <span class="book-hot">{{ book.hot }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 畅销榜 -->
    <div class="ranking-best-sellers-section">
      <div class="ranking-best-sellers-list">
        <span class="ranking-best-sellers-title">畅销榜</span>
        <!-- 使用v-for循环渲染列表项 -->
        <div 
          class="ranking-best-sellers-itme" 
          v-for="(book, index) in bestSellersBooks" 
          :key="index"
          @click="gotoBookDetail(book.bookId)"
        >
          <img :src="book.imgUrl" :alt="book.title" class="book-cover">
          <img 
            :src="book.rankIcon" 
            :class="book.rankClass"
          />
          <div class="book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-cate">{{ book.category }}</span>  
            <span class="book-hot">{{ book.hot }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const router = useRouter();
const props = defineProps({
    books: {
      type: Array,
      default: () => [],
      required: true
    }
})

// 点击书籍跳转到详情页
const gotoBookDetail = (bookId) => {
  console.log('点击了书籍，ID:', bookId)
  // 使用路由跳转到书籍详情页
  router.push(`/book/${bookId}`)
}

// 大热榜数据
const hotBooks = ref([
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/4.jpg",
    title: "快穿一时爽",
    category: "架空穿越",
    hot: "381.9万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/first.svg",
    rankClass: "first"
  },
  {
    bookId: 2,
    imgUrl: "http://www.tireba.com/simurg-reader/images/5.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/second.svg",
    rankClass: "second"
  },
  {
    bookId: 3,
    imgUrl: "http://www.tireba.com/simurg-reader/images/6.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/third.svg",
    rankClass: "third"
  },
  {
    bookId: 4,
    imgUrl: "http://www.tireba.com/simurg-reader/images/7.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/fore.svg",
    rankClass: "fore"
  },
  {
    bookId: 5,
    imgUrl: "http://www.tireba.com/simurg-reader/images/8.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/five.svg",
    rankClass: "five"
  }
]);

// 新书榜数据
const newBooks = ref([
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/4.jpg",
    title: "快穿一时爽",
    category: "架空穿越",
    hot: "381.9万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/first.svg",
    rankClass: "first"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/5.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/second.svg",
    rankClass: "second"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/6.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/third.svg",
    rankClass: "third"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/7.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/fore.svg",
    rankClass: "fore"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/8.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/five.svg",
    rankClass: "five"
  }
]);
const bestSellersBooks = ref([
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/4.jpg",
    title: "快穿一时爽",
    category: "架空穿越",
    hot: "381.9万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/first.svg",
    rankClass: "first"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/5.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/second.svg",
    rankClass: "second"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/6.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/third.svg",
    rankClass: "third"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/7.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/fore.svg",
    rankClass: "fore"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/8.jpg",
    title: "太好了，是狗腿子，我们有救了",
    category: "修仙",
    hot: "362.7万热度",
    rankIcon: "http://www.tireba.com/simurg-reader/images/five.svg",
    rankClass: "five"
  }
]);
</script>

<style lang="scss" scoped>
  .ranking-box {
    display: flex;
    margin-top: 38px;
  }
  .ranking-hot-title, 
  .ranking-new-title, 
  .ranking-best-sellers-title {
    height: 40px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: left;
    font-style: normal;
  }
  .ranking-hot-itme, 
  .ranking-new-itme, 
  .ranking-best-sellers-itme {
    display: flex;
    width: 445px;
    height: 96px;
    margin-top: 14px;
    margin-bottom: 18px;
  }

  .ranking-hot-itme img, 
  .ranking-new-itme img, 
  .ranking-best-sellers-itme img {
    width: 72px;
    height: 96px;
  }
  .book-info {
    display: flex;
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
    height: 29px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 21px;
    color: #FFFFFF;
    line-height: 29px;
    text-align: left;
    font-style: normal;
    /* 单行超出省略号核心样式 */
    white-space: nowrap;    // 强制文本在一行显示
    overflow: hidden;       // 隐藏超出容器的内容
    text-overflow: ellipsis; // 超出部分显示省略号
    max-width: 300px;
  }
  .book-title:hover {
    color: #ED5B00; /* 悬停时的颜色，与热度数值同色保持协调 */
    cursor: pointer; /* 鼠标变为手型，提示可点击 */
    }
  .book-cate {
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #DADADA;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .book-hot {
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #DB975A;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-top: 19px;
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
