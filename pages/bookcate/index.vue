<template>
  <div class="book-cate-container">
    <Header :margin-left="'360px'"/>
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
              :class="{'book-cate-item-active' : selectedCategoryId === bookCate.categoryId}"
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
      <div class="book-cate-book-list">
        <div class="book-cate-book-item"
          v-for="book in libraryBookList">
          <img class="book-img" :src="book.coverImageUrl" :alt="book.title">
          <div class="item-book-info">
            <span class="book-title">{{ book.title }}</span>
            <span class="book-desc">【穿越+爽文】穿越成年文中的炮灰女配，带全家逆袭！穿越成年文中的炮灰女配，带全家逆袭！穿越成年文中的炮灰女配，带全家逆袭！</span>
            <span class="book-author"> 田拽拽 </span>
            <div class="book-tag">
              <span class="book-status"> {{ formatSerialStatus(book.serialStatus) }} </span>
              <div class="devier"></div>
              <span class="tag"> {{book.tag}} </span>
              <div class="devier"></div>
              <span class="book-hot">1.1万热度</span>
            </div>
          </div>
        </div> 
        
      </div>

      <div class="no-more">暂无更多内容</div>
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
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
    console.log("分类类型", bookCateResult)
    if (!bookCateResult.code === 200) {
      throw new Error(`HTTP error! status: ${bookCateResult.status}`)
    }
    
    const result = await bookCateResult
    
    if (result.code === 200 && Array.isArray(result.data)) {
      bookCateList.value = result.data;
    }
  } catch (error) {
  }

  // 根据选择类型，获取分类书籍列表
  const getLibraryBookList = async () => { 
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
      console.log("根据分类获取书籍列表内容", libraryBookListResult);
      libraryBookList.value = libraryBookListResult.data.records;
    } catch (error) { 
    }
  }

  onMounted(() => { 
    getLibraryBookList()
  })

</script>

<style lang="scss" scoped>

  .book-cate-container {
    display: flex;
    flex-direction: column;
  }
  .book-cate-box {
    width: 1200px;
    height: 292px;
    // margin: 0 auto;
    padding-top: 80px;
    margin-left: 360px;
  }
  .breadcrumb {
    color: #fff;
    margin-top: 28px;
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
  }
  .book-img {
    width: 126px;
    height: 168px;
    object-fit: cover;
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
</style>