<template>
  <div class="author-page">
    <Header />
    <div class="author-container">
      <div class="author-box">
        <img class="author-img" :src="authorInfo?.pictureUrl || '/default-avatar.png'" alt="作者头像">
        <!-- 作者信息简介开始 -->
        <div class="author-info">
          <div class="author-pen-name-box">
            <span class="author-name"> {{authorInfo?.penName || '作家'}} </span>
            <div class="author-tag">作家</div>
          </div>
          <span class="author-sign"> {{authorInfo?.briefIntroduction || '暂无个性签名'}}</span>
        </div>
        <!-- 作者信息简介结束 -->

        <!-- 作者创作信息详情开始 -->
        <div class="author-detail-info">
          <div class="author-detail-item">
            <label class="author-detail-item-label">创作天数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">{{ creationDays }}</span>
              <span class="author-detail-item-unit">天</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">作品总数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value"> {{ authorInfo?.bookCount || authorBookList.length || 0 }} </span>
              <span class="author-detail-item-unit">本</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">累计字数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value"> {{ formattedTotalWords }} </span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">粉丝数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">{{ fansCount }}</span>
              <span class="author-detail-item-unit">人</span>
            </div>
          </div>
        </div>
        <!-- 作者创作信息详情结束 -->

      </div>

      <!-- 作品列表开始 -->
    </div>

    <div class="author-all-book-title">
      全部作品（ {{ authorInfo?.bookCount || authorBookList.length || 0 }} ）
    </div>

    <div class="author-book-list">

      <div class="author-book-item"
          v-for="book in authorBookList"
          :key="book.bookId">
        
        <img class="book-img" :src="book.coverImageUrl" alt="封面" @click="router.push(`/book/${book.bookId}`)">
        <div class="book-info-box">
          <span class="book-title" @click="router.push(`/book/${book.bookId}`)">{{ book.title }}</span>
          <span class="book-author">{{ authorInfo?.penName }}</span>
          <span class="book-desc">{{ book.description || '暂无简介' }}</span>
          <div class="book-tag">
            <span class="book-status">{{ formatSerialStatus(book.serialStatus) }}</span>
            <div class="devier" v-if="book.currentChapterTitle"></div>
            <span class="book-recent-update-label" v-if="book.currentChapterTitle">最近更新：</span>
            <span class="book-chapter-title" v-if="book.currentChapterTitle">{{ book.currentChapterTitle }}</span>
          </div>
        </div>
        <button class="startReadBtn" @click="startRead(book.bookId)">开始阅读</button>
        <button class="addBookShelfBtn" @click="addBookShelf(book.bookId)">加入书架</button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import Footer from "@/components/layout/Footer.vue";
  import { API_ENDPOINTS, apiRequest } from "@/utils/api";
  import { formatSerialStatus, formatTimestamp } from "@/utils/dataFormatter";
  import { useAuth } from '@/composables/useAuth';

  const router = useRouter();
  const route = useRoute();
  const { isLoggedIn } = useAuth();
  const authorId = route.params.authorId;
  const authorInfo = ref(null);
  const authorBookList = ref([]);

  const creationDays = computed(() => {
    if (authorInfo.value?.creationDays) return authorInfo.value.creationDays;
    if (authorInfo.value?.createTime) {
      const diff = Date.now() - new Date(authorInfo.value.createTime).getTime();
      return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
    return 1;
  });

  const fansCount = computed(() => {
    return authorInfo.value?.fansCount ?? authorInfo.value?.followerCount ?? 0;
  });

  const formattedTotalWords = computed(() => {
    const words = authorInfo.value?.totalCompletedWords || 0;
    if (words >= 10000) {
      return (words / 10000).toFixed(1) + '万字';
    }
    return words + '字';
  });

  try {
    const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO_BY_ID}/${authorId}`;
    const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
      method: 'GET'
    });
    console.log("作者信息：", authorInfoResult);
    if (authorInfoResult?.code === 200) {
      authorInfo.value = authorInfoResult.data;
    }
  } catch (err) {
    console.error('Error fetching author info:', err);
  }

  // 获取指定作者书籍信息
  try { 
    const getAuthorBooksUrl = `${API_ENDPOINTS.LIST_PUBLISHED_BOOKS}${authorId}`;
    const authorBooksResult = await apiRequest(getAuthorBooksUrl, {
      method: 'GET'
    });
    console.log("作者书籍信息：", authorBooksResult);
    if (authorBooksResult?.code === 200) {          
      authorBookList.value = authorBooksResult.data || [];
    }
  } catch (error) {
    console.error('Error fetching author books:', error);
  }

  const startRead = (bookId) => {
    router.push(`/book/read?book=${bookId}&chapter=1`);
  };

  const addBookShelf = async (bookId) => {
    if (!bookId) return;
    if (!isLoggedIn.value) {
      router.push(`/login?redirectPath=${encodeURIComponent(route.fullPath)}`);
      return;
    }
    try {
      const response = await apiRequest(API_ENDPOINTS.ADD_BOOKS_TO_FAVORITE, {
        method: 'POST',
        body: JSON.stringify({ bookIdList: [bookId] })
      });
      if (response.code === 200) {
        ElMessage.success('已成功加入书架！');
      } else if (response.code === 2008) {
        router.push(`/login?redirectPath=${encodeURIComponent(route.fullPath)}`);
      } else {
        ElMessage.info(response.message || '已在书架中');
      }
    } catch (error) {
      ElMessage.error('加入书架失败，请重试');
    }
  };
</script>

<style lang="scss" scoped>
  .author-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .author-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 226px;
    // background: linear-gradient( 270deg, #FE5C54 0%, #F1951E 100%);
    background-color: #432b1c;
    margin-top: 84px;
  }
  .author-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 1200px;
  }
  .author-img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
  }
  .author-info {
    // width: 120px;
    height: 54px;
    margin-left: 18px;
  }
  .author-pen-name-box {
    display: flex;
    align-items: center;
  }
  .author-name {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
  .author-tag {
    width: 44px;
    height: 17px;
    background: linear-gradient( 180deg, #FFD50D 0%, #F9A825 100%);
    border-radius: 2px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #FFFFFF;
    line-height: 14px;
    text-align: center;
    font-style: normal;
    margin-left: 12px;
  }
  .author-sign {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 12px;
  }
  .author-detail-info {
    position: absolute;
    right: 0;
    display: flex;
    gap: 68px;
    width: 438px;
    height: 50px;
  }
  .author-detail-item-label {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: center;
    font-style: normal;
  }
  .author-detail-item-value {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: center;
    font-style: normal;
  }
  .author-detail-item-unit {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #A2A0A0;
    line-height: 14px;
    text-align: left;
    font-style: normal;
    margin-left: 6px;
  }
  .author-all-book-title {
    width: 1200px;
    height: 37px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 37px;
    text-align: left;
    font-style: normal;
    margin-top: 37px;    
    /* 下边框宽度（仅下边框生效） */
    border-bottom: 1px solid transparent;  
    /* 渐变方向+颜色（从左到右，橙色→深色） */
    border-image: linear-gradient(to right, #ff9900, #333333) 1;  
    /* 适配圆角（若需圆角，需额外设置 border-radius） */
    border-radius: 0 0 10px 10px; /* 仅下边角圆角 */
  }
  .author-book-list {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    width: 1200px;
    margin-top: 30px;
  }
  .author-book-item {
    position: relative;
    display: flex;
    width: 584px;
    height: 180px;
  }
  .book-img {
    width: 135px;
    height: 180px;
    border-radius: 10px;
    &:not(:valid) {
      width: 135px;
      height: 180px;
      border-radius: 10px;
      background-color: #828282;
    }
  }
  .book-info-box { 
    display: flex;
    flex-direction: column;
    margin-left: 12px;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .book-author {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 8px;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #DADADA;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 8px;
    /* 核心样式 */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制最多显示3行 */
    -webkit-box-orient: vertical;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
  .book-tag {
    display: flex;
    align-items: center;
    margin-top: 24px;
    gap: 12px;
  }
  .book-status, .devier, .book-recent-update-label, .book-chapter-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #DB975A;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .devier {
    height: 10px;
    border: 1px solid #DB975A;
  }
  .startReadBtn, .addBookShelfBtn {
    border: none;           /* 去除默认边框 */
    background: none;       /* 去除默认背景 */
    padding: 0;             /* 重置内边距 */
    margin: 0;              /* 重置外边距 */
    outline: none;          /* 去除点击时的轮廓 */
    font-family: inherit;   /* 继承字体 */
    font-size: inherit;     /* 继承字体大小 */
    cursor: pointer;        /* 设置鼠标手势 */
  }
  .startReadBtn {
    position: absolute;
    left: 149px;
    bottom: 0;
    width: 128px;
    height: 28px;
    background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
    border-radius: 18px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 28px;
    text-align: center;
    font-style: normal;
  }
  .startReadBtn:hover{
    z-index: 2;
    background-color: #d35400 !important;
  }
  .addBookShelfBtn {
    position: absolute;
    right: 147px;
    bottom: 0;
    width: 128px;
    height: 28px;
    border-radius: 18px;
    border: 1px solid #F96E08;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #F96E08;
    line-height: 28px;
    text-align: center;
    font-style: normal;
  }

  @media (max-width: 768px) {
    .author-container {
      height: auto;
      padding: 16px;
    }
    .author-box {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .author-detail-info {
      position: static;
      width: 100%;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .author-all-book-title,
    .author-book-list {
      width: 100%;
      padding: 0 16px;
    }
    .author-book-item {
      width: 100%;
      height: auto;
      flex-direction: column;
    }
    .book-info-box {
      margin-left: 0;
      margin-top: 8px;
    }
    .book-img {
      width: 96px;
      height: 128px;
    }
    .book-tag {
      flex-wrap: wrap;
      gap: 8px;
    }
    .startReadBtn,
    .addBookShelfBtn {
      position: static;
      width: 110px;
      height: 30px;
      margin-top: 10px;
    }
  }
</style>
