<template>
  <div class="book-page"> 
    <Header :margin-left="'244px'" />
    <div class="book-detail-page">
      <!-- Breadcrumb navigation -->
      <div class="book-container">
        <!-- Left side - Book information -->
        <div class="breadcrumb">
          <NuxtLink to="/">首页</NuxtLink> > 
          <span>{{ book.title }}</span>
        </div>
        <div class="book-info">
          <div class="book-cover">
            <img :src="book.picUrl" :alt="book.title" />
          </div>
          
          <div class="book-content">
            <span class="book-title">{{ book.title }}</span>
            
            <div class="book-tags">
              <span class="tag completed">已完结</span>
              <span class="tag genre">都市</span>
              <span class="tag genre">签约作品</span>
              <span class="tag genre">都市玄幻</span>
            </div>
            
            <div class="book-author">
              <span>作者：{{ book.author }}</span>
            </div>
            
            <div class="book-stats">
              <span>{{ book.wordCount }}万字</span>
              <span> | </span>
              <span>{{ book.readCount }}万次浏览</span>
              <span> | </span>
              <span>{{ book.popularity }}万累计人气值</span>
            </div>
            
            <div class="book-actions">
              <button class="btn-read-now">开始阅读</button>
              <button class="btn-add-to-bookshelf">加入书架</button>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="author-info">
        <div class="author-avatar">
          <img :src="book.authorAvatar" :alt="book.author + '头像'" />
        </div>
        
        <div class="author-details">
          <h3 class="author-name">{{ book.author }}</h3>
          <p class="author-desc">{{ book.authorDescription }}</p>
        </div>
      </div>
    </div>

    <!-- 书籍简介 -->
    <div class="book-desc-container"> 
      <div class="book-desc-title">
        <div class="book-desc-title-text">简介</div>
      </div>
      <div class="book-desc-content">
        <p class="book-desc">{{ book.description }}</p>
      </div>
    </div>

    <!-- 书籍目录 -->
    <div class="book-table-container"> 
      <div class="book-table-content-title">
        <div class="book-table-content-title-text">目录</div>
      </div>
      <div class="book-table-content">
        <div class="book-table-item" v-for="(item, index) in book.tableOfContents" :key="index">
          <div class="book-table-item-title">{{ item.title }}  {{ item.content }}</div>
        </div>
      </div>

      <div class="book-table-more-container">
        <div class="btn-more">展开更多</div>
      </div>
    </div>

    <!-- 书籍内容 -->
     <div class="book-content-container"> 
      <div class="book-content-title">
        <div class="book-content-title-text">阅读</div>
      </div>
      <div class="book-content-box">
        <p class="book-text">乔绾绾被拖进灵堂，扔在棺材里的死人身上。 烛火昏暗，衬得死人的脸色更加苍白，周身萦绕着令人颤栗的恐怖气息。 乔绾绾吓得浑身哆嗦，双手撑在他冰冷坚硬的胸膛想要爬出棺材，下一秒，死人突然睁开了眼睛，一双强劲有力的手突然捁住她的腰！ “啊！”乔绾绾尖叫出声，声音颤抖，“你......你没死？” “我不会死！” 幽冷的嗓音响起，男人如觉醒的猛兽一般，掠夺了她的全部！ 疼！ 乔绾绾倒吸一口凉气，指甲狠狠扣进男人肩上的肌肉里。 恐惧和疼痛的双重折磨，她差点晕过去。 一切平息时，乔绾绾已经奄奄一息。 她听见男人贴在她的耳边说：“我会负责。” 乔绾绾抱住他的头，没等男人反应过来，就按着他的头往棺材板上狠狠一撞，“滚！去死吧你！” 她推开倒在她身上的男人，想要爬出棺材逃离，眼前却突然一黑，再也没有了知觉。 ...... 乔绾绾再次醒来的时候，有种不知今夕何夕的恍惚感。 她睁开如有千斤重的眼皮，浑身没有一个地方不难受。 网文小说诚不欺人！ 果然有种被卡车碾压过的感觉！ “醒了？” 耳边突然传来一个低沉冷冽的嗓音，吓得她一个激灵，直接惊坐而起，跟坐在轮椅上的男人四目相对。 男人一身合体剪裁的黑色西装，长着一张如鬼斧神工雕刻而出的脸。 五官深邃，鼻梁高挺，剑眉下的凤眸深不见底，精致到完美，矜贵强大的气场如同高高在上的帝王。 乔绾绾蹙眉，她怎么感觉这张脸这么眼熟呢？ 她好不容易才反应过来，急忙低头检查身上的衣服，还好，该在的都在，应该没发生什么事。 “是你把我掳来这里的？”乔绾绾质问道，“光天化日之下居然敢绑我？” 战景霆淡然道，“我接自己的妻子回家，有什么不对？” “你有病吧？谁是你的妻子！”乔绾绾掀开被子下床，强忍着身上的酸痛往外走去。 身后传来男人低沉磁性的嗓音，“看样子，昨晚我没好好尽到当丈夫的义务，才没能让你牢牢记住我。” 乔绾绾脚步一顿，猛地转头望向他。 这是昨晚棺材里的那个男人！ “原来是你！放心，你就是化成灰我也能记住你！”乔绾绾浑身的血液直冲头顶，立刻去找手机，“等着坐三年牢吧你！” 男人淡然道，“乔小姐，是你主动靠近我的。” “我是被人设计的！”乔绾绾猛然反应过来，质问道，“说，你跟乔雨琦是不是一伙的，是不是你们勾结起来害我！” “她还不配跟我勾结。”男人淡然道，“该坐牢的人应该是你。” 乔绾绾不怒反笑，“你还敢倒打一耙？” 男人不紧不慢地解开衬衫纽扣。 乔绾绾急忙捂住眼睛，“你干什么！你不要乱来啊！” “看看你的犯罪证据。”</p>
      </div>
     </div>
  <Footer />
  </div>
</template>

<script setup>
  import Header from '@/components/layout/Header.vue';
  import Footer from '@/components/layout/Footer.vue';
  // 获取路由参数
  const route = useRoute()
  const bookId = route.params.id

  // 模拟书籍数据（实际项目中应从API获取）
  // 在实际应用中，您可以使用 useAsyncData 或 useFetch 获取数据
  const { data: book } = await useAsyncData(
    `book-${bookId}`,
    () => {
      // 这里应该是API调用，例如:
      // return $fetch(`/api/books/${bookId}`)
      
      // 当前使用模拟数据
      return Promise.resolve({
        id: bookId,
        title: '我在精神病院学斩神',
        picUrl: 'http://www.tireba.com/simurg-reader/images/bookdeatil1.png',
        author: '三九',
        authorAvatar: 'http://www.tireba.com/simurg-reader/images/author1.png',
        authorDescription: '用心写出不一样的故事',
        wordCount: '426.4',
        readCount: '229.2',
        popularity: '1920.3',
        description: '你是否想过，在霓虹璀璨的都市之下，潜藏着来自古老神话的怪物？ 你是否想过，在那高悬于世人头顶的月亮之上，伫立着守望人间的神明？ 你是否想过，在人潮汹涌的现代城市之中，存在代替神明行走人间的超凡之人？ 人类统治的社会中，潜伏着无数诡异； 在那些无人问津的生命禁区，居住着古老的神明。 而属于大夏的神明，究竟去了何处？ 在这属于“人”的世界，“神秘”需要被肃清！你是否想过，在霓虹璀璨的都市之下，潜藏着来自古老神话的怪物？ 你是否想过，在那高悬于世人头顶的月亮之上，伫立着守望人间的神明？ 你是否想过，在人潮汹涌的现代城市之中，存在代替神明行走人间的超凡之人？ 人类统治的社会中，潜伏着无数诡异； 在那些无人问津的生命禁区，居住着古老的神明。 而属于大夏的神明，究竟去了何处？ 在这属于“人”的世界，“神秘”需要被肃清！',
        tableOfContents: [
          { title: '第一章 初入精神病院', content: '超级无敌大环保在是按考虑到脑立清丸驱蚊器教科文卫起来' },
          { title: '第二章 神秘的病人', content: '阿萨德科技趣闻快乐球我那么力气我卡呢网卡了去哪' },
          { title: '第三章 斩神之术', content: '阿斯加德你去看我就恩为契机肯' },
          { title: '第四章 黑暗降临', content: '阿是就能看到卡拉奇玩呢我开启金额青蛙科技恩青蛙金卡纳' },
          { title: '第五章 绝境反击', content: '阿斯蒂芬规划局快乐李主席尺码手打' },
          { title: '第六章 真相揭晓', content: '阿萨德几年前我肯请问hiu额青蛙你卡了，问你前两年阿萨德模拟器' },
          { title: '第七章 新的开始', content: '阿斯加德你去看哦我呢亲微机课很那青蛙科技' },
          { title: '第八章 绝境反击', content: '阿斯蒂芬规划局快乐李主席尺码手打' },
          { title: '第九章 真相揭晓', content: '阿萨德几年前我肯请问hiu额青蛙你卡了，问你前两年阿萨德模拟器' }
        ]

      })
    }
  )

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

<style scoped>
.book-page {
  /* max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px; 预留边距，避免内容贴边 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.book-detail-page {
  display: flex;
  background: linear-gradient( 270deg, #2E163C 0%, rgba(57,42,67,0.72) 100%);
  color: white;
  height: 358px;
  /* 背景满满屏宽 */
  width: 100vw; /* 相对于视口宽度100% */
  margin-left: calc(-50vw + 50%); /* 关键：向左偏移到屏幕边缘 */
}

.breadcrumb {
  font-size: 14px;
  color: #bdc3c7;
}

.breadcrumb a {
  color: #bdc3c7;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #e74c3c;
}

.book-container {
  display: flex;
  flex-direction: column;
  max-width: 1360px;
  margin-left: 280px;
  margin-top: 28px;
}

.book-info {
  flex: 3;
  display: flex;
  gap: 24px;
  margin-top: 28px;
}

.book-cover {
  width: 186px;
  height: 248px;
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
  font-size: 24px;
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

.tag.completed {
  background-color: #e74c3c;
  color: white;
}

.tag.genre {
  background-color: #f39c12;
  color: white;
}

.book-author {
  margin-bottom: 52px;
  font-size: 14px;
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
  bottom: 32px;
}

.btn-read-now {
  padding: 10px 20px;
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
  padding: 10px 20px;
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
  width: 1px;
  height: 196px;
  background: #fff;
  margin-top: 97px;
  margin-left: 180px;
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  text-align: center;
}

.author-name {
  font-size: 18px;
  margin-bottom: 5px;
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
  width: 1360px;
  height: 150px;
}
.book-table-container {
  width: 1360px;
  margin-top: 32px;
}
.book-content-container { 
  width: 1360px;
}
.book-desc-title, .book-table-content-title, .book-content-title {
  display: flex;
  align-items: center;
  width: 480px;
  height: 52px;
  background: linear-gradient( 135deg, #4B2960 0%, rgba(75,41,96,0) 100%);
  border-radius: 4px;
  margin-top: 66px;
}
.book-desc-title-text, .book-table-content-title-text, .book-content-title-text {
  width: 42px;
  height: 29px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 21px;
  color: #FFFFFF;
  line-height: 29px;
  text-align: left;
  font-style: normal;
   /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
  background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
  /* 关键：让背景裁剪成文字形状 */
  -webkit-background-clip: text; 
  /* 文字填充色设透明，让渐变背景透出来 */
  -webkit-text-fill-color: transparent; 
  /* 兼容其他浏览器 */
  background-clip: text; 
  text-fill-color: transparent; 
  margin-left: 10px;
}
.book-desc-content {
  /* 必须设置宽度，否则可能不生效 */
  width: 1290px; /* 可根据实际需求调整 */
  
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