<!-- components/HistoryContent.vue -->
<template>
  <div class="history-container">
    <div class="history-header-box">
      <div class="history-header-title">历史记录</div>
    </div>

    <div class="history-content-box">
      <!-- 显示历史记录 -->
      <div v-if="true" class="history-list">
        <div class="history-item">
          <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/ed9bd8e3-3eee-494c-a890-068b6cce18f7.png" alt="">
          <div class="book-info">
            <span class="book-title">盖世神医</span>
            <div class="book-chapter">
              <span class="book-chapter-num">第二章 </span>
              <span class="book-chapter-title">赚钱了？</span>
            </div>
            <button class="add-bookshelf-btn" @click="addToBookShelf">加入书架</button>
          </div>
        </div>
      </div>
      <!-- 无历史阅读记录 -->
      <div v-else class="history-empty-box">
        <div class="history-empty-icon"></div>
        <div class="history-empty-text">空空如也~</div>
      </div> 
    </div>
  </div>
</template>

<script setup>

  // 获取历史阅读记录书籍
  const listHistoryBook = async () => { 
    try {
      const historyBookReq = {
        "page": 1,
        "size": 10
      }
      const historyBookResult = await apiRequest(API_ENDPOINTS.USER_READING_HISTORY, {
        method: 'POST',
        body: JSON.stringify(historyBookReq)
      })
      console.log("用户阅读历史记录: ", historyBookResult);
    } catch (error) {

    }
  }

  const addToBookShelf = async (bookId) => { 
    // 获取当前书籍的 bookId
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
      ElMessage.success('添加成功！');
    } catch (error) {
      ElMessage.error('Error adding book to favorite:', error);
    }
  }

  onMounted(() => { 
    listHistoryBook();
  }) 

</script>

<style lang="scss" scoped>
  .history-header-box {
    width: 956px;
    height: 48px;
    background: #424242;
    border-radius: 6px 6px 0px 0px;
  }
  .history-header-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 48px;
    text-align: left;
    font-style: normal;
    margin-left: 20px;
  }
  .history-content-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .history-list {
    background: #424242;
    margin-top: 16px;
  }
  .history-item {
    position: relative;
    display: flex;
  }
  .book-img {
    width: 102px;
    height: 136px;
    border-radius: 10px;
  }
  .book-info {
    margin-left: 16px;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
  .book-chapter {
    margin-top: 24px;
  }
  .book-chapter-num, .book-chapter-title { 
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #B2B2B2;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .add-bookshelf-btn {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 108px;
    height: 36px;
    border-radius: 18px;
    border: 1px solid #F96E08;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #F96E08;
    line-height: 17px;
    text-align: center;
    font-style: normal;
  }
  .history-empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .history-empty-icon {
    width: 150px;
    height: 150px;
    background: #808080;
    margin-top: 136px;
  }
  .history-empty-text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: center;
    font-style: normal;
    margin-top: 4px;
  }
</style>