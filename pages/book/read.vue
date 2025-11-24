<template>
  <div class="reading-page" ref="pageRef" :class="{'blur-effect' : showToc}" @click="handlePageClick">
    <div class="reading-container" ref="mainContentRef" :style="{ marginRight: containerMarginRight} ">
      <div class="back-book-detail"><a :href="`/book/${bookId}`">< {{ book.title }}</a></div>
      <div class="book-table-content">
        <div class="book-table-title">第{{ book.chapterNumber }}章 {{ book.chapterTitle }}</div>
        <div class="book-info-box">

          <div class="boo-info-box-div">
            <label class="book-info-label">作者：</label>
            <span class="book-info-value book-author">{{ book.authorPenName }}</span>
          </div>

          <div class="boo-info-box-div">
            <label class="book-info-label">本章字数：</label>
            <span class="book-info-value book-chapter-count">{{ book.totalCharCount }}</span>
          </div>

          <div class="boo-info-box-div">
            <label class="book-info-label">更新时间：</label>
            <span class="book-info-value book-update-time">{{ formatTimestampToYMD(book.publishDate) }}</span>
          </div>
        </div>
        <div class="book-delimiter"></div>
      </div>

      <!-- <div class="book-content" ref="bookContentRef" @mouseup="handleTextSelection" @selectstart.prevent> -->
      <div class="book-content" ref="bookContentRef" @mouseup="handleTextSelection">
        <!-- <p class="book-text">{{ chapterContent }}</p> -->
        <p
          v-for="bookParagraph in chapterContent"
          :key="bookParagraph.id"
          class="book-text"
          @click="handleParagraphClick(bookParagraph)"
        >
          {{ bookParagraph.content }}
        </p>
      </div>

      <button class="next-page-btn" @click="nextPage" @click.stop>下一页</button>


      <!-- 悬浮按钮 -->
      <div class="floating-buttons" :style="floatingButtonStyle">
        <button class="floating-btn" @click="addToBookshelf" @click.stop>
          <span class="btn-icon">📚</span>
          <span class="btn-text">加入书架</span>
        </button>
        <button class="floating-btn" @click="showTableOfContents" @click.stop>
          <span class="btn-icon">📑</span>
          <span class="btn-text">目录</span>
        </button>
        <button class="floating-btn" @click="openSettings" @click.stop>
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">设置</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 目录侧边栏 -->
  <div v-if="showToc" class="toc-sidebar" :style="{ left: sidebarLeft + 'px' }" @click.stop>
    <div class="toc-header">
      <img class="book-img" :src="book.coverImageUrl" alt="">
      <div class="table-info-box">
        <span class="table-info-book-title"> {{ book.title }} </span>
        <span class="table-info-book-status"> {{ formatSerialStatus(book.serialStatus) }} </span>
        <span class="table-info-book-author"> {{ book.authorPenName }} </span>
      </div>
    </div>
    <div class="toc-list">
      <div class="table-of-box">
        <span class="table-of-title">目录 ·  {{ chapterCount }}</span>
        <div class="sort-btn">
          <button class="sort-asc-btn" :class="{'active' : sortOrder === 'asc'}" @click="sortAsc" @click.stop>正序</button>
          <button class="sort-desc-btn" :class="{'active' : sortOrder === 'desc'}" @click="sortDesc" @click.stop>倒序</button>
        </div>
      </div>
      <div class="table-of-content-list">
        <div class="table-of-content-item"
            v-for="chapter in chapterList"
            :key="chapter.chapterNumber"
            :class="{'chapter-active' : isCurrentChapter(chapter.chapterNumber)}"
            @click="goToChapter(chapter.chapterNumber)"
            @click.stop>
          <span class="chapter-num">第{{ chapter.chapterNumber }}章</span>
          <span class="chapter-title">{{ chapter.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 蒙层遮罩 -->
  <div v-if="showToc" class="overlay" @click="closeToc"></div>

  <!-- 设置侧边栏 -->
  <div v-if="showSettings" class="settings-sidebar" :style="{ left: settingsSidebarLeft + 'px' }" @click.stop>
    <div class="close-settings" @click="closeSettings">
      x
    </div>
    <div class="settings-sidebar-title">
      设置
    </div>
    <div class="settings-bg-box">
      <div class="settings-bg-title">阅读背景</div>
      <div class="bg-one" :class="{'active-bg' : activeBackground === 'bg-one'}" @click="setBackground('bg-one')"></div>
      <div class="bg-two" :class="{'active-bg' : activeBackground === 'bg-two'}" @click="setBackground('bg-two')"></div>
      <div class="bg-three" :class="{'active-bg' : activeBackground === 'bg-three'}" @click="setBackground('bg-three')"></div>
      <div class="bg-fore" :class="{'active-bg' : activeBackground === 'bg-fore'}" @click="setBackground('bg-fore')"></div>
      <div class="bg-five" :class="{'active-bg' : activeBackground === 'bg-five'}" @click="setBackground('bg-five')"></div>
      <div class="bg-default" :class="{'active-bg' : activeBackground === 'bg-default'}" @click="setBackground('bg-default')"></div>
    </div>
    <div class="settings-font-size">
      <div class="settings-font-size-title">字体大小</div>
      <button class="settings-font-reduce" @click="decreaseFontSize">A-</button>
      <button class="settings-font-eighteen"> {{fontSize}} </button>
      <button class="settings-font-increase" @click="increaseFontSize">A+</button>
    </div>
    <div class="settings-font">
      <div class="settings-font-title">正文字体</div>
      <button class="system-font" :class="{'active-font' : activeFont === 'system'}" @click="setFont('system')">系统</button>
      <button class="black-font" :class="{'active-font' : activeFont === 'black'}" @click="setFont('black')">黑体</button>
      <button class="song-font" :class="{'active-font' : activeFont === 'song'}" @click="setFont('song')">宋体</button>
    </div>
  </div>

  <!-- 评论框展示 -->
  <div v-if="showComment" class="comment-container" :style="{ left: commentLeft + 'px' }">
    <div class="comment-box">
      <!-- 评论列表展示框 -->
      <div class="comment-list-box" v-if="haveComment">
        <div class="close-comment-box" @click="closeCommentBox">x</div>
        <div class="comment-title">评论<span class="comment-count">{{paragraphCommentList.length}}条</span></div>
        <div class="comment-item"
              v-for="(comment, index) in paragraphCommentList"
              :key="comment.commentId || index">
          <div class="author-info">
            <img class="commenter-img" :src="comment.pictureUrl" alt="">
            <span class="commenter-name">{{ comment.username }}</span>
          </div>
          <p class="comment-content">{{comment.commentText}}</p>
          <div class="comment-bottom-box">
            <span class="comment-time"> {{ formatTimestamp(comment.commentDate) }} </span>
            <!-- <button class="reply-btn">回复</button> -->
          </div>
        </div>
      </div>
      <!-- 无评论展示框 -->
      <div class="no-comment-box" v-else>
        <div class="comment-title">评论</div>
        <div class="no-comment-text">还没有人发表评论</div>
      </div>
      <!--  替换原有的 write-comment-box 部分 -->
      <div class="write-comment-container">
        <div class="write-comment-box">
          <img class="writor-img" src="http://www.tata2025.xyz/uploads/2025/10/21/2566ebd9-91e1-4d0c-b239-9d2e89b325de.png" alt=""/>
          <div class="textarea-container">
            <textarea 
              class="write-input" 
              placeholder="请写下你的想法~" 
              @input="handleCommentInput"
              :class="{ 'expanded': showSubmitBox }"
              v-model="commentText"
            ></textarea>
            
            <div class="submit-comment-box" v-show="showSubmitBox">
              <!-- <button class="emoji-box" @click="showEmoji = !showEmoji">😀</button> -->
              <ClientOnly>
               <V3Emoji ref="emojiRef" class="emoji-box" @click-emoji="onClickEmoji" :recent="true" theme="dark" :visibel="showEmojiPanel"/>
              </ClientOnly>
              <span class="upload-img"></span>
              <span class="submit-word-count">{{ commentCount }}/500</span>
              <button class="cancel-btn">取消</button>
              <button class="submit-btn" @click="handleCommentSubmit(commentText)">发表</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CryptoJS from 'crypto-js';
import { API_ENDPOINTS, apiRequest } from '@/utils/api.js'
import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
import { useAuth } from '@/composables/useAuth';
import { decryptData } from '@/utils/crypto';
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css'


const DEFAULT_SECRET_KEY = 'JTDDnc1mrUf7TOfuX+9I4A==';

// 获取路由参数
const route = useRoute()
const router = useRouter()
const bookId = route.query.book
// const chapterNumber = route.query.chapter || '1'
const chapterNumber = computed(() => route.query.chapter || '1')
const book = ref({})
const chapterContent = ref('')
const showToc = ref(false)
const showSettings = ref(false)
const showComment = ref(false)
const haveComment = ref(false)
const paragraphCommentList = ref([])
const mainContentRef = ref(null)
const pageRef = ref(null)
const bookContentRef = ref(null)
const sidebarLeft = ref(0)
const settingsSidebarLeft = ref(0)
const commentLeft = ref(0)
const chapterCount = ref(0)
const chapterList = ref([])
const sortOrder = ref('asc')
const activeBackground = ref('bg-default')
const backgroundConfigs = {
  'bg-one': {
    pageBg: '#e3dada',
    contentBg: '#ede1e1',
    textColor: '#343434'
  },
  
  'bg-two': {
    pageBg: '#c3d1d9',
    contentBg: '#D5E2E9',
    textColor: '#343434'
  },

  'bg-three': {
    pageBg: '#DACEAE',
    contentBg: '#EADFC1',
    textColor: '#343434'
  },

  'bg-fore': {
    pageBg: '#C5D9BB',
    contentBg: '#D2E3CA',
    textColor: '#343434'
  },

  'bg-five': {
    pageBg: '#E0BCBD',
    contentBg: '#F0CDCE',
    textColor: '#343434'
  },

  'bg-default': {
    pageBg: '#171617',
    contentBg: '#262626',
    textColor: '#A2A0A0'
  }

}
const activeFont = ref('system')
const fontFamilies = {
  'system': 'PingFangSC, PingFang SC',
  'black': '黑体, SimHei',
  'song': '宋体, SimSun'
}
const fontSize = ref(18)
const minFontSize = 12
const maxFontSize = 48
const fontSizeStep = 2
const lineHeight = ref(25); // 初始行高值
const lineHeightStep = 2; // 行高步进值
// 添加段评相关状态
const selectedParagraph = ref(null);
const showParagraphComment = ref(false);
const selectedText = ref('')
const selectionStart = ref(0)
const selectionEnd = ref(0)
const showCommentBox = ref(false)
const commentContent = ref('')
const showSubmitBox = ref(true);
const commentText = ref('');
const commentCount = computed(() => {
  return commentText.value.length
})
const {isLoggedIn, isAuthor, userAvatar, userName} = useAuth();
const emojiRef = ref(null)
const showEmojiPanel = ref(true)
watch(isLoggedIn, (newVal) => {
  console.log('isLoggedIn changed to:', newVal);
}, { immediate: true });

// 章节内容分割函数
function splitChapterContent(content) { 
  if (!content) return [];
  // 按照段落分隔符分割内容（设立假设段落之间有换行符)
  const paragraphs = content.split('\\n');
  console.log("分割后的段落========");
  console.log(paragraphs)
  let currentPosition = 0;
  return paragraphs.map((text, index) => {
    const paragraph = {
      id: index,
      content: text,
      startIndex: currentPosition,
      endIndex: currentPosition + text.length
    };
    // 更新位置指针，包括换行符的长度
    currentPosition += text.length + 1;
    return paragraph;
  });

}

// 增加字体大小
const increaseFontSize = () => { 
  if (fontSize.value < maxFontSize) {
    fontSize.value = Math.min(fontSize.value + fontSizeStep, maxFontSize)
    lineHeight.value = Math.min(lineHeight.value + lineHeightStep, maxFontSize + 7); // 保持一定的行高间距
    applyFontSize();
    applyFontSizeAndLineHeight();
  }
}

// 减少字体大小
const decreaseFontSize = () => {
  if (fontSize.value > minFontSize) {
    fontSize.value = Math.max(fontSize.value - fontSizeStep, minFontSize);
    lineHeight.value = Math.max(lineHeight.value - lineHeightStep, minFontSize + 10); // 最小行高限制
    applyFontSize();
    applyFontSizeAndLineHeight();
  }
}

// 应用字体大小到阅读内容
const applyFontSize = () => {
  if (mainContentRef.value) {
    const bookTextElements = mainContentRef.value.querySelectorAll('.book-text')
    bookTextElements.forEach(element => {
      element.style.fontSize = `${fontSize.value}px`
    })
  }
}

// 修改 applyFontSize 函数为 applyFontSizeAndLineHeight
const applyFontSizeAndLineHeight = () => {
  if (mainContentRef.value) {
    const bookTextElements = mainContentRef.value.querySelectorAll('.book-text');
    bookTextElements.forEach(element => {
      element.style.fontSize = `${fontSize.value}px`;
      element.style.lineHeight = `${lineHeight.value}px`;
    });
  }
};

const fetchChapterContent = async (chapterNum) => { 
  try {
    const getChapterDetailReq = {
      bookId: bookId,
      chapterNumber: chapterNum || chapterNumber,
    }
    const getChapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
        method: "POST",
        body: JSON.stringify(getChapterDetailReq),
    });
    console.log("获取书籍详情信息结果：｛｝", getChapterDetailResult);
    if (getChapterDetailResult.code === 200) {
      book.value = getChapterDetailResult.data;
      const decryptedContent = decryptData(book.value.chapterContent);
      chapterContent.value = splitChapterContent(decryptedContent);
    }
    return book.value;
  }catch (error){
  }
}
fetchChapterContent(chapterNumber.value)

/**
 * 获取所有已发布的章节信息
 */
const fetchAllPublishedChapters = async () => { 
  try {
    const listPublishedChaptersReq = {
      bookId: bookId,
      orderDirection: sortOrder.value,
      page: 1,
      size: 10
    }
    const listPublishedChaptersResult = await apiRequest(API_ENDPOINTS.LIST_PUBLISHED_CHAPTERS, {
        method: "POST",
        body: JSON.stringify(listPublishedChaptersReq),
    });
    console.log("获取所有已发布的章节信息结果：｛｝", listPublishedChaptersResult);
    console.log("获取所有已发布的章节信息结果records：｛｝", listPublishedChaptersResult.data.records);
    if (listPublishedChaptersResult.code === 200) {
      chapterCount.value = listPublishedChaptersResult.data.records.length;
      chapterList.value = listPublishedChaptersResult.data.records;
    }
  } catch (error){
  }
}

// 处理文本选择事件
const handleTextSelection = (event) => {
  const selection = window.getSelection()
  if (selection && selection.toString().trim()) {
    selectedText.value = selection.toString()
    const range = selection.getRangeAt(0)
    
    // 获取选中文本在父元素中的相对位置
    const bookTextElement = bookContentRef.value.querySelector('.book-text')
    if (bookTextElement) {
      const preSelectionRange = document.createRange()
      preSelectionRange.selectNodeContents(bookTextElement)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      
      selectionStart.value = preSelectionRange.toString().length
      selectionEnd.value = selectionStart.value + selectedText.value.length
      console.log(`selectedText=${selectedText.value}, selectionStart=${selectionStart.value}, selectionEnd=${selectionEnd.value}`);
      showCommentBox.value = true
    }
  }
}

const handleParagraphClick = (paragraph) => {
  console.log('点击段落:', paragraph);
  console.log(`段落范围: ${paragraph.startIndex} - ${paragraph.endIndex}`);
  selectedParagraph.value = paragraph;
  showParagraphComment.value = true;
  // 打开评论弹框
  showComment.value = true;
  // TODO: 获取当前段落评论数据
  fetchParagraphComments(selectedParagraph.value);
}

const fetchParagraphComments = async (paragraph) => { 
  // api=/comment/list_with_paragraph
  try {
    const listWithParagraphReq = {
      "bookId": bookId,
      "chapterId": book.value.chapterId,
      "paragraphStartPos": paragraph.startIndex,
      "paragraphEndPos": paragraph.endIndex,
      "page": 1,
      "size": 10
    }
    console.log("获取段落评论请求参数：", listWithParagraphReq);
    const listWithParagraphResult = await apiRequest(API_ENDPOINTS.LIST_COMMENTS, {
      method: "POST",
      body: JSON.stringify(listWithParagraphReq),
    });
    console.log("获取段落评论结果：｛｝", listWithParagraphResult);
    if (listWithParagraphResult.code === 200 && listWithParagraphResult.data) {
      if (listWithParagraphResult.data.size > 0) {
        paragraphCommentList.value = listWithParagraphResult.data.records
        haveComment.value = true;
      } else {
        paragraphCommentList.value = [];
        haveComment.value = false;
      }
    } else {
      paragraphCommentList.value = [];
      haveComment.value = false;
    }
  } catch (error) { 
    console.error("获取段落评论失败：", error);
    paragraphCommentList.value = [];
    haveComment.value = false;
  }
}

const nextPage = async() => { 
  console.log("获取下一页内容");
}

const floatingButtonStyle = computed(() => {
  if (showComment.value) {
    // 当评论框显示时，悬浮按钮应在评论框右边20px
    return {
      right: '-488px',
      top: '50%',
      transform: 'translateY(-50%)'
    };
  } else {
    // 当评论框不显示时，使用原来的位置
    return {
      right: '-88px',
      top: '50%',
      transform: 'translateY(-50%)'
    };
  }
})

const addToBookshelf = async() =>{
  console.log(isLoggedIn.value)
  if (!isLoggedIn.value) {
    const currentPath = router.currentRoute.value.fullPath;
    console.log(isLoggedIn.value);
    console.log('当前路径：', currentPath);
    router.push(`/login?redirectPath=${encodeURIComponent(currentPath)}`);
    return;
  }
  // 获取当前书籍的 bookId
  console.log('当前书籍id：', bookId);
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
    if (response.code === 2008) {
      router.push(`/login?redirectPath=${encodeURIComponent(router.currentRoute.value.fullPath)}`);
    } else if (response.code === 200) {
      alert("已添加到书架");
    }
  } catch (error) {
    console.error('Error adding book to favorite:', error);
  }
  
}

const showTableOfContents = () => { 
  showToc.value = true
  console.log('显示目录');
}

const closeToc = () => { 
  showToc.value = false
  console.log('关闭目录');
}

// 点击设置
const openSettings = () => { 
  showSettings.value = true
}

// 关闭设置
const closeSettings = () => { 
  showSettings.value = false
}

const handlePageClick = (event) => { 
  console.log('点击页面');
  if (showToc.value) {
    closeToc();
  }
  if (showSettings.value) {
    closeSettings();
  }
}

const containerMarginRight = computed(() => { 
  // return showComment.value ? '400px' : '0'
})

const goToChapter = async (chapterNumber) => { 
  console.log("跳转到章节：", chapterNumber);
  const newUrl = `/book/read?book=${bookId}&chapter=${chapterNumber}`
  await router.push(newUrl)
  await fetchChapterContent(chapterNumber);
  closeToc();
}

const sortAsc = async () => {
  console.log("获取章节内容升序");
  sortOrder.value = 'asc'
  await fetchAllPublishedChapters();
}

const sortDesc = async () => { 
  console.log("获取章节内容降序");
  sortOrder.value = 'desc'
  await fetchAllPublishedChapters();
}

const setBackground = (bgClass) => { 
  activeBackground.value = bgClass
  const config = backgroundConfigs[bgClass]
  // 应用背景色到阅读容器
  if (pageRef.value) {
    pageRef.value.style.backgroundColor = config.pageBg
  }

  // 应用主视图背景色
  if (mainContentRef.value) {
    mainContentRef.value.style.backgroundColor = config.contentBg
  }

  if (bookContentRef.value) {
    bookContentRef.value.style.backgroundColor = config.contentBg
  }

  // 应用字体颜色
  if (mainContentRef.value) {
    const bookTextElements = mainContentRef.value.querySelectorAll('.book-text')
    bookTextElements.forEach(element => {
      element.style.color = config.textColor
    })
  }
}

const setFont = (fontClass) => { 
  activeFont.value = fontClass
  // 应用字体到阅读内容
  if (mainContentRef.value) {
    const bookTextElements = mainContentRef.value.querySelectorAll('.book-text')
    bookTextElements.forEach(element => {
      element.style.fontFamily = fontFamilies[fontClass]
    })
  }
}
const closeCommentBox = () => { 
  showComment.value = false
}
const handleCommentInput = (event) => { 
  commentText.value = event.target.value
}

const onClickEmoji = (val) => {
  commentText.value += val
   // 尝试通过 ref 调用组件的关闭方法
  if (emojiRef.value && typeof emojiRef.value.hide === 'function') {
    emojiRef.value.hide()
  }
  // 或者尝试其他可能的关闭方法
  if (emojiRef.value && typeof emojiRef.value.close === 'function') {
    emojiRef.value.close()
  }
}

const handleCommentSubmit = async (userComment) => { 
  console.log("提交评论：", userComment);
  try {
    const addCommentReq = {
      bookId: bookId,
      chapterId: book.value.chapterId,
      commentText: userComment,
      paragraphStartPos: selectedParagraph.value.startIndex,
      paragraphEndPos: selectedParagraph.value.endIndex,
      quotedText: selectedParagraph.value.content
    }
    console.log("添加评论请求参数：", addCommentReq);
    const addCommentResult = await apiRequest(API_ENDPOINTS.ADD_COMMENT, {
      method: "POST",
      body: JSON.stringify(addCommentReq),
    });
    console.log("添加评论结果：",addCommentResult);
    if (addCommentResult.code === 2008) {
      router.push(`/login?redirectPath=${encodeURIComponent(router.currentRoute.value.fullPath)}`);
    }
    if (addCommentResult.code === 200) {
      alert("评论添加成功");
      commentText.value = ''
      await fetchChapterContent(book.value.chapterNumber)
    } else {
      alert("评论添加失败");
    }
  } catch (error) { 
  }
}

// 判断当前章节是否为当前章节
const isCurrentChapter = (chapterNum) => { 
  return parseInt(chapterNum) === parseInt(chapterNumber.value)
}

// 计算并设置目录位置的函数
const setSidebarPosition = async() => {
  if (mainContentRef.value) {
    const mainRect = mainContentRef.value.getBoundingClientRect();
    sidebarLeft.value = mainRect.right - 407; // 目录左侧 = 主视图右侧
    settingsSidebarLeft.value = mainRect.right - 343;
    commentLeft.value = mainRect.right;
    console.log("目录位置：", sidebarLeft.value);
    console.log("设置位置：", settingsSidebarLeft.value);
    console.log("评论位置：", commentLeft.value);
  }
};

// 初始化：组件挂载后计算位置
onMounted(async () => {
  if (!bookId) {
    console.log("BookId is missing.");
    return;
  }
  try {
    const getChapterDetailReq = {
      bookId: bookId,
      chapterNumber: chapterNum || chapterNumber,
    }
    const getChapterDetailResult = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
        method: "POST",
        body: JSON.stringify(getChapterDetailReq),
    });
    console.log("获取书籍详情信息结果：｛｝", getChapterDetailResult);
    if (getChapterDetailResult.code === 200) {
      book.value = getChapterDetailResult.data;
    }
  }catch (error){
  }
  await fetchChapterContent(chapterNumber);
  await fetchAllPublishedChapters();
  nextTick(setSidebarPosition); // 确保 DOM 渲染完成后执行
  // 监听滚动和 resize 事件
  // window.addEventListener('scroll', setSidebarPosition);
  // window.addEventListener('resize', setSidebarPosition);
  // 设置监听器
  watch(
    () => chapterNumber,
    async (newChapter, oldChapter) => {
      if (newChapter !== oldChapter) {
        await fetchChapterContent(newChapter);
      }
    },
    { immediate: true }
  )
   watch(
    () => mainContentRef.value?.getBoundingClientRect().right,
    () => {
      setSidebarPosition();
    }
  )
});

// 组件卸载时移除事件监听（避免内存泄漏）
onUnmounted( () => {
  window.removeEventListener('scroll', setSidebarPosition);
  window.removeEventListener('resize', setSidebarPosition);
});

watch(
  () => route.query.book,
  async (newBookId) => {
    if (newBookId) {
      await fetchChapterContent(bookId.value);
    }
  },
  { immediate: true } // 立即执行一次
)

</script>

<style scoped lang="scss">
.reading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.blur-effect {
  filter: blur(8px);
}
.reading-container {
  width: 800px;
  height: 100vh;
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
  font-size: 12px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.book-table-content {
  width: 800px;
}
.book-table-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
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
  gap: 40px;
}
.boo-info-box-div {
  display: flex;
}
.book-info-label { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #636363;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.book-info-value {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.book-title, .book-author, .book-chapter-count, .book-update-time {
  &:hover {
    cursor: pointer;
    color: #F96E08;
  }
}
.book-delimiter {
  width: 800px;
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
  width: 800px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  background: #262626;
}
.book-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.next-page-btn {
  width: 118px;
  height: 36px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  margin-top: 18px;
}
.chapter-header {
  text-align: center;
  margin-bottom: 40px;
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
  padding: 0 50px;
  line-height: 20px;
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

  .book-text {
    font-size: 16px;
  }
}
/* 悬浮按钮样式 */
.floating-buttons {
  position: absolute;
  // right: -88px;
  // top: 50%;
  // transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.floating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333;
  border: none;
  cursor: pointer;
  width: 68px;
  height: 68px;
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
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}

/* 响应式 */
@media (max-width: 768px) {
  .reading-container {
    width: 90%;
    padding: 20px;
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


/* 目录侧边栏 */
.toc-sidebar {
  position: fixed;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #343434;
  color: #e0e0e0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.toc-header {
  display: flex;
  width: 340px;
  height: 72px;
  margin-top: 42px;
}
.book-img {
  width: 54px;
  height: 72px;
  object-fit: cover;
  margin-left: 30px;
  border-radius: 4px;
}
.table-info-box {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.table-info-book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 4px;
}
.table-info-book-status {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #A2A0A0;
  line-height: 14px;
  text-align: left;
  font-style: normal;
  margin-top: 7px;
}
.table-info-book-author {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 6px;
}
.toc-list {
  margin-top: 40px;
  margin-left: 30px;
}
.table-of-box {
  position: relative;
}
.table-of-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}
.sort-btn {
  position: absolute;
  right: 30px;
  width: 86px;
  height: 24px;
  background: #242424;
  border-radius: 16px;
  text-align: center;
}
.sort-asc-btn, .sort-desc-btn {
  position: absolute;
  width: 44px;
  height: 24px;
  border-radius: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 24px;
  text-align: center;
  font-style: normal;
  z-index: 2;
  border: none;
  cursor: pointer;
  
  &.active {
    background: linear-gradient(90deg, #FF9B51 0%, #ED5B00 100%);
    color: #000000;
  }
}
.sort-asc-btn {
  right: 42px;
}

.sort-desc-btn {
  right: 0px;
}
.table-of-content-list {
  display: flex;
  flex-direction: column;
  // gap: 38px;
  margin-top: 38px;
  overflow-y: auto;
  padding-right: 30px;
  box-sizing: border-box;
}
.toc-list::-webkit-scrollbar {
  width: 15px; /* 滚动条宽度 */
  margin-right: -30px; /* 关键：滚动条向右“负偏移”30px，视觉上向左移动 */
}
/* 自定义滚动条样式（WebKit内核浏览器） */
.toc-list::-webkit-scrollbar {
  width: 15px; /* 滚动条宽度 */
  margin-right: -30px; /* 关键：滚动条向右“负偏移”30px，视觉上向左移动 */
}
.toc-list::-webkit-scrollbar-thumb {
  background: #888;
  height: 40px; /* 固定高度 */
  border-radius: 9px;
}

.table-of-scroll {
  display: flex;
  flex-direction: column;
  gap: 38px;
  margin-top: 38px;
    /* 滚动条整体样式 */
  --el-scrollbar-width: 8px;
  --el-scrollbar-track-background: rgba(255, 255, 255, 0.05);
  --el-scrollbar-thumb-background: #F96E08;
  --el-scrollbar-thumb-hover-background: #FF9B51;
  --el-scrollbar-thumb-active-background: #ED5B00;
  
  /* 滚动条圆角 */
  --el-scrollbar-thumb-border-radius: 4px;
  
  /* 滚动条透明度 */
  --el-scrollbar-opacity: 0.8;
}
.table-of-content-item {
  margin-bottom: 38px;
}
.chapter-active {
  color: #F96E08;
}
.chapter-title {
  margin-left: 12px;
  &:hover {
    cursor: pointer;
  }
}
.book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.toc-title {
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}

.toc-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #2d2d2d;
}

.toc-item:hover {
  background-color: #2d2d2d;
}

.toc-item.active {
  background-color: #3c3c3c;
  color: #f96e08;
}

// 设置样式
.settings-sidebar { 
  width: 336px;
  height: 260px;
  background: #343434;
  position: fixed;
  top: 416px;
}
.close-settings {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 12px;
  height: 12px;
  line-height: 8px;
  text-align: center;
  background: #535353;
  color: #979797;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
}
.settings-sidebar-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  margin: 42px 0 0 30px;
}
.settings-bg-box {
  width: 252px;
  height: 24px;
  display: flex;
  margin: 32px 0 0 30px;
}
.settings-bg-title {
  width: 48px;
  height: 17px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 24px;
  text-align: left;
  font-style: normal;
}
.bg-one, .bg-two, .bg-three, .bg-fore, .bg-five, .bg-default {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 8px;
}
.bg-one {
  background: #E3DADA;
  margin-left: 18px;
}
.bg-two {
  background: #C3D1D9;
}
.bg-three {
  background: #DACEAE
}
.bg-fore {
  background: #DDEAD7;
}
.bg-five {
  background: #F0CDCE;
}
.bg-default {
  background: #171617;
}
.active-bg {
  border: 1px solid #F96E08;
  text-align: center;
  &:after {
    content: "✓";
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #F96E08;
    font-weight: bold;
    line-height: 1;
  }
}
.settings-font-size {
  width: 250px;
  height: 30px;
  display: flex;
  align-items: center;
  margin: 20px 0 0 30px;
}
.settings-font-size-title {
  width: 48px;
  height: 17px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.settings-font-reduce {
  width: 60px;
  height: 30px;
  border-radius: 6px 0px 0px 6px;
  border: 1px solid #646261;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
  margin-left: 18px;
}
.settings-font-eighteen {
  width: 64px;
  height: 30px;
  border: 1px solid #646261;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}
.settings-font-increase {
  width: 60px;
  height: 30px;
  border-radius: 0px 6px 6px 0px;
  border: 1px solid #646261;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}
.settings-font {
  width: 250px;
  height: 30px;
  display: flex;
  align-items: center;
  margin: 20px 0 0 30px;
}
.settings-font-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.system-font, .black-font, .song-font {
  width: 56px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #646261;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  text-align: center;
  font-style: normal;
  margin-left: 8px;
}
.system-font {
  margin-left: 18px;
}
.active-font {
  border: 1px solid #F96E08;
  color: #F96E08;
}
/* 蒙层 */
 overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.comment-container {
  position: fixed;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #262626;
  border-left: 1px solid #636363;
}
.comment-box {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.comment-list-box {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px; // 为底部评论输入框留出空间
  margin-bottom: 120px; // 避免被底部输入框遮挡
}
.close-comment-box {
  position: absolute;
  top: 20px;
  right: 32px;
  width: 18px;
  height: 18px;
  background: #535353;
  text-align: center;
  line-height: 18px;
  background: #D8D8D8;
  border-radius: 1px;
  border: 1px solid #979797;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
}
.no-comment-box {
  width: 400px;
  height: 100vh;
}
.comment-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #D5D5D5;
  line-height: 25px;
  text-align: left;
  font-style: normal;
  margin: 44px 0 0 32px;
}
.comment-count {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #737373;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-left: 6px;
}
.comment-item {
  position: relative;
  width: 321px;
  margin: 32px 0 0 32px;
}
.author-info {
  display: flex;
  align-items: center;
}
.commenter-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.commenter-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-left: 10px;
}
.comment-bottom-box {
  padding-bottom: 12px;
  margin-left: 36px;
}
.comment-content {
  margin-left: 36px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #D5D5D5;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.comment-time {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #A2A0A0;
  line-height: 14px;
  text-align: left;
  font-style: normal;
}
.reply-btn {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: rgba(249,110,8,0.65);
  line-height: 14px;
  text-align: left;
  font-style: normal;
  margin-left: 10px;
}
.like-icon {
  position: absolute;
  right: 62px;
  bottom: 12px;
  line-height: 14px;
}
.like-btn {
  position: absolute;
  right: 38px;
  bottom: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #A2A0A0;
  line-height: 14px;
  text-align: left;
  font-style: normal;
}
.unlike-icon {
  position: absolute;
  right: 0;
  bottom: 12px;
  line-height: 14px;
}
.no-comment-text { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 75vh;
  text-align: center;
  font-style: normal;
}
.write-comment-container {
  position: absolute;
  bottom: 0;
  width: 400px;
  height: 120px;
  background: #414141;
}
.write-comment-box { 
  display: flex;
  align-items: center;
}
.textarea-container {
  position: relative;
  width: 286px;
  margin: 18px 0 0 12px;
}
.writor-img {
  width: 38px;
  height: 38px;
  margin: 18px 0 0 32px;
  border-radius: 50%;
}
.write-input {
  width: 100%;
  min-height: 38px; // 改为最小高度
  line-height: 17px;
  background: #656565;
  border-radius: 8px;
  color: #D5D5D5;
  padding: 10px; // 添加内边距
  box-sizing: border-box;
  resize: none; // 禁止用户手动调整大小
  border: none;
  outline: none;
  
  &.expanded {
    min-height: 80px; // 焦点时的高度，可容纳三行文字
  }
  
  &::placeholder {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #D5D5D5;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
}

.submit-comment-box {
  position: absolute;
  left: 12px;
  bottom: 10px; // 距离底部的距离
  display: flex;
  align-items: center;
  gap: 10px;
}
.emoji-box {
  width: 16px;
}
.submit-word-count {
  position: absolute;
  left: 121px;
  bottom: 7px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #D5D5D5;
  line-height: 14px;
  text-align: left;
  font-style: normal;
}
.cancel-btn {
  position: absolute;
  left: 162px;
  width: 44px;
  height: 22px;
  background: rgba(174,174,174,0.6);
  border-radius: 4px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #E9E9E9;
  line-height: 22px;
  text-align: center;
  font-style: normal;
}
.submit-btn {
  position: absolute;
  left: 230px;
  width: 44px;
  height: 22px;
  background: rgba(249,110,8,0.65);
  border-radius: 4px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #D5D5D5;
  line-height: 22px;
  text-align: center;
  font-style: normal;
}

/* 滚动条整体宽度（垂直滚动条） */
::-webkit-scrollbar {
  width: 15px; /* 滑块宽度，根据设计调整 */
}

/* 滚动条轨道（背景） */
::-webkit-scrollbar-track {
  background: #333; /* 深色轨道背景 */
}

/* 滚动条滑块（可拖动部分） */
::-webkit-scrollbar-thumb {
  background: #1A1A1A;
  border-radius: 8px;
  transition: background 0.2s;
  height: 34px;
}

/* 滑块 hover 效果 */
::-webkit-scrollbar-thumb:hover {
  background: #777; /* hover 时的亮色 */
}

/* 隐藏滚动条两端的箭头按钮 */
::-webkit-scrollbar-button {
  display: none;
}
</style>