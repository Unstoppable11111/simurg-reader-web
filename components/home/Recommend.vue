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
                    <span class="book-author">作者：{{ book.authorPenName }}</span>
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

// 当前激活的书籍索引
const activeIndex = ref(0);

</script>

<style lang="scss" scoped>
.recommend-box {
    display: flex;
    width: 1200;
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
}

/* Active状态样式 */
.book-recommend-active {
  display: flex;
  flex-direction: row;
  width: 736px;
  height: 302px;
  transform: translateY(-5px);
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
}
.book-recommend-active .book-title {
  font-size: 18px;
}

.book-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  transition: min-height 0.5s ease;
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
  color: #ED5B00; /* 悬停时的颜色，与热度数值同色保持协调 */
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
}

/* 额外信息样式 */
.book-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
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
}

.book-tags {
  display: flex;
  gap: 6px;
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
  -webkit-line-clamp: 3; /* 最多显示3行 */
  -webkit-box-orient: vertical;
}

/* 淡入动画 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
