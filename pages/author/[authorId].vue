<template>
  <div class="author-page">
    <Header :margin-left="'360px'"/>
    <div class="author-container">
      <div class="author-box">
        <img class="author-img" src="http://www.tata2025.xyz/uploads/2025/10/21/2566ebd9-91e1-4d0c-b239-9d2e89b325de.png" alt="">
        <!-- 作者信息简介开始 -->
        <div class="author-info">
          <div class="author-pen-name-box">
            <span class="author-name"> {{authorInfo.penName}} </span>
            <div class="author-tag">作家</div>
          </div>
          <span class="author-sign"> {{authorInfo.briefIntroduction}}</span>
        </div>
        <!-- 作者信息简介结束 -->

        <!-- 作者创作信息详情开始 -->
        <div class="author-detail-info">
          <div class="author-detail-item">
            <label class="author-detail-item-label">创作天数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">421</span>
              <span class="author-detail-item-unit">天</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">作品总数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value"> {{ authorInfo.bookCount }} </span>
              <span class="author-detail-item-unit">本</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">累计字数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value"> {{ authorInfo.totalCompletedWords }} </span>
              <span class="author-detail-item-unit">字</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">粉丝数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">20020</span>
              <span class="author-detail-item-unit">人</span>
            </div>
          </div>
        </div>
        <!-- 作者创作信息详情结束 -->

      </div>

      <!-- 作品列表开始 -->
    </div>

    

    <div class="author-all-book-title">
      全部作品（ {{authorInfo.bookCount}} ）
    </div>

    <div class="author-book-list">

      <div class="author-book-item">
        <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/91f22daced2b37eab5022fe3f7a8a598.jpeg" alt="">
        <div class="book-info-box">
          <span class="book-title">我在精神病院学斩神</span>
          <span class="book-author">田拽拽</span>
          <span class="book-desc">因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见</span>
          <div class="book-tag">
            <span class="book-status">连载中</span>
            <div class="devier"></div>
            <span class="book-recent-update-label">最近更新：</span>
            <span class="book-chapter-title">诡异竹筒</span>
          </div>
        </div>
        <button class="startReadBtn" @click="startRead">开始阅读</button>
        <button class="addBookShelfBtn" @click="addBookShelf">加入书架</button>
      </div>
      
      <div class="author-book-item">
        <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/91f22daced2b37eab5022fe3f7a8a598.jpeg" alt="">
        <div class="book-info-box">
          <span class="book-title">我在精神病院学斩神</span>
          <span class="book-author">田拽拽</span>
          <span class="book-desc">因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见</span>
          <div class="book-tag">
            <span class="book-status">连载中</span>
            <div class="devier"></div>
            <span class="book-recent-update-label">最近更新：</span>
            <span class="book-chapter-title">诡异竹筒</span>
          </div>
        </div>
        <button class="startReadBtn" @click="startRead">开始阅读</button>
        <button class="addBookShelfBtn" @click="addBookShelf">加入书架</button>
      </div>

      <div class="author-book-item">
        <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/91f22daced2b37eab5022fe3f7a8a598.jpeg" alt="">
        <div class="book-info-box">
          <span class="book-title">我在精神病院学斩神</span>
          <span class="book-author">田拽拽</span>
          <span class="book-desc">因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见</span>
          <div class="book-tag">
            <span class="book-status">连载中</span>
            <div class="devier"></div>
            <span class="book-recent-update-label">最近更新：</span>
            <span class="book-chapter-title">诡异竹筒</span>
          </div>
        </div>
        <button class="startReadBtn" @click="startRead">开始阅读</button>
        <button class="addBookShelfBtn" @click="addBookShelf">加入书架</button>
      </div>

      <div class="author-book-item">
        <img class="book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/91f22daced2b37eab5022fe3f7a8a598.jpeg" alt="">
        <div class="book-info-box">
          <span class="book-title">我在精神病院学斩神</span>
          <span class="book-author">田拽拽</span>
          <span class="book-desc">因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见因被渣男背刺，刚穿书就被极端CP粉一刀捅进医院。 谢弥原地发疯，在直播间口出狂言。 “来！捅我！都来捅我！我直接引爆地球——” 误入直播间的路人差点被吓晕。 好好好，见</span>
          <div class="book-tag">
            <span class="book-status">连载中</span>
            <div class="devier"></div>
            <span class="book-recent-update-label">最近更新：</span>
            <span class="book-chapter-title">诡异竹筒</span>
          </div>
        </div>
        <button class="startReadBtn" @click="startRead">开始阅读</button>
        <button class="addBookShelfBtn" @click="addBookShelf">加入书架</button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import Footer from "@/components/layout/Footer.vue";
  const route = useRoute();
  const authorId = route.params.authorId;
  const authorInfo = ref(null);
  const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}${authorId}`;
  const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
    method: 'GET'
  });
  console.log("作者信息：", authorInfoResult);
  authorInfo.value = authorInfoResult.data;

  const startRead = (bookId) => {
    console.log('开始阅读', bookId)
  }

  const addBookShelf = (bookId) => {
    console.log('加入书架', bookId)
  }

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
    background: linear-gradient( 180deg, #FFD50D 0%, #ED5B00 100%);
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
    height: 281px;
  }
  .book-img {
    width: 198px;
    height: 264px;
    border-radius: 10px;
    &:not(:valid) {
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
    -webkit-line-clamp: 3; /* 限制最多显示3行 */
    -webkit-box-orient: vertical;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
  .book-tag {
    display: flex;
    align-items: center;
    margin-top: 62px;
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
    left: 210px;
    bottom: 17px;
    width: 128px;
    height: 36px;
    background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
    border-radius: 18px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 17px;
    text-align: center;
    font-style: normal;
  }
  .startReadBtn:hover{
    z-index: 2;
    background-color: #d35400 !important;
  }
  .addBookShelfBtn {
    position: absolute;
    right: 86px;
    bottom: 17px;
    width: 128px;
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
</style>