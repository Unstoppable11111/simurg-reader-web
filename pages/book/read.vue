<template>
  <div class="reading-page" :class="{'blur-effect' : showToc}" @click="handlePageClick">
    <div class="reading-container" ref="mainContentRef">
      <div class="back-book-detail"><a :href="`/book/${bookId}`">< {{ book.title }}</a></div>
      <div class="book-table-content">
        <div class="book-table-title">第{{ book.chapterNumber }}章 {{ book.chapterTitle }}</div>
        <!-- <div class="book-table-title">第{{ book.tableOfContents[0].chapterNumber }}章 {{ book.tableOfContents[0].title }}</div> -->
        <div class="book-info-box">
          <!-- <div class="boo-info-box-div">
            <label class="book-info-label">书名：</label>
            <span class="book-info-value book-title">{{ book.title }}</span>
          </div> -->

          <div class="boo-info-box-div">
            <label class="book-info-label">作者：</label>
            <span class="book-info-value book-author">{{ book.authorPenName }}</span>
          </div>

          <div class="boo-info-box-div">
            <label class="book-info-label">本章字数：</label>
            <span class="book-info-value book-chapter-count">{{ book.totalCharCount }}</span>
          </div>

          <div class="boo-info-box-div">
            <label class="book-info-label">更新时间：</label>
            <span class="book-info-value book-update-time">{{ formatTimestampToYMD(book.publishDate) }}</span>
          </div>
        </div>
        <div class="book-delimiter"></div>
      </div>

      <div class="book-content">
        <p class="book-text">{{ book.chapterContent }}</p>
      </div>

      <button class="next-page-btn" @click="nextPage" @click.stop>下一页</button>


      <!-- 悬浮按钮 -->
      <div class="floating-buttons">
        <button class="floating-btn" @click="addToBookshelf" @click.stop>
          <span class="btn-icon">📚</span>
          <span class="btn-text">加入书架</span>
        </button>
        <button class="floating-btn" @click="showTableOfContents" @click.stop>
          <span class="btn-icon">📑</span>
          <span class="btn-text">目录</span>
        </button>
        <button class="floating-btn" @click="openSettings" @click.stop>
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">设置</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 目录侧边栏 -->
  <div v-if="showToc" class="toc-sidebar" :style="{ left: sidebarLeft + 'px' }" @click.stop>
    <div class="toc-header">
      <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/91f22daced2b37eab5022fe3f7a8a598.jpeg" alt="">
      <div class="table-info-box">
        <span class="table-info-book-title">我不是戏神</span>
        <span class="table-info-book-status">连载中·2小时前更新</span>
        <span class="table-info-book-author">田拽拽</span>
      </div>
    </div>
    <div class="toc-list">
      <div class="table-of-box">
        <span class="table-of-title">目录 ·  {{ chapterCount }}</span>
        <button class="sort-asc-btn" @click="sortAsc" @click.stop>正序</button>
        <button class="sort-desc-btn" @click="sortDesc" @click.stop>倒序</button>
      </div>
      <div class="table-of-content-list">
        <div class="table-of-content-item"
            v-for="chapter in chapterList"
            :key="chapter.chapterNumber"
            :class="{'chapter-active' : isCurrentChapter(chapter.chapterNumber)}"
            @click="goToChapter(chapter.chapterNumber)"
            @click.stop>
          <span class="chapter-num">第{{ chapter.chapterNumber }}章</span>
          <span class="chapter-title">{{ chapter.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 蒙层遮罩 -->
  <div v-if="showToc" class="overlay" @click="closeToc"></div>
</template>

<script setup>
import { NuxtLink } from '#components'
import { API_ENDPOINTS, apiRequest } from '@/utils/api.js'
import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';


// 获取路由参数
const route = useRoute()
const router = useRouter()
const bookId = route.query.book
// const chapterNumber = route.query.chapter || '1'
const chapterNumber = computed(() => route.query.chapter || '1')
const book = ref({})
const showToc = ref(false)
const mainContentRef = ref(null)
const sidebarLeft = ref(0)
const chapterCount = ref(0)
const chapterList = ref([])


const fetchChapterContent = async (chapterNum) => { 
  try {
    const getChapterDetailReq = {
      bookId: bookId,
      chapterNumber: chapterNum || chapterNumber,
    }
    const getChapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
        method: "POST",
        body: JSON.stringify(getChapterDetailReq),
    });
    console.log("获取书籍详情信息结果：｛｝", getChapterDetailResult);
    if (getChapterDetailResult.code === 200) {
      book.value = getChapterDetailResult.data;
    }
    return book.value;
  }catch (error){
  }
}
fetchChapterContent(chapterNumber.value)

/**
 * 获取所有已发布的章节信息
 */
try {
  const listPublishedChaptersReq = {
    bookId: bookId,
    page: 1,
    size: 10
  }
  const listPublishedChaptersResult = await apiRequest(API_ENDPOINTS.LIST_PUBLISHED_CHAPTERS, {
      method: "POST",
      body: JSON.stringify(listPublishedChaptersReq),
  });
  console.log("获取所有已发布的章节信息结果：｛｝", listPublishedChaptersResult);
  console.log("获取所有已发布的章节信息结果records：｛｝", listPublishedChaptersResult.data.records);
  if (listPublishedChaptersResult.code === 200) {
    chapterCount.value = listPublishedChaptersResult.data.records.length;
    chapterList.value = listPublishedChaptersResult.data.records;
  }
} catch (error){
}
const nextPage = async() => { 
  console.log("获取下一页内容");
}

const addToBookshelf = async() =>{
  const bookId = route.params.id
    // 获取当前书籍的 bookId
    console.log('当前书籍id：', bookId);
    const addFavoriteReq = {
      bookIdList: [bookId]
    };
    // 跳转到书籍详情页面
    console.log("添加到我的书架", JSON.stringify(addFavoriteReq));
    try {
      const response = await apiRequest(API_ENDPOINTS.ADD_BOOKS_TO_FAVORITE, {
        method: 'POST',
        body: JSON.stringify(addFavoriteReq)
      });
      console.log("添加结果",response);
      if (response.code === 2008) {
        router.push('/login');
      }
      alert('添加成功！');
    } catch (error) {
      console.error('Error adding book to favorite:', error);
    }
    
  }

const showTableOfContents = () => { 
  showToc.value = true
  console.log('显示目录');
}

const closeToc = () => { 
  showToc.value = false
  console.log('关闭目录');
}

const handlePageClick = (event) => { 
  console.log('点击页面');
  if (showToc.value) {
    closeToc();
  }
}

const goToChapter = async (chapterNumber) => { 
  console.log("跳转到章节：", chapterNumber);
  const newUrl = `/book/read?book=${bookId}&chapter=${chapterNumber}`
  await router.push(newUrl)
  await fetchChapterContent(chapterNumber);
  closeToc();
}
const openSettings = () => { 
  console.log('打开设置');
}

const sortAsc = () => {
  console.log("获取章节内容升序");
}

const sortDesc = () => { 
  console.log("获取章节内容降序");
}

// 判断当前章节是否为当前章节
const isCurrentChapter = (chapterNum) => { 
  return parseInt(chapterNum) === parseInt(chapterNumber.value)
}

// 计算并设置目录位置的函数
const setSidebarPosition = async() => {
  if (mainContentRef.value) {
    const mainRect = mainContentRef.value.getBoundingClientRect();
    sidebarLeft.value = mainRect.right - 400; // 目录左侧 = 主视图右侧
    console.log("目录位置：", sidebarLeft.value);
  }
};

// 初始化：组件挂载后计算位置
onMounted(async () => {
  if (!bookId) {
    console.log("BookId is missing.");
    return;
  }
  try {
    const getChapterDetailReq = {
      bookId: bookId,
      chapterNumber: chapterNum || chapterNumber,
    }
    const getChapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
        method: "POST",
        body: JSON.stringify(getChapterDetailReq),
    });
    console.log("获取书籍详情信息结果：｛｝", getChapterDetailResult);
    if (getChapterDetailResult.code === 200) {
      book.value = getChapterDetailResult.data;
    }
  }catch (error){
  }
  await fetchChapterContent(chapterNumber);
  nextTick(setSidebarPosition); // 确保 DOM 渲染完成后执行
  // 监听滚动和 resize 事件
  // window.addEventListener('scroll', setSidebarPosition);
  // window.addEventListener('resize', setSidebarPosition);
  // 设置监听器
  watch(
    () => chapterNumber,
    async (newChapter, oldChapter) => {
      if (newChapter !== oldChapter) {
        await fetchChapterContent(newChapter);
      }
    },
    { immediate: true }
  )
   watch(
    () => mainContentRef.value?.getBoundingClientRect().right,
    () => {
      setSidebarPosition();
    }
  )
});

// 组件卸载时移除事件监听（避免内存泄漏）
onUnmounted( () => {
  window.removeEventListener('scroll', setSidebarPosition);
  window.removeEventListener('resize', setSidebarPosition);
});

watch(
  () => route.query.book,
  async (newBookId) => {
    if (newBookId) {
      await fetchChapterContent(bookId.value);
    }
  },
  { immediate: true } // 立即执行一次
)

</script>

<style scoped lang="scss">
.reading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.blur-effect {
  filter: blur(8px);
}
.reading-container {
  width: 800px;
  height: 100vh;
  background: #262626;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: #121212; */
  color: white;
}
.back-book-detail {
  position: absolute;
  top: 42px;
  left: 74px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.book-table-content {
  width: 800px;
}
.book-table-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: rgba(249,110,8,0.7);
  line-height: 28px;
  text-align: center;
  font-style: normal;
  margin-top: 108px;
}
.book-info-box {
  display: flex;
  justify-content: center;
  margin-top: 28px;
  gap: 40px;
}
.boo-info-box-div {
  display: flex;
}
.book-info-label { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #636363;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.book-info-value {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.book-title, .book-author, .book-chapter-count, .book-update-time {
  &:hover {
    cursor: pointer;
    color: #F96E08;
  }
}
.book-delimiter {
  width: 800px;
  height: 1px;
  background-image: linear-gradient(
    to right,
    #636363 0,
    #636363 8px,
    transparent 8px,
    transparent 16px
  );
  background-size: 16px 1px;
  margin-top: 42px;
}
.book-content {
  width: 800px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}
.book-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.next-page-btn {
  width: 118px;
  height: 36px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  margin-top: 18px;
}
.chapter-header {
  text-align: center;
  margin-bottom: 40px;
}

.chapter-meta {
  font-size: 14px;
  color: #bdc3c7;
}

.content-area {
  font-family: PingFangSC, PingFang SC;
  font-size: 18px;
  line-height: 1.8;
  color: #FFFFFF;
  text-align: justify;
  margin-bottom: 60px;
}

.book-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #A2A0A0;
  line-height: 25px;
  text-align: left;
  font-style: normal;
  padding: 0 50px;
  line-height: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.btn-prev,
.btn-next {
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-prev {
  background-color: #e67e22;
  color: white;
}

.btn-prev:hover {
  background-color: #d35400;
}

.btn-next {
  background-color: #f39c12;
  color: white;
}

.btn-next:hover {
  background-color: #e67e22;
}

/* 响应式 */
@media (max-width: 768px) {
  .reading-container {
    width: 90%;
    padding: 20px;
  }

  .book-text {
    font-size: 16px;
  }
}
/* 悬浮按钮样式 */
.floating-buttons {
  position: absolute;
  right: -88px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.floating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333;
  border: none;
  cursor: pointer;
  width: 68px;
  height: 68px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.floating-btn:hover {
  background: #444;
  transform: scale(1.05);
}

.btn-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.btn-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}

/* 响应式 */
@media (max-width: 768px) {
  .reading-container {
    width: 90%;
    padding: 20px;
  }
  .book-text {
    font-size: 16px;
  }
  
  .floating-buttons {
    right: 15px;
  }
  
  .floating-btn {
    width: 60px;
    padding: 10px 12px;
  }
  
  .btn-icon {
    font-size: 18px;
  }
  
  .btn-text {
    font-size: 10px;
  }
}


/* 目录侧边栏 */
.toc-sidebar {
  position: fixed;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #343434;
  color: #e0e0e0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.toc-header {
  display: flex;
  width: 340px;
  height: 72px;
  margin-top: 42px;
}
.book-img {
  width: 54px;
  height: 72px;
  object-fit: cover;
  margin-left: 30px;
}
.table-info-box {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.table-info-book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.table-info-book-status {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #A2A0A0;
  line-height: 14px;
  text-align: left;
  font-style: normal;
}
.table-info-book-author {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.toc-list {
  margin-top: 40px;
  margin-left: 30px;
}
.table-of-box {
  position: relative;
}
.table-of-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}
.sort-asc-btn {
  position: absolute;
  right: 72px;
  width: 44px;
  height: 24px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #000000;
  line-height: 24px;
  text-align: center;
  font-style: normal;
  z-index: 2;
}
.sort-desc-btn {
  position: absolute;
  right: 30px;
  width: 86px;
  height: 24px;
  background: #242424;
  border-radius: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 24px;
  text-align: right;
  font-style: normal;
  z-index: 1;
  padding-right: 10px;
}
.table-of-content-list {
  display: flex;
  flex-direction: column;
  // gap: 38px;
  margin-top: 38px;
  overflow-y: auto;
  padding-right: 30px;
  box-sizing: border-box;
}
.toc-list::-webkit-scrollbar {
  width: 15px; /* 滚动条宽度 */
  margin-right: -30px; /* 关键：滚动条向右“负偏移”30px，视觉上向左移动 */
}
/* 自定义滚动条样式（WebKit内核浏览器） */
.toc-list::-webkit-scrollbar {
  width: 15px; /* 滚动条宽度 */
  margin-right: -30px; /* 关键：滚动条向右“负偏移”30px，视觉上向左移动 */
}
.toc-list::-webkit-scrollbar-thumb {
  background: #888;
  height: 40px; /* 固定高度 */
  border-radius: 9px;
}

.table-of-scroll {
  display: flex;
  flex-direction: column;
  gap: 38px;
  margin-top: 38px;
    /* 滚动条整体样式 */
  --el-scrollbar-width: 8px;
  --el-scrollbar-track-background: rgba(255, 255, 255, 0.05);
  --el-scrollbar-thumb-background: #F96E08;
  --el-scrollbar-thumb-hover-background: #FF9B51;
  --el-scrollbar-thumb-active-background: #ED5B00;
  
  /* 滚动条圆角 */
  --el-scrollbar-thumb-border-radius: 4px;
  
  /* 滚动条透明度 */
  --el-scrollbar-opacity: 0.8;
}
.table-of-content-item {
  margin-bottom: 38px;
}
.chapter-active {
  color: #F96E08;
}
.chapter-title {
  margin-left: 12px;
  &:hover {
    cursor: pointer;
  }
}
.book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.toc-title {
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}

.toc-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #2d2d2d;
}

.toc-item:hover {
  background-color: #2d2d2d;
}

.toc-item.active {
  background-color: #3c3c3c;
  color: #f96e08;
}

/* 蒙层 */
 overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(2px);
}


/* 滚动条整体宽度（垂直滚动条） */
::-webkit-scrollbar {
  width: 15px; /* 滑块宽度，根据设计调整 */
}

/* 滚动条轨道（背景） */
::-webkit-scrollbar-track {
  background: #333; /* 深色轨道背景 */
}

/* 滚动条滑块（可拖动部分） */
::-webkit-scrollbar-thumb {
  background: #1A1A1A;
  border-radius: 8px;
  transition: background 0.2s;
  height: 34px;
}

/* 滑块 hover 效果 */
::-webkit-scrollbar-thumb:hover {
  background: #777; /* hover 时的亮色 */
}

/* 隐藏滚动条两端的箭头按钮 */
::-webkit-scrollbar-button {
  display: none;
}
</style>