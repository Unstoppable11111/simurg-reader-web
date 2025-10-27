<template>
  <div class="book-page"> 
    <Header :margin-left="'244px'" />
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
            <span>作者：{{ book.authorPenName }}</span>
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
          <img :src="book.authorPictureUrl" alt="" />
          <div class="author-info-container">
            <div class="author-info-box">
              <span class="author-name">{{ book.authorPenName }}</span>
              <span class="author-tag">作家</span>
            </div>
            <span class="btn-follow">+关注</span>
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
            <div class="book-table-item-title">第{{ item.chapterNumber }}章：  {{ item.chapterTitle }}</div>
          </div>
        </div>

        <div class="book-table-more-container">
          <div class="btn-more">展开更多</div>
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
          <p class="book-text">乔绾绾被拖进灵堂，扔在棺材里的死人身上。 烛火昏暗，衬得死人的脸色更加苍白，周身萦绕着令人颤栗的恐怖气息。 乔绾绾吓得浑身哆嗦，双手撑在他冰冷坚硬的胸膛想要爬出棺材，下一秒，死人突然睁开了眼睛，一双强劲有力的手突然捁住她的腰！ “啊！”乔绾绾尖叫出声，声音颤抖，“你......你没死？” “我不会死！” 幽冷的嗓音响起，男人如觉醒的猛兽一般，掠夺了她的全部！ 疼！ 乔绾绾倒吸一口凉气，指甲狠狠扣进男人肩上的肌肉里。 恐惧和疼痛的双重折磨，她差点晕过去。 一切平息时，乔绾绾已经奄奄一息。 她听见男人贴在她的耳边说：“我会负责。” 乔绾绾抱住他的头，没等男人反应过来，就按着他的头往棺材板上狠狠一撞，“滚！去死吧你！” 她推开倒在她身上的男人，想要爬出棺材逃离，眼前却突然一黑，再也没有了知觉。 ...... 乔绾绾再次醒来的时候，有种不知今夕何夕的恍惚感。 她睁开如有千斤重的眼皮，浑身没有一个地方不难受。 网文小说诚不欺人！ 果然有种被卡车碾压过的感觉！ “醒了？” 耳边突然传来一个低沉冷冽的嗓音，吓得她一个激灵，直接惊坐而起，跟坐在轮椅上的男人四目相对。 男人一身合体剪裁的黑色西装，长着一张如鬼斧神工雕刻而出的脸。 五官深邃，鼻梁高挺，剑眉下的凤眸深不见底，精致到完美，矜贵强大的气场如同高高在上的帝王。 乔绾绾蹙眉，她怎么感觉这张脸这么眼熟呢？ 她好不容易才反应过来，急忙低头检查身上的衣服，还好，该在的都在，应该没发生什么事。 “是你把我掳来这里的？”乔绾绾质问道，“光天化日之下居然敢绑我？” 战景霆淡然道，“我接自己的妻子回家，有什么不对？” “你有病吧？谁是你的妻子！”乔绾绾掀开被子下床，强忍着身上的酸痛往外走去。 身后传来男人低沉磁性的嗓音，“看样子，昨晚我没好好尽到当丈夫的义务，才没能让你牢牢记住我。” 乔绾绾脚步一顿，猛地转头望向他。 这是昨晚棺材里的那个男人！ “原来是你！放心，你就是化成灰我也能记住你！”乔绾绾浑身的血液直冲头顶，立刻去找手机，“等着坐三年牢吧你！” 男人淡然道，“乔小姐，是你主动靠近我的。” “我是被人设计的！”乔绾绾猛然反应过来，质问道，“说，你跟乔雨琦是不是一伙的，是不是你们勾结起来害我！” “她还不配跟我勾结。”男人淡然道，“该坐牢的人应该是你。” 乔绾绾不怒反笑，“你还敢倒打一耙？” 男人不紧不慢地解开衬衫纽扣。 乔绾绾急忙捂住眼睛，“你干什么！你不要乱来啊！” “看看你的犯罪证据。”</p>
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
  // 获取路由参数
  const route = useRoute()
  const router = useRouter();
  const bookId = route.params.id
  const chapterList = ref([]);

  // 模拟书籍数据（实际项目中应从API获取）
  // 在实际应用中，您可以使用 useAsyncData 或 useFetch 获取数据
  const url = new URL(`${API_ENDPOINTS.BOOK_DETAIL}/${bookId}`);
  console.log("请求的url地址", url);
  const {data: book} = await apiRequest(url);
  console.log("书籍内容",book);

  // 获取书籍的所有章节内容
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
    }
  } catch (error) {
    console.error('Error fetching book data:', error);
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

  const startReading = async() => {
      router.push(`/book/read?book=${bookId}&chapter=1`);
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

  // 如果需要在客户端获取数据，可以使用 useFetch
  // const { data: book } = await useFetch(`/api/books/${bookId}`)
</script>

<style lang="scss" scoped>
.book-page {
  /* max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px; 预留边距，避免内容贴边 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.book-detail-page {
  position: relative;
  display: flex;
  color: white;
  height: 358px;
  /* 背景满满屏宽 */
  width: 100vw; /* 相对于视口宽度100% */
  /* margin-left: calc(-50vw + 50%);  */
  /* 关键：向左偏移到屏幕边缘 */
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
  color: #e74c3c;
}

/* .book-container {
  display: flex;
  max-width: 1200px;
  margin-left: 360px;
  margin-top: 40px;
} */

.book-info {
  position: absolute;
  top: 88px;
  left: 360px;
  display: flex;
  gap: 24px;
}

.book-cover {
  width: 168px;
  height: 244px;
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
}
.book-desc-box, .book-table-box, .book-content-box {
  margin-left: 360px;
}
.book-table-container {
  position: relative;
  width: 100vw;
  margin-top: 32px;
}
.book-content-container { 
  position: relative;
  width: 100vw;
}
.book-desc-title, .book-table-content-title, .book-content-title {
  /* display: flex;
  align-items: center;
  width: 480px;
  height: 52px;
  background: linear-gradient( 270deg, rgba(254,92,84,0) 0%, #F1951E 100%);
  border-radius: 4px;
  margin-top: 66px; */
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
  font-size: 24px;
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
  font-size: 18px;
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
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-table-more-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.btn-more {
  width: 128px;
  height: 32px;
  border-radius: 18px;
  border: 1px solid #F96C05;
  color: #F96C05;
  text-align: center;
  line-height: 32px;
}
.book-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: justify;
  font-style: normal;
}
</style>