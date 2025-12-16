<template>
  <div class="book-page"> 
    <Header :margin-left="'360px'" />
    <div class="book-detail-page">
      <!-- Breadcrumb navigation -->
      <div class="breadcrumb">
        <NuxtLink to="/" class="to-simurg-reader-index">首页</NuxtLink> > 
        <span>{{ book.title }}</span>
      </div>
      <!-- Left side - Book information -->
      <div class="book-info">
        <div class="book-cover">
          <img :src="book.coverImageUrl" :alt="book.title" />
        </div>
        
        <div class="book-content">
          <span class="book-title">{{ book.title }}</span>
          
          <div class="book-tags" >
            <span class="tag book-tag">{{ formatSerialStatus(book.serialStatus) }}</span>
            <span class="tag book-tag" v-for="(bookCate, index) in book.bookCategoryResponseList" :key="bookCate.categoryId">{{ bookCate.categoryName }}</span>
          </div>
          
          <div class="book-author">
            <span @click="gotoAuthorDetail(book.authorId)">作者：{{ book.authorPenName }}</span>
          </div>
          
          <div class="book-stats">
            <span>300万字</span>
            <span> | </span>
            <span>{{ book.bookViews }}次浏览</span>
            <span> | </span>
            <span>{{ book.totalFavorites }}万累计人气值</span>
          </div>
          
          <div class="book-actions">
            <!-- <NuxtLink :to="`/book/read?book=${book.bookId}&chapter=${book.tableOfContents[0].id}`" class="btn-read-now">开始阅读</NuxtLink> -->
            <!-- <NuxtLink :to="`/book/read?book=${book.bookId}&chapter=1`" class="btn-read-now">开始阅读</NuxtLink> -->
            <button class="btn-read-now" @click="startReading">开始阅读</button>
            <button class="btn-add-to-bookshelf" @click="addToBookshelf">加入书架</button>
          </div>
        </div>
      </div>

      
      <div class="divider"></div>
      <div class="author-info">
        <div class="author-avatar">
          <img :src="book.authorPictureUrl" alt="" @click="gotoAuthorDetail(book.authorId)"/>
          <div class="author-info-container">
            <div class="author-info-box">
              <span class="author-name" @click="gotoAuthorDetail(book.authorId)">{{ book.authorPenName }}</span>
              <span class="author-tag">作家</span>
            </div>
            <span v-if="isLoggedIn && isFollowed" class="followed">已关注</span>
            <span v-else class="btn-follow" @click="followAuthor(authorId)">+关注</span>
            <!-- <span class="followed">已关注</span> -->
          </div>
        </div>
        
        <div class="author-creation-info">
          <div class="creation-info-item">
            <label class="creation-info-label">创作天数</label>
            <span class="creation-info-value">421天</span>
          </div>
          
          <div class="creation-info-item">
            <label class="creation-info-label">作品总数</label>
            <span class="creation-info-value">2本</span>
          </div>
          
          <div class="creation-info-item">
            <label class="creation-info-label">累计字数</label>
            <span class="creation-info-value">88.5万</span>
          </div>
        </div>
      </div>

      
    </div>

    <!-- 书籍简介 -->
    <div class="book-desc-container"> 
      <div class="book-desc-box">
        <div class="book-desc-title">
        </div>
        <span class="book-desc-title-text">简介</span>
        <div class="book-desc-content">
          <p class="book-desc">{{ book.description }}</p>
        </div>
      </div>
    </div>

    <!-- 书籍目录 -->
    <div class="book-table-container"> 
      <div class="book-table-box">
        <div class="book-table-content-title">
        </div>
        <span class="book-table-content-title-text">目录</span>
        <div class="book-table-content">
          <div class="book-table-item" v-for="(item, index) in chapterList" :key="index">
            <div class="book-table-item-title"  @click="switchToChapter(item.chapterNumber)">第{{ item.chapterNumber }}章：  {{ item.chapterTitle }}</div>
          </div>
        </div>

        <div class="book-table-more-container">
          <div class="btn-more" v-if="hasNextChapter">展开更多</div>
        </div>
      </div>
    </div>

    <!-- 书籍内容 -->
     <div class="book-content-container"> 
      <div class="book-content-box">
        <div class="book-content-title">
        </div>
        <span class="book-content-title-text">阅读</span>
        <div class="book-content-info">
          <p class="book-text"> {{ decryptData(chapterContent.chapterContent) }} </p>
        </div>
      </div>
     </div>
    <Footer class="footer"/>
  </div>
</template>

<script setup>
  import Header from '@/components/layout/Header.vue';
  import Footer from '@/components/layout/Footer.vue';
  import { API_ENDPOINTS , apiRequest} from '@/utils/api';
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  import { useAuth } from '@/composables/useAuth';
  import { decryptData } from '@/utils/crypto';
  definePageMeta({
    // 开启页面缓存
    keepalive: true
  })

  const {isLoggedIn} = useAuth();
  console.log("isLoggedIn", isLoggedIn);
  // 获取路由参数
  const route = useRoute()
  const router = useRouter();
  const bookId = route.params.id
  const chapterList = ref([]);
  const hasNextChapter = ref(false);
  const chapterNumber = ref(1);
  const chapterContent = ref(null);
  const isFollowed = ref(false);
  const authorId = ref("");
  const book = ref(null);

  try {
    console.log("请求的id", bookId)
    const url = new URL(`${API_ENDPOINTS.BOOK_DETAIL}/${bookId}`);
    console.log("请求的url地址", url);
    const bookResult = await apiRequest(url);
    console.log("书籍内容",bookResult);
    if (bookResult.code === 200) {          
      authorId.value = bookResult.data.authorId;
      book.value = bookResult.data;
    }
  } catch (error) { 
    console.error('Error fetching book data:', error);
  }

  // 获取书籍的所有章节目录
  try {
    const chapterReq = {
      bookId: bookId,
      page: 1,
      size: 20
    }
    // console.log("请求的参数", JSON.stringify(chapterReq));
    const chapterResult = await apiRequest(API_ENDPOINTS.LIST_ALL_CHAPTER, {
      method: 'POST',
      body: JSON.stringify(chapterReq)
    });
    console.log("章节内容：", chapterResult);
    if (chapterResult.code === 200) {
      chapterList.value = chapterResult.data.records;
      hasNextChapter.value = chapterResult.data.hasNext;
    }
  } catch (error) {
    console.error('Error fetching book data:', error);
  }

  // 默认获取第一章数据
  const fetchChapterDetail = async (chapterNum) => {
    try {
      const chapterDetailReq = {
        bookId: bookId,
        chapterNumber: chapterNum
      }
      console.log("请求的参数", JSON.stringify(chapterDetailReq));
      const chapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
        method: 'POST',
        body: JSON.stringify(chapterDetailReq)
      })
      console.log("章节详细内容：", chapterDetailResult);
      return chapterDetailResult;
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    }
  }

  // 默认获取第一章数据
  const {data: initalChapter} = await fetchChapterDetail(chapterNumber.value);
  console.log("章节内容：", initalChapter);
  chapterContent.value = initalChapter;

  // 切换章节内容
  const switchToChapter = async (chapterNum) => { 
    if (chapterNumber.value !== chapterNum) {
      chapterNumber.value = chapterNum;
      const newChapterContent = await fetchChapterDetail(chapterNum);
      console.log("获取新的章节内容：", newChapterContent);
      chapterContent.value = newChapterContent.data;
    }
  }
  

  const addToBookshelf = async() =>{
    // 获取当前书籍的 bookId
    const currentBookId = route.params.id;
    const addFavoriteReq = {
      bookIdList: [currentBookId]
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

  // 检查是否已关注作者
  try {
    console.log("作者id：{}", authorId.value);
    const checkFollowUrl = `${API_ENDPOINTS.CHECK_FOLLOW}${authorId.value}`;
    const checkFollowStatusResult = await apiRequest(checkFollowUrl, {
      method: 'GET'
    });
    console.log("检查是否关注作者：{}, {}", authorId, checkFollowStatusResult);
  } catch (error) {
    console.error('Error fetching book data:', error);
  }

  // 开始阅读
  const startReading = async() => {
    // 获取用户阅读记录，用于跳转
    router.push(`/book/read?book=${bookId}&chapter=1`);
  }

  // 点击作者跳转到作者详情页
  const gotoAuthorDetail = (authorId) => {
    console.log('点击作者', authorId)
    router.push(`/author/${authorId}`)
  }

  const followAuthor = (authorId) => { 
  }

  // 设置页面标题
  useHead({
    title: book.value?.title || '书籍详情',
    meta: [
      {
        name: 'description',
        content: book.value?.authorDescription || '书籍详情页面'
      }
    ]
  })
</script>

<style lang="scss" scoped>
  .book-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .book-detail-page {
    position: relative;
    display: flex;
    color: white;
    height: 358px;
    width: 100vw; 
    margin-top: 112px;
  }
  .breadcrumb {
    width: 100%;
    display: flex;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: #bdc3c7;
    margin: 28px 0 0 360px;
  }
  .to-simurg-reader-index {
    font-size: 14px;
  }
  .breadcrumb a {
    color: #bdc3c7;
    text-decoration: none;
  }
  .breadcrumb a:hover {
    // color: #e74c3c;
  }
  .book-info {
    position: absolute;
    top: 88px;
    left: 360px;
    display: flex;
    gap: 24px;
  }
  .book-cover {
    width: 168px;
    height: 224px;
    border-radius: 10px;
    overflow: hidden;
  }
  .book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .book-content {
    position: relative;
    flex: 1;
  }
  .book-title {
    font-size: 18px;
    color: #ffffff;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .book-tags {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .tag {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
  }
  .book-tag {
    overflow: hidden;
    background: linear-gradient( 224deg, rgba(253,149,19,0.82) 0%, rgba(192,69,30,0.8) 100%);
  }
  .book-author {
    margin-bottom: 52px;
    font-size: 12px;
    color: #bdc3c7;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .book-stats {
    margin-bottom: 20px;
    font-size: 14px;
    color: #bdc3c7;
  }
  .book-actions {
    position: absolute;
    display: flex;
    gap: 15px;
    bottom: 0;
  }
  .btn-read-now {
    width: 148px;
    height: 36px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    text-align: center;
  }
  .btn-read-now:hover {
    background-color: #d35400;
  }
  .btn-add-to-bookshelf {
    width: 148px;
    height: 36px;
    background-color: transparent;
    color: #e67e22;
    border: 1px solid #e67e22;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    text-align: center;
  }
  .btn-add-to-bookshelf:hover {
    background-color: #e67e22;
    color: white;
  }
  .divider {
    position: absolute;
    right: 760px;
    top: 102px;
    width: 1px;
    height: 196px;
    background: #fff;
  }
  .author-info {
    position: absolute;
    right: 360px;
    width: 400px;
    height: 358px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .author-avatar {
    display: flex;
    width: 240px;
    height: 74px;
  }
  .author-avatar img {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    object-fit: cover;
  }
  .author-info-container {
    display: flex;
    flex-direction: column;
    margin-left: 12px;
  }
  .author-info-box {
    display: flex;
  }
  .author-creation-info {
    width: 240px;
    height: 54px;
    display: flex;
    gap: 54px;
  }
  .creation-info-item {
    display: flex;
    flex-direction: column;
    width: 44px;
    height: 40px;
    margin-top: 14px;
  }
  .creation-info-label {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 11px;
    color: #B2B2B2;
    line-height: 16px;
    text-align: left;
    font-style: normal;
  }
  .creation-info-value {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
  .author-name {
    width: 118px;
    height: 25px;
    white-space: nowrap;      /* 防止换行 */
    overflow: hidden;         /* 超出部分隐藏 */
    text-overflow: ellipsis;  /* 超出部分显示省略号 */
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: left;
    font-style: normal;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .author-tag {
    width: 36px;
    height: 14px;
    background: linear-gradient( 180deg, #FF9D3D 0%, #FF6200 100%);
    border-radius: 2px;
    font-size: 10px;
  }
  .btn-follow {
    width: 58px;
    height: 22px;
    background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
    border-radius: 11px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    margin-top: 9px;
    &:hover {
      cursor: pointer;
    }
  }
  .followed {
    width: 58px;
    height: 22px;
    background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
    border-radius: 11px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    margin-top: 9px;
  }
  .author-desc {
    font-size: 14px;
    color: #bdc3c7;
  }
  /* 响应式设计 */
  @media (max-width: 768px) {
    .book-container {
      flex-direction: column;
    }
    
    .author-info {
      border-left: none;
      border-top: 1px solid #34495e;
    }
    
    .book-info {
      flex-direction: column;
      align-items: center;
    }
    
    .book-cover {
      width: 150px;
      height: 225px;
    }
  }
  .book-desc-container {
    position: relative;
    width: 100vw;
    height: 150px;
    margin-top: 70px;
  }
  .book-desc-box, .book-table-box, .book-content-box {
    margin-left: 360px;
  }
  .book-table-container {
    position: relative;
    width: 100vw;
    margin-top: 50px;
  }
  .book-content-container { 
    position: relative;
    width: 100vw;
    margin-top: 50px;
  }
  .book-desc-title, .book-table-content-title, .book-content-title {
    width: 480px;
    height: 48px;
    background: linear-gradient( 270deg, rgba(254,92,84,0) 0%, #F1951E 100%);
    border-radius: 4px;
    opacity: 0.38;
  }
  .book-desc-title-text, .book-table-content-title-text, .book-content-title-text {
    position: absolute;
    top: 12px;
    left: 367px;
    height: 25px;
    line-height: 25px;
    font-size: 18px;
    font-family: TrajanPro;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    text-align: left;
    font-style: normal;
    // background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
    /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
    background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
    /* 关键：让背景裁剪成文字形状 */
    -webkit-background-clip: text; 
    /* 文字填充色设透明，让渐变背景透出来 */
    -webkit-text-fill-color: transparent; 
    /* 兼容其他浏览器 */
    background-clip: text; 
    text-fill-color: transparent; 
  }
  .book-desc-content {
    /* 必须设置宽度，否则可能不生效 */
    width: 1200px; /* 可根据实际需求调整 */
    
    /* 核心样式 */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 限制最多显示3行 */
    -webkit-box-orient: vertical;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
    
    /* 可选样式 */
    line-height: 1.5; /* 行高，影响整体高度 */
    font-size: 16px;
  }
  .book-content-info {
    width: 1200px
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
  .book-table-content {
    display: flex;
    flex-direction: row;
    color: #fff;
    width: 1360px;
    flex-wrap: wrap;
  }
  .book-table-item {
    width: 331px;
    height: 22px;
    margin: 16px 100px 16px 0;
  }
  .book-table-item-title {
    width: 331px;
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      cursor: pointer;
      color: #F96E08;
    }
  }
  .book-table-more-container {
    position: absolute;
    bottom: -32px;
    left: 50%;
  }
  .btn-more {
    width: 128px;
    height: 32px;
    border-radius: 18px;
    border: 1px solid #F96C05;
    color: #F96C05;
    text-align: center;
    line-height: 32px;
    &:hover {
      cursor: pointer;
    }
  }
  .book-text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: justify;
    font-style: normal;
    word-wrap: break-word;      /* 允许长单词换行 */
    word-break: break-word;     /* 在适当位置换行 */
    white-space: pre-wrap;      /* 保留空白符序列，但是正常换行 */
  }
</style>