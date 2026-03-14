<template>
  <div class="recommend-box">
    <div 
      class="recommend-book-item"
      :class="{ 'book-recommend-active': activeIndex === index }"
      @mouseenter="activeIndex = index"
      @mousemouseleave="activeIndex = -1"
      v-for="(book, index) in recommendBooks" 
      :key="index"
      @click="gotoBookDetail(book.bookId)"
    >
      <img :src="book.coverImageUrl" alt="书籍封面" class="book-img">
      <div class="book-text">
        <span class="book-title">{{ book.title }}</span>
        <span class="book-hot" v-if="activeIndex !== index">热度：{{ book.bookViews }}</span>
        <!-- 额外信息：仅在active状态显示 -->
        <div class="book-details" v-if="activeIndex === index">
          <span class="book-author" @click="gotoAuthorDetail(book.authorId)" @click.stop>作者：{{ book.authorPenName }}</span>
          <div class="book-tags">
            <span class="tag">{{formatSerialStatus(book.serialStatus) }} </span>
            <span class="tag tag-delimiter">|</span>
            <span class="tag book-hot">热度：{{ book.bookViews }}</span>
            <span class="tag tag-delimiter">|</span>
            <span class="tag update-tag">最近更新：{{ formatTimestamp(book.publishDate) }} </span>
          </div>
          <p class="book-desc">{{ book.description }}</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';

  const router = useRouter();
  const props = defineProps({
      recommendBooks: {
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

  // 点击作者跳转到作者详情页
  const gotoAuthorDetail = (authorId) => {
    console.log('点击作者', authorId)
    router.push(`/author/${authorId}`)
  }

  // 当前激活的书籍索引
  const activeIndex = ref(0);

</script>

<style lang="scss" scoped>
.recommend-box {
    display: flex;
    width: 1200px;
    padding: 38px 0;
    gap: 28px; /* 替代margin-right，更适合flex布局 */
}

.recommend-book-item {
    display: flex;
    flex-direction: column;
    width: 150px;
    cursor: pointer;
    transition: all 0.5s ease;
    /* 增加容器高度，为active状态的详情预留空间 */
    min-height: 280px;
}

.book-img {
    width: 150px;
    height: 200px;
    object-fit: cover;
    transition: all 0.5s ease;
    border-radius: 10px;
    &:not(:valid) {
      background-color: #828282;
    }
}

/* Active状态样式 */
.book-recommend-active {
  display: flex;
  flex-direction: row;
  width: 736px;
  height: 302px;
  transform: translateY(0px);
}
.book-recommend-active .book-img {
  width: 180px;
  height: 240px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.book-recommend-active .book-text {
  /* 激活时增加文本区域高度，避免内容溢出 */
  min-height: 120px;
  margin-left: 16px;
  margin-top: 24px;
}
.book-recommend-active .book-title {
  font-size: 18px;
}

.book-text {
  display: flex;
  flex-direction: column;
  transition: min-height 0.5s ease;
  margin-top: 30px;
}

.book-title {
  width: 100%;
  height: 25px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-title:hover {
  color: #F9A825; /* 悬停时的颜色，与热度数值同色保持协调 */
  cursor: pointer; /* 鼠标变为手型，提示可点击 */
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
  margin-top: 9px;
}
.book-tags .book-hot {
  margin-top: 0;
}

/* 额外信息样式 */
.book-details {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease; /* 淡入动画 */
}

.book-author {
  height: 22px;
  line-height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #DADADA;
  text-align: left;
  font-style: normal;
  margin-top: 8px;
}

.book-tags {
  display: flex;
  margin-top: 8px;
}

.tag {
  height: 17px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #DB975A;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.tag-delimiter {
  padding: 0 24px;
}

.tag.update {
  background-color: #e8f4fd;
  color: #2c85c8;
}

.book-desc {
  width: 431px;
  height: 64px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #DADADA;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  /* 核心样式 */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制最多显示3行 */
  -webkit-box-orient: vertical;
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  margin-top: 48px;
}

/* 淡入动画 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .recommend-box {
   width: auto !important;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0 4px;
  }
  .recommend-book-item {
    width: 100%;
    min-height: 0;
    background: linear-gradient(180deg, rgba(30,30,30,0.98) 0%, rgba(22,22,22,0.98) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4);
  }
  .book-img {
    width: 100%;
    height: 210px;
    border-radius: 16px 16px 0 0;
  }
  .book-text {
    margin-top: 0;
    padding: 12px 12px 14px;
    gap: 6px;
  }
  .book-recommend-active {
    width: 100%;
    height: auto;
    flex-direction: column;
  }
  .book-recommend-active .book-img {
    width: 100%;
    height: 210px;
  }
  .book-recommend-active .book-text {
    margin-left: 0;
    margin-top: 0;
  }
  .book-details {
    display: none;
  }
  .book-hot {
    display: block;
    margin-top: 6px;
  }
  .book-desc {
    width: 100%;
    margin-top: 12px;
  }
  .book-tags {
    flex-wrap: wrap;
    gap: 6px;
  }
  .tag-delimiter {
    padding: 0 8px;
  }
  .book-title {
    font-size: 16px;
    line-height: 22px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .book-hot {
    font-size: 12px;
    color: #F9A825;
    margin-top: 2px;
  }
}
</style>
