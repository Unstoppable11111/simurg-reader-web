<template>
  <div class="reading-page">
    <div class="reading-container">
      <div class="back-book-detail"><NuxtLink :to="`/book/${bookId}`">< {{ book.title }}</NuxtLink></div>
      <div class="book-table-content">
        <div class="book-table-title">第{{ book.chapterNumber }}章 {{ book.chapterTitle }}</div>
        <!-- <div class="book-table-title">第{{ book.tableOfContents[0].chapterNumber }}章 {{ book.tableOfContents[0].title }}</div> -->
        <div class="book-info-box">
          <label class="book-info-label">书名：</label>
          <div class="book-info-value book-title">{{ book.title }}</div>

          <label class="book-info-label">作者：</label>
          <div class="book-info-value book-title">{{ book.authorPenName }}</div>

          <label class="book-info-label">本章字数：</label>
          <div class="book-info-value book-title">{{ book.totalCharCount }}</div>

          <label class="book-info-label">更新时间：</label>
          <div class="book-info-value book-title">{{ book.updateDate }}</div>
        </div>
        <div class="book-delimiter"></div>
      </div>

      <div class="book-content">
        <p class="book-text">{{ book.chapterContent }}</p>
      </div>

      <!-- 悬浮按钮 -->
      <div class="floating-buttons">
        <button class="floating-btn" @click="addToBookshelf">
          <span class="btn-icon">📚</span>
          <span class="btn-text">加入书架</span>
        </button>
        <button class="floating-btn" @click="showTableOfContents">
          <span class="btn-icon">📑</span>
          <span class="btn-text">目录</span>
        </button>
        <button class="floating-btn" @click="openSettings">
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">设置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components'
import { API_ENDPOINTS, apiRequest } from '@/utils/api.js'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const bookId = route.query.book
console.log("params:",route.query.book)
const chapterNumber = route.query.chapter || '1'
const book = ref({})

// try {
//   const chapterReq = {
//     bookId: bookId,
//     chapterNumber: chapterNumber,
//   }
//   // console.log("请求的参数", JSON.stringify(chapterReq));
//   const chapterResult = await apiRequest(API_ENDPOINTS.LIST_ALL_CHAPTER, {
//     method: 'POST',
//     body: JSON.stringify(chapterReq)
//   });
//   console.log("章节内容：", chapterResult);
//   if (chapterResult.code === 200) {
//     book.value = chapterResult.data.records;
//     // chapterList.value = chapterResult.data.records;
//     console.log(chapterResult.data.records)
//   }
// } catch (error) {
//   console.error('Error fetching book data:', error);
// }

try {
  const getChapterDetailReq = {
    bookId: bookId,
    chapterNumber: chapterNumber,
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
  console.log('显示目录');
}

const openSettings = () => { 
  console.log('打开设置');
}

</script>

<style scoped>
.reading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.reading-container {
  width: 1360px;
  height: 1080px;
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
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.book-table-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
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
}
.book-info-label { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #636363;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.book-info-value {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-right: 84px;
}
.book-delimiter {
  width: 1212px;
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
  width: 1212px;
  min-height: 600px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}
.book-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #A2A0A0;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}

.chapter-header {
  text-align: center;
  margin-bottom: 40px;
}

.chapter-title {
  font-size: 28px;
  color: #FFD700;
  margin-bottom: 16px;
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

  .chapter-title {
    font-size: 24px;
  }

  .book-text {
    font-size: 16px;
  }
}
/* 悬浮按钮样式 */
.floating-buttons {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.floating-btn {
  background: #333;
  border: none;
  border-radius: 30px;
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
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
  font-size: 12px;
  color: #fff;
}

/* 响应式 */
@media (max-width: 768px) {
  .reading-container {
    width: 90%;
    padding: 20px;
  }

  .chapter-title {
    font-size: 24px;
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
</style>