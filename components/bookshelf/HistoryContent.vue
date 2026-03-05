<!-- components/HistoryContent.vue -->
<template>
  <div class="history-container">
    <div class="history-header-box">
      <div class="history-header-title">历史记录</div>
    </div>

    <div class="history-content-box">
      <!-- 显示历史记录 -->
      <div v-if="historyRecords.length > 0" class="history-list">
        <div class="history-item"
          v-for="(record, index) in historyRecords "
          :key="index"
          @click="gotoBookDetail(record.bookId)">
          <img class="book-img" :src="record.coverImageUrl" alt="书籍封面">
          <div class="book-info">
            <div class="book-title"> {{ record.title }}</div>
            <div class="book-chapter">
              <span class="book-chapter-num"> 第{{ record.lastReadChapterNumber }}章 </span>
              <span class="book-chapter-title">{{ record.lastReadChapterTitle }}</span>
            </div>
            <button v-if="!record.isFavorite" class="add-bookshelf-btn" @click.stop="addToBookShelf(record.bookId)">加入书架</button>
            <button v-else class="had-bookshelf-btn" >已加书架</button>
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
  const router = useRouter();
  const historyRecords = ref([])

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
      if (historyBookResult.code === 200) {
        historyRecords.value = historyBookResult.data.records.map(record => ({
          ...record,
          //添加一些需要的处理
          coverImageUrl: record.createImageURL || record.coverImageUrl || 'https://www.tata2025.xyz/uploads/2025/09/19/ed9bd8e3-3eee-494c-a890-068b6cce18f7.png'
        }))
      }
    } catch (error) {
      console.error('获取历史记录失败:', error)
    }
  }

  const addToBookShelf = async (bookId) => { 
    if (!bookId) {
      ElMessage.warning('书籍ID无效')
      return
    }
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
      if (response.code === 200 ) {
        console.log("添加结果",response);
        ElMessage.success('添加成功！');
      } else {
        ElMessage.error('添加失败！');
      }
    } catch (error) {
      console.error('Error adding book to favorite:', error);
      ElMessage.error('网络错误，请稍后重试');
    }
  }

  const gotoBookDetail = (bookId) => {
    router.push(`/book/${bookId}`)
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
    // background: #424242;
    margin-top: 16px;
  }
  .history-item {
    position: relative;
    display: flex;
    background: #424242;
  }
  .history-item:not(:last-child) {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 102px;
      right: 0;  // 从右边102px开始不显示边框
      height: 1px;
      background: #646261;
    }
  }
  .book-img {
    width: 102px;
    height: 136px;
  }
  .book-info {
    margin-left: 14px;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFF;
    text-align: left;
    font-style: normal;
    margin-top: 34px;
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
    padding-right: 8px;
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
  .had-bookshelf-btn {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 108px;
    height: 36px;
    border-radius: 18px;
    border: 1px solid #646261;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #646261;
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