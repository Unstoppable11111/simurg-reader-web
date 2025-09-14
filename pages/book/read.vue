<template>
  <div class="reading-page">
    <div class="reading-container">
      <div class="back-book-detail"><NuxtLink class="">< {{ book.title }}</NuxtLink></div>
      <div class="book-table-content">
        <div class="book-table-title">第{{ book.tableOfContents[0].chapterNumber }}章 {{ book.tableOfContents[0].title }}</div>
        <div class="book-info-box">
          <label class="book-info-label">书名：</label>
          <div class="book-info-value book-title">{{ book.title }}</div>

          <label class="book-info-label">作者：</label>
          <div class="book-info-value book-title">{{ book.author }}</div>

          <label class="book-info-label">本章字数：</label>
          <div class="book-info-value book-title">{{ book.tableOfContents[0].wordCount }}</div>

          <label class="book-info-label">更新时间：</label>
          <div class="book-info-value book-title">{{ book.tableOfContents[0].updateDate }}</div>
        </div>
        <div class="book-delimiter"></div>
      </div>

      <div class="book-content">
        <p class="book-text">{{ book.tableOfContents[0].content }}</p>
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

// 获取路由参数
const route = useRoute()
const bookId = route.params.id
const chapterId = route.query.chapter || '1'

// 使用 useAsyncData 获取书籍数据
const { data: book } = await useAsyncData(`book-${bookId}`, () => {
  // 模拟API延迟
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: bookId,
        title: '我在精神病院学斩神',
        author: '三九',
        picUrl: 'http://www.tireba.com/simurg-reader/images/bookdeatil1.png',
        authorAvatar: 'http://www.tireba.com/simurg-reader/images/author1.png',
        authorDescription: '用心写出不一样的故事',
        wordCount: '426.4',
        readCount: '229.2',
        popularity: '1920.3',
        description: '你是否想过，在霓虹璀璨的都市之下，潜藏着来自古老神话的怪物？...',
        tableOfContents: [
          { 
            id: '1', 
            chapterNumber: 1,
            title: '初入精神病院', 
            content: '炎炎八月。\n\n滴滴滴---！\n\n刺耳的蝉鸣混杂着此起彼伏的鸣笛声，回荡在人流湍急的街道上……炎炎八月。\n\n滴滴滴---！\n\n刺耳的蝉鸣混杂着此起彼伏的鸣笛声，回荡在人流湍急的街道上……炎炎八月。\n\n滴滴滴---！\n\n刺耳的蝉鸣混杂着此起彼伏的鸣笛声，回荡在人流湍急的街道上……炎炎八月。\n\n滴滴滴---！\n\n刺耳的蝉鸣混杂着此起彼伏的鸣笛声，回荡在人流湍急的街道上……炎炎八月。\n\n滴滴滴---！\n\n刺耳的蝉鸣混杂着此起彼伏的鸣笛声，回荡在人流湍急的街道上……', 
            wordCount: '2198',
            updateDate: '2023-01-15'
          },
          { 
            id: '2', 
            chapterNumber: 2,
            title: '第二章 神秘的病人', 
            content: '超级无敌大环保在是按考虑到脑立清丸驱蚊器教科文卫起来', 
            wordCount: '1876',
            updateDate: '2023-01-16'
          },
          { 
            id: '3', 
            chapterNumber: 3,
            title: '第三章 斩神之术', 
            content: '阿斯加德你去看我就恩为契机肯', 
            wordCount: '3201',
            updateDate: '2023-01-17'
          },
          { 
            id: '4', 
            chapterNumber: 4,
            title: '第四章 黑暗降临', 
            content: '阿是就能看到卡拉奇玩呢我开启金额青蛙科技恩青蛙金卡纳', 
            wordCount: '2754',
            updateDate: '2023-01-18'
          },
          { 
            id: '5', 
            chapterNumber: 5,
            title: '第五章 绝境反击', 
            content: '阿斯蒂芬规划局快乐李主席尺码手打', 
            wordCount: '3102',
            updateDate: '2023-01-19'
          },
          { 
            id: '6', 
            chapterNumber: 6,
            title: '第六章 真相揭晓', 
            content: '阿萨德几年前我肯请问hiu额青蛙你卡了，问你前两年阿萨德模拟器', 
            wordCount: '2987',
            updateDate: '2023-01-20'
          },
          { 
            id: '7', 
            chapterNumber: 7,
            title: '第七章 新的开始', 
            content: '阿斯加德你去看哦我呢亲微机课很那青蛙科技', 
            wordCount: '3421',
            updateDate: '2023-01-21'
          },
          { 
            id: '8', 
            chapterNumber: 8,
            title: '第八章 绝境反击', 
            content: '阿斯蒂芬规划局快乐李主席尺码手打', 
            wordCount: '2876',
            updateDate: '2023-01-22'
          },
          { 
            id: '9', 
            chapterNumber: 9,
            title: '第九章 真相揭晓', 
            content: '阿萨德几年前我肯请问hiu额青蛙你卡了，问你前两年阿萨德模拟器', 
            wordCount: '3567',
            updateDate: '2023-01-23'
          }
        ]
      })
    }, 100)
  })
})

const addToBookshelf = () => { 
  console.log('添加到书架');
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