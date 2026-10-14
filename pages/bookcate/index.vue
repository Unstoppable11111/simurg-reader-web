<template>
  <div class="book-cate-container">
    <Header />
    <div class="book-cate-box">
      <!-- Breadcrumb navigation -->
      <div class="breadcrumb">
        <NuxtLink to="/" class="to-simurg-reader-index">首页</NuxtLink> > 
        <span class="book-cate-span">分类</span>
      </div>
      <div class="book-cate-content"> 
        <div class="book-cate-content-box">
          <div class="book-cate-content-title">
            类型
            <div class="book-cate-content-title-shadow"></div>
          </div>
          <div class="book-cate-item-box">
            <div class="without-div"
              :class="{'book-cate-item-active' : !selectedCategoryId}"
              @click="selectCategory(null)">不限
            </div>
            <span  
              v-for="bookCate in bookCateList"
              :key="bookCate.categoryId"
              class="book-cate-item"
              :class="{'book-cate-item-active' : selectedCategoryId != null && String(selectedCategoryId) === String(bookCate.categoryId)}"
              :data-category-id="bookCate.categoryId"
              @click="selectCategory(bookCate.categoryId)"
             >
              {{bookCate.categoryName}}
            </span>
          </div>
        </div>

        <div class="book-cate-content-box">
          <div class="book-cate-content-title">
            状态
            <div class="book-cate-content-title-shadow"></div>
          </div>
          <div class="book-status-item-box">
            <div class="without-div" 
              :class="{'book-status-item-active' : selectedStatus === null}"
              @click="selectStatus(null)">不限
            </div>
            <span class="book-status-item" :class="{'book-status-item-active' : selectedStatus === 1}" @click="selectStatus(1)">完结</span>
            <span class="book-status-item" :class="{'book-status-item-active' : selectedStatus === 0}" @click="selectStatus(0)">连载</span>
          </div>
        </div>

        <div class="book-cate-content-box">
          <div class="book-cate-content-title">
            字数
            <div class="book-cate-content-title-shadow"></div>
          </div>
          <div class="book-word-item-box">
            <div class="without-div" 
              :class="{'book-word-item-active' : selectedWord === null}"
              @click="selectWord(null)">不限
            </div>
            <span class="book-word-item" :class="{'book-word-item-active' : selectedWord === 50000}"  @click="selectWord(50000)">5万</span>
            <span class="book-word-item" :class="{'book-word-item-active' : selectedWord === 100000}"  @click="selectWord(100000)">10万</span>
            <span class="book-word-item" :class="{'book-word-item-active' : selectedWord === 150000}"  @click="selectWord(150000)">15万</span>
            <span class="book-word-item" :class="{'book-word-item-active' : selectedWord === 200000}"  @click="selectWord(200000)">20万</span>
            <span class="book-word-item" :class="{'book-word-item-active' : selectedWord === 200001}"  @click="selectWord(200001)">20万以上</span>
          </div>
        </div>

      </div>

      <!-- 按照分类查找书籍 -->
      <div class="book-cate-book-list" :class="{ 'is-loading-list': isListLoading }">
        <div 
          class="book-cate-book-item"
          v-for="book in libraryBookList"
          :key="book.bookId || book.id"
          @click="gotoBookDetail(book.bookId || book.id)"
        >
          <img class="book-img" :src="book.coverImageUrl" :alt="book.title || '封面'" loading="lazy">
          <div class="item-book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-desc">{{ book.description || book.protagonistIntroduction || '暂无简介' }}</span>
            <span class="book-author">{{ book.authorPenName || book.penName || '未知作者' }}</span>
            <div class="book-tag">
              <span class="book-status" v-if="book.serialStatus !== undefined">{{ formatSerialStatus(book.serialStatus) }}</span>
              <div class="devier" v-if="book.tag"></div>
              <span class="tag" v-if="book.tag">{{ book.tag }}</span>
              <div class="devier" v-if="book.bookViews"></div>
              <span class="book-hot" v-if="book.bookViews">{{ book.bookViews }} 热度</span>
            </div>
          </div>
        </div> 
      </div>

      <!-- 空状态 -->
      <div class="cate-empty-box" v-if="!isListLoading && libraryBookList.length === 0">
        <div class="cate-empty-icon">🔍</div>
        <div class="cate-empty-title">未找到符合条件的小说</div>
        <p class="cate-empty-desc">您可以尝试放宽筛选维度，或重置筛选条件</p>
        <button class="btn-reset-filters" @click="resetFilters">重置全部筛选</button>
      </div>

      <!-- 加载提示与底部文案 -->
      <div v-else-if="!isListLoading && libraryBookList.length > 0" class="no-more">已展示全部匹配书籍</div>
      <div v-else-if="isListLoading" class="no-more">正在加载书籍...</div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import Footer from "@/components/layout/Footer.vue";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  const router = useRouter();
  const gotoBookDetail = (bookId) => {
    if (bookId) {
      router.push(`/book/${bookId}`);
    }
  };
  const bookCateList = ref([])
  const selectedCategoryId = ref(null)
  const selectedStatus = ref(null)
  const selectedWord = ref(null)
  const libraryBookList = ref([])
  const minCharacterCount = ref(null)
  const maxCharacterCount = ref(null)

   // 选择分类的处理函数
  const selectCategory = (categoryId) => {
    console.log(`选择了${categoryId}分类:`);
    selectedCategoryId.value = categoryId
    console.log(`当前分类ID${selectedCategoryId.value}`);
    getLibraryBookList();
  };

  const selectStatus = (status) => { 
    console.log(`选择了${status}类型:`);
    selectedStatus.value = status
    console.log(`当前状态${selectedStatus.value}`);
    getLibraryBookList();
  };

  // 通过字数筛选书籍分类
  const selectWord = (word) => { 
    /**
     * 5万 => 最大字数为50000
     * 10万 => 最小字数为50000，最大为100000
     * 15万 => 最小字数为100000，最大为150000
     * 20万 => 最小字数为150000，最大为200000
     * 20万以上 => 最小字数为200000
     */
    switch (word) {
      case 50000: 
        minCharacterCount.value = null;
        maxCharacterCount.value = 50000;
        break;
      case 100000:
        minCharacterCount.value = 50000;
        maxCharacterCount.value = 100000;
        break;
      case 150000:
        minCharacterCount.value = 100000;
        maxCharacterCount.value = 150000;
        break;
      case 200000:
        minCharacterCount.value = 150000;
        maxCharacterCount.value = 200000;
        break;
      case 200001: 
        minCharacterCount.value = 200000;
        maxCharacterCount.value = null;
        break;
      default:
        minCharacterCount.value = null;
        maxCharacterCount.value = null;
        break;
    }
    console.log(`minCharacterCount${minCharacterCount}, maxCharacterCount${maxCharacterCount}`);
    console.log(`选择了${word}字数:`);
    selectedWord.value = word
    console.log(`当前字数${selectedWord.value}`);
    getLibraryBookList()
  };

    // 获取书籍分类
  try {
    const bookCateResult = await apiRequest(API_ENDPOINTS.CATEGORIES, {
      method: 'GET'
    });
    if (bookCateResult?.code === 200 && Array.isArray(bookCateResult.data)) {
      bookCateList.value = bookCateResult.data;
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }

  const isListLoading = ref(false);

  useSeoMeta({
    title: '全部分类 - Simurg Reader',
    description: 'Simurg Reader 精选小说分类书库，支持类型、连载状态与字数多维检索。'
  });

  const resetFilters = () => {
    selectedCategoryId.value = null;
    selectedStatus.value = null;
    selectedWord.value = null;
    minCharacterCount.value = null;
    maxCharacterCount.value = null;
    getLibraryBookList();
  };

  // 根据选择类型，获取分类书籍列表
  const getLibraryBookList = async () => { 
    isListLoading.value = true;
    try {
      const libraryBookListReq = {
        categoryId: selectedCategoryId.value,
        serialStatus: selectedStatus.value,
        minCharacterCount: minCharacterCount.value,
        maxCharacterCount: maxCharacterCount.value,
        page: 1,
        size: 10
      }
      const libraryBookListResult = await apiRequest(API_ENDPOINTS.LIST_LIBRARY_BOOKS, {
        method: 'POST',
        body: JSON.stringify(libraryBookListReq)
      });
      libraryBookList.value = libraryBookListResult?.data?.records || [];
    } catch (error) { 
      libraryBookList.value = [];
    } finally {
      isListLoading.value = false;
    }
  }

  const route = useRoute();
  onMounted(() => { 
    if (route.query.categoryId) {
      selectedCategoryId.value = route.query.categoryId;
    }
    getLibraryBookList();
  });

  watch(() => route.query.categoryId, (newId) => {
    if (newId !== undefined && String(newId) !== String(selectedCategoryId.value)) {
      selectedCategoryId.value = newId || null;
      getLibraryBookList();
    }
  });

</script>

<style lang="scss" scoped>

  .book-cate-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--color-bg-base, #131415);
  }
  .book-cate-box {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 88px 24px 60px;
    box-sizing: border-box;
    flex: 1;
  }
  .breadcrumb {
    color: #fff;
    margin-top: 16px;
  }
  .to-simurg-reader-index {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
  .book-cate-span {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #CECECE;
    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
  .book-cate-content {
    margin-top: 24px;
  }
  .book-cate-content-box {
    display: flex;
  }
  .book-cate-content-title {
    display: flex;
    flex-direction: column;
    width: 58px;
    height: 30px;
    color: #fff;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  .book-cate-content-title-shadow {
    width: 45px;
    height: 19px;
    background: rgba(246,78,5,0.6);
    filter: blur(5px);
  }
  .book-cate-item-box, .book-status-item-box, .book-word-item-box {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    // gap: 24px;
  }
  .without-div {
    width: 58px;
    height: 30px;
    height: 30px;
    border-radius: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    margin-left: 41px;
    margin-bottom: 29px;
    &:hover {
      cursor: pointer;
    }
  }
  .without-limit {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #F96E08;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    // background: linear-gradient(0deg, #F9A825 0%, #F9A825 100%);
    /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
    background: linear-gradient(0deg, #F9A825 0%, #F9A825 100%);
    /* 关键：让背景裁剪成文字形状 */
    -webkit-background-clip: text; 
    /* 文字填充色设透明，让渐变背景透出来 */
    -webkit-text-fill-color: transparent; 
    /* 兼容其他浏览器 */
    background-clip: text; 
    text-fill-color: transparent; 
  }
  .book-cate-item-box .book-cate-item ~ .book-cate-item,
  .book-status-item-box .book-status-item ~ .book-status-item,
  .book-word-item-box .book-word-item ~ .book-word-item{
    margin-left: 58px;
  }
  .book-cate-item, .book-status-item, .book-word-item {
    height: 30px;
    border-radius: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    margin-left: 41px;
    margin-bottom: 29px;
    &:hover {
      cursor: pointer;
    }
  }
  
  .book-cate-item-active , .book-status-item-active, .book-word-item-active {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #F96E08;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    // background: linear-gradient(0deg, #F9A825 0%, #F9A825 100%);
    /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
    background: linear-gradient(0deg, #F9A825 0%, #F9A825 100%);
    /* 关键：让背景裁剪成文字形状 */
    -webkit-background-clip: text; 
    /* 文字填充色设透明，让渐变背景透出来 */
    -webkit-text-fill-color: transparent; 
    /* 兼容其他浏览器 */
    background-clip: text; 
    text-fill-color: transparent; 
  }
  .book-cate-book-list {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 30px;
  }
  .book-cate-book-item {
    display: flex;
    width: 384px;
    height: 168px;
    cursor: pointer;
    border-radius: var(--radius-md, 8px);
    transition: transform var(--transition-fast, 150ms ease), background-color var(--transition-fast, 150ms ease);
    padding: 6px;
    box-sizing: border-box;

    &:hover {
      transform: translateY(-2px);
      background: var(--color-surface-hover, rgba(255, 255, 255, 0.04));
    }
  }
  .book-img {
    width: 120px;
    height: 156px;
    border-radius: var(--radius-sm, 6px);
    object-fit: cover;
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.2));
  }
  .item-book-info {
    position: relative;
    display: flex;
    flex-direction: column;
    color: #fff;
    margin-left: 12px;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    /* 核心样式 */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 限制最多显示3行 */
    -webkit-box-orient: vertical;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
    margin-top: 12px;
  }
  .book-author {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 19px;
  }
  .book-tag {
    position: absolute;
    bottom: 0;
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .book-status, .tag, .book-hot {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .devier {
    height: 10px;
    border: 1px solid #A2A0A0;
  }
  .book-status {
    left: 12px;
  }
  .no-more {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #A2A0A0;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    margin-top: 30px;
    padding-bottom: 60px;
  }

  @media (max-width: 768px) {
    .book-cate-box {
      width: 100%;
      height: auto;
      margin-left: 0;
      padding: 80px 16px 0;
    }
    .book-cate-content-box {
      flex-direction: column;
      gap: 12px;
    }
    .book-cate-content-title {
      align-items: flex-start;
      width: auto;
    }
    .book-cate-item-box,
    .book-status-item-box,
    .book-word-item-box {
      gap: 12px;
    }
    .book-cate-item,
    .book-status-item,
    .book-word-item,
    .without-div {
      margin-left: 0;
      margin-bottom: 12px;
    }
    .book-cate-item-box .book-cate-item ~ .book-cate-item,
    .book-status-item-box .book-status-item ~ .book-status-item,
    .book-word-item-box .book-word-item ~ .book-word-item {
      margin-left: 0;
    }
    .book-cate-book-list {
      flex-direction: column;
      gap: 16px;
    }
    .book-cate-book-item {
      width: 100%;
      height: auto;
      padding: 12px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
    }
    .book-img {
      width: 96px;
      height: 128px;
    }
    .book-tag {
      position: static;
      margin-top: 8px;
      flex-wrap: wrap;
    }
  }

  .is-loading-list {
    opacity: 0.6;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .cate-empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    margin: 40px auto;
    text-align: center;
    background: var(--bg-surface-1, rgba(255, 255, 255, 0.04));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
    border-radius: 16px;
    max-width: 440px;
    width: 100%;
  }

  .cate-empty-icon {
    font-size: 42px;
    margin-bottom: 14px;
  }

  .cate-empty-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary, #ffffff);
    margin-bottom: 8px;
  }

  .cate-empty-desc {
    font-size: 13px;
    color: var(--text-secondary, #90949d);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .btn-reset-filters {
    height: 36px;
    padding: 0 20px;
    border-radius: 18px;
    background: linear-gradient(135deg, #e59e2b 0%, #e06828 100%);
    color: #ffffff;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  }
</style>
