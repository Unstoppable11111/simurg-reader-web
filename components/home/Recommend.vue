<template>
    <div class="recommend-box">
        <div 
            class="recommend-book-item"
            :class="{ 'book-recommend-active': activeIndex === index }"
            @mouseenter="activeIndex = index"
            @mousemouseleave="activeIndex = -1"
            v-for="(book, index) in books" 
            :key="index"
            @click="gotoBookDetail(book.bookId)"
        >
            <img :src="book.imgUrl" alt="书籍封面" class="book-img">
            <div class="book-text">
                <span class="book-title">{{ book.title }}</span>
                <span class="book-hot">{{ book.hot }}人气</span>
                
                <!-- 额外信息：仅在active状态显示 -->
                <div class="book-details" v-if="activeIndex === index">
                    <span class="book-author">作者：{{ book.author }}</span>
                    <div class="book-tags">
                        <span class="tag">{{ book.status }}</span>
                        <span class="tag update-tag">最近更新：{{ book.updateTime }}</span>
                    </div>
                    <p class="book-desc">{{ book.description }}</p>
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

// 当前激活的书籍索引
const activeIndex = ref(0);

// 书籍数据（包含额外信息）
const books = ref([
    {
      bookId: 1,
      imgUrl: "http://www.tireba.com/simurg-reader/images/1.jpg",
      title: "穿书荒年，我靠修仙无敌了",
      hot: "249.5万",
      author: "南山有竹",
      status: "连载中",
      updateTime: "2023-10-01",
      description: "现代修仙者意外穿到饥荒年代，左手空间右手灵泉，带领            携全家逆袭求生，却不料开启了惊天秘密..."
    },
    {
      bookId: 2,
      imgUrl: "http://www.tireba.com/simurg-reader/images/2.jpg",
      title: "末世重生：我的植物变异了",
      hot: "186.3万",
      author: "风雨欲来",
      status: "完结",
      updateTime: "2023-09-28",
      description: "末世三年，他被最信任的人背叛，意外重生回末世前夜。 这一次，他要守护好家人，让那些变异植物成为最强武器..."
    },
    {
      bookId: 3,
      imgUrl: "http://www.tireba.com/simurg-reader/images/3.jpg",
      title: "全球高武：我能看到隐藏信息",
      hot: "312.7万",
      author: "执笔问长生",
      status: "连载中",
      updateTime: "2023-10-02",
      description: "全球武道复苏，林辰意外获得看破万物信息的能力。 别人修炼靠苦修，他靠看破弱点，一路逆袭成为武道至尊..."
    },
    {
      bookId: 4,
      imgUrl: "http://www.tireba.com/simurg-reader/images/4.jpg",
      title: "农家小福女：带着空间闯古代",
      hot: "278.9万",
      author: "月下独酌",
      status: "连载中",
      updateTime: "2023-09-30",
      description: "现代美食博主穿越成古代农家女，附赠万能空间。 带领家人发家致富，却被某个权势滔天的王爷缠上..."
    }
]);
</script>

<style lang="scss" scoped>
.recommend-box {
    display: flex;
    width: 1360px;
    padding: 20px 0;
    gap: 58px; /* 替代margin-right，更适合flex布局 */
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
  width: 210px;
  height: 280px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.book-recommend-active .book-text {
  /* 激活时增加文本区域高度，避免内容溢出 */
  min-height: 120px;
  margin-left: 16px;
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
  height: 29px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 21px;
  color: #FFFFFF;
  line-height: 29px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-title:hover {
  color: #ED5B00; /* 悬停时的颜色，与热度数值同色保持协调 */
  cursor: pointer; /* 鼠标变为手型，提示可点击 */
}

.book-hot {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #DB975A;
  line-height: 22px;
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
  height: 25px;
  line-height: 25px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #DADADA;
  text-align: left;
  font-style: normal;
}

.book-tags {
  display: flex;
  gap: 6px;
}

.tag {
  height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #DB975A;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.tag.update {
  background-color: #e8f4fd;
  color: #2c85c8;
}

.book-desc {
  width: 498px;
  height: 64px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
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
