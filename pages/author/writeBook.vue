<template>
  <div class="write-book-page">
    <div class="write-book-header-box">
      <div class="back-btn" @click="goBack"><</div>
      <div class="write-book-info-box">
        <span class="book-title">{{ bookData?.title || '加载中...'}}</span>
        <div class="book-info-box">
          <span>上一章 您还没有发布章节，开始创建第一章吧！</span>
          <span class="work-count">当前字数：{{ bookWordCount }}</span>
        </div>
      </div>
      <button class="save-draft-btn" @click="saveDraft">存草稿</button>
      <button class="publish-btn" @click="publishBook">发布</button>
    </div>

    <div class="wirte-book-main-box">
      <div class="write-book-chapter-box">
        <span class="chapter-info">第 <input class="chapter-num-input" type="number" v-model="chapterNumber" disabled> 章</span>
        <input class="chapter-title-input" type="text" placeholder="请输入标题" v-model="chapterTitle" @input="onContentChange">
      </div>
      <textarea class="write-book-textarea" placeholder="请输入内容" v-model="chapterContent" @input="onContentChange"></textarea>
      <div class="author-note-box">
        <span class="author-note-title">作者有话说</span>
        <textarea class="author-note-textarea" placeholder="第一次写文，玻璃心，轻点喷" v-model="authorNote" @input="onContentChange"></textarea>
      </div>

      <div class="write-book-footer-box">
        <button class="undo-btn" @click="undo">←</button>
        <button class="redo-btn" @click="redo">→</button>
         <el-select class="font-size-reset" v-model="fontSize" placeholder="16px" style="width: 90px;">
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Title } from '#components';

    
  const chapterNumber = ref<Number>(1)
  const chapterContent = ref('');
  const chapterTitle = ref('');
  const currentOpType = computed(() => route.query.opType as string);
  const currentFrom = computed(() => route.query.from as string);
  const bookChapterInfo = ref<BookChapter | null>(null);
  const authorNote = ref('');
  const historyStack = ref([]);
  const currentIndex = ref(-1);
  const maxHistory = 50;
  // 添加防抖函数避免频繁保存历史记录
  const debounceTimer = ref(null)
  const fontSize = ref('16px')
  const authorContainer = ref<InstanceType<typeof AuthorContainer>>()
  const route = useRoute();
  const router = useRouter();
  const bookWordCount = computed(() => {
    return chapterContent.value.length
  })

  const options = [
  {
    options: [
      {
        value: '12',
        label: '12px',
      },
      {
        value: '14',
        label: '14px',
      },
      {
        value: '16',
        label: '16px',
      },
      {
        value: '18',
        label: '18px',
      },
      {
        value: '20',
        label: '20px',
      },
      {
        value: '22',
        label: '22px',
      },
      {
        value: '24',
        label: '24px',
      },
    ],
  }
  ]
  interface Book {
    bookId: string
    title: string // 书籍标题
    description: string // 书籍描述
    protagonistIntroduction: string //书籍主角介绍
    category: string // 分类
    language: string // 语言
    isFree: number // 是否免费（0-否，1-是）
    coverImageUrl: string // 封面图片
    chapterTitle: string // 章节标题
    chapterContent: string // 章节内容
  }
  interface BookChapter {
    authorPenName: string
    bookId:string
    chapterContent: string
    chapterId: string
    chapterNumber: number
    chapterTitle: string
    coverImageUrl: string
    publishDate: string
    serialStatus: number
    totalCharCount: number
    userReadCharacterIndex: number
    isDrafts: number
  }
  const bookData = ref<Book | null>(null)
  // 初始化章节序号
  const initChapterNumber = async () => {
    try {
      if (!bookData.value) {
        console.log("当前书籍信息为空", bookData.value);
        return;
      }
      const getNextChapterNumUrl = `${API_ENDPOINTS.GET_NEXT_CHAPTER_NUM}${bookData.value.bookId}`;
      const nextChapterNumResult = await apiRequest(getNextChapterNumUrl, {
        method: 'GET'
      });
      console.log("获取下一章的编号", nextChapterNumResult);
      if (nextChapterNumResult.code === 200) {
        chapterNumber.value = nextChapterNumResult.data;
      } else if (bookData.value) {
        chapterNumber.value = bookData.value.currentChapter;
        chapterTitle.value = bookData.value.currentChapterTitle;
      } else {
        chapterNumber.value = 1
      }
    } catch (error) { 
    }
  }
  const initChapterInfo = async () => {
    const bookId = route.query.bookId as string;
    const chapterNumberStr  = route.query.chapterNumber as string;
    const opType = route.query.opType as string;
    let chapterNum = 1;
    if ( chapterNumberStr && !isNaN(parseInt(chapterNumberStr)) ) {
      chapterNum = parseInt(chapterNumberStr);
    }
    // 如果是创建新章节，只需要获取下一个章节序号
    if (opType === 'createChapter' || opType === 'createBook') {
      await initChapterNumber(bookId);
      // 清空内容，防止缓存
      chapterTitle.value = '';
      chapterContent.value = '';
      authorNote.value = '';
      return;
    }

    // 如果是修改章节，才去请求详情
    if (opType === 'updateChapter' && chapterNumberStr) {
      try {
        const getChapterDetailReq = {
          bookId: bookId,
          chapterNumber: chapterNum,
        };
        
        const res = await apiRequest(API_ENDPOINTS.GET_CHAPTER_DETAIL, {
          method: "POST",
          body: JSON.stringify(getChapterDetailReq),
        });

        console.log("章节详情结果：", res);
        if (res.code === 200 && res.data) {
          const data = res.data;
          bookChapterInfo.value = data;
          if (!bookData.value && data.title) {
            bookData.value = { title: data.title } as Book;
          }
          // 回显数据
          chapterTitle.value = data.chapterTitle;
          chapterContent.value = decryptData(data.chapterContent) || ''; 
          chapterNumber.value = data.chapterNumber;
          authorNote.value = data.authorTestimonial || '';
        }
      } catch (error) {
        console.error("加载章节详情失败", error);
      }
    }
  }
  // 校验章节数据
  const validateChapterData = (isPublish: boolean): boolean => {
    const chapterNum = Number(chapterNumber.value)
    const title = chapterTitle.value.trim()

    if (isNaN(chapterNum) || chapterNum < 1) {
      alert('章节序号必须为大于0的整数')
      return false
    }

    if (!title) {
      alert('章节标题不能为空')
      return false
    }

    // 可选：正文内容校验（发布时）
    if (!chapterContent.value.trim() && isPublish) {
      ElMessage.warning('发布时正文内容不能为空');
      return false
    }

    return true
  }

  const mergeChapterData = async (isPublish: boolean) => {
    // 章节信息校验
    if (!validateChapterData(isPublish)) return;
    // 判断用户操作类型
    const opType = currentOpType.value;
    // 构建章节信息
    const chapterInfoPayload = {
      bookId: route.query.bookId,
      chapterId: bookChapterInfo.value?.chapterId,
      chapterTitle: chapterTitle.value,
      chapterNumber: chapterNumber.value,
      chapterContent: chapterContent.value,
      authorTestimonial: authorNote.value,
      isDrafts: isPublish ? 0 : 1
    };
    switch (opType) {
      case 'createBook':
        await createBook();
        break
      case 'createChapter':
        await createBookChapter(chapterInfoPayload);
        break
      case 'updateChapter':
        await updateBookChapter(chapterInfoPayload);
        break
      case 'deleteChapter':
        await deleteBookChapter();
        break
      default:
        ElMessage({
        message: 'system error. unkonw opType.',
        type: 'error',
      })
    }
  }

  // 创建书籍
  const createBook = async () => { 
    const createBookReq = {
      title: bookData.value.title,
      description: bookData.value.description,
      protagonistIntroduction: bookData.value.protagonistIntroduction,
      isFree: 1,
      coverImageUrl: bookData.value.coverImageUrl,
      chapterTitle: chapterTitle.value,
      chapterContent: chapterContent.value,
    }
    console.log('createBookReq:', JSON.stringify(createBookReq))
    // 请求服务端创建书籍接口
    const createBookResult = await apiRequest(API_ENDPOINTS.CREATE_BOOK,{
      method: 'POST',
      body: JSON.stringify(createBookReq)
    })
    console.log("创建书籍结果：{}", createBookResult);
    if (createBookResult.code === 200) {
      ElMessage({
        message: 'create book success',
        type: 'success',
      })
      authorContainer.value?.switchNav('work-management');
    } else {
      ElMessage({
        message: 'create book failed, please try again later.',
        type: 'error',
      })
    }
  };
  // 创建书籍章节
  const createBookChapter = async (chapterInfoPayload: any) => { 
    console.log("创建书籍章节信息:", chapterInfoPayload);
    try {
      const createChapterResult = await apiRequest(API_ENDPOINTS.CREATE_CHAPTER, {
        method: 'POST',
        body: JSON.stringify(chapterInfoPayload)
      })
      console.log("创建章节结果", createChapterResult);
      if (createChapterResult.code === 200) {
        ElMessage.success(chapterInfoPayload.isDrafts === 0 ? '发布成功' : '草稿已保存');
        // 操作成功后，通常跳转回章节管理页或留存
        authorContainer.value?.switchNav('chapter-management');
        goBack(currentFrom.value);
      }
    } catch(error) {
      console.log("创建章节异常", error);
    }
  };
  // 更新书籍章节
  const updateBookChapter = async (chapterInfoPayload: any) => { 
    console.log("更新书籍章节", chapterInfoPayload);
    try { 
      const updateChapterResult = await apiRequest(API_ENDPOINTS.UPDATE_CHAPTER, {
        method: "POST",
        body: JSON.stringify(chapterInfoPayload)
      })
      console.log("更新书籍结果", updateChapterResult);
      if (updateChapterResult.code === 200) {

      }
    } catch (error) {
      console.log(error);
    }
  };
  // 删除书籍章节
  const deleteBookChapter = async () => { 
  };
  
  const goBack = () => {
    const from = route.query.from as string;
    if (!from) {
      console.log("没有来源信息");
      from = currentFrom.value;
    }
    switch(from) {
      case 'create-book':
        // 调用 authorContainer 的 switchNav 方法
        authorContainer.value?.switchNav('work-management');
        break;
      case 'chapter-management':
        // 从章节管理进入，返回章节管理页面
        authorContainer.value?.switchNav('chapter-management');
        break;
      default:
        // 默认行为：返回上一页
        router.back();
    }
  }

  const saveDraft = () => {
    console.log('saveDraft')
    mergeChapterData(false)
    console.log('草稿已保存:', bookData.value)
  }

  const publishBook = () => {
    console.log('publishBook')
    mergeChapterData(true) // 合并章节数据
  }

  const onContentChange = () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
    }
    
    // 300ms 后保存历史记录
    debounceTimer.value = setTimeout(() => {
      saveToHistory()
    }, 300)
  }


  // 保存当前状态到历史记录
  const saveToHistory = () => {
    // 获取当前内容状态
    const currentState = {
      content: chapterContent.value,
      chapterTitle: chapterTitle.value,
      authorNote: authorNote.value,
      timestamp: Date.now()
    }
    
    // 如果当前索引不是最新，则删除之后的历史
    if (currentIndex.value < historyStack.value.length - 1) {
      historyStack.value.splice(currentIndex.value + 1)
    }
    
    // 添加新状态
    historyStack.value.push(currentState)
    
    // 控制最大历史记录数
    if (historyStack.value.length > maxHistory) {
      historyStack.value.shift()
    } else {
      currentIndex.value++
    }
  }

  // 撤销操作
  const undo = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      restoreState(historyStack.value[currentIndex.value])
    }
  }

  // 重做操作
  const redo = () => {
    if (currentIndex.value < historyStack.value.length - 1) {
      currentIndex.value++
      restoreState(historyStack.value[currentIndex.value])
    }
  }

  // 恢复状态
  const restoreState = (state) => {
    chapterContent.value = state.content || ''
    chapterTitle.value = state.chapterTitle || ''
    authorNote.value = state.authorNote || ''
  }

  // 监听 fontSize 变化并应用到文本区域
  watch(fontSize, (newFontSize) => {
    if (typeof document === 'undefined') return;
    const textArea = document.querySelector('.write-book-textarea')
    const authorNoteArea = document.querySelector('.author-note-textarea')
    
    if (textArea) {
      textArea.style.fontSize = newFontSize + 'px'
    }
    if (authorNoteArea) {
      authorNoteArea.style.fontSize = newFontSize + 'px'
    }
  }) // immediate: true 确保初始值也应用

  onMounted(() => {
    try {
      if (route.query && route.query.bookData) {
        const encodedData = route.query.bookData as string
        // 先 decodeURIComponent 再 base64 解码
        const decodedData = decodeURIComponent(atob(encodedData))
        bookData.value = JSON.parse(decodedData)
        console.log('接收到的书籍数据:', bookData.value)
      }
    } catch (e) {
      console.error('解析书籍数据失败:', e)
      // 设置默认值避免后续错误
      bookData.value = {
        bookName: '',
        bookCategoryList: [],
        bookTagList: [],
        bookProtagonist: '',
        bookDesc: ''
      }
    }
    // 初始化章节数
    initChapterNumber();
    initChapterInfo();
    // 【新增】初始化字体大小 (DOM 渲染完成后执行，安全)
    nextTick(() => {
      const textArea = document.querySelector('.write-book-textarea') as HTMLElement;
      const authorNoteArea = document.querySelector('.author-note-textarea') as HTMLElement;
      if (textArea) textArea.style.fontSize = fontSize.value;
      if (authorNoteArea) authorNoteArea.style.fontSize = fontSize.value;
    });
  })
</script>

<style scoped lang="scss">
  .write-book-page { 
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .write-book-header-box {
    position: relative;
    display: flex;
    width: 100vw;
    height: 58px;
    background: #262626;
  }
  .back-btn {
    width: 12px;
    height: 12px;
    color: #a2a0a0;
    padding: 20px 0 0 28px;
  }
  .write-book-info-box {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    margin-left: 7px;
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #D5D5D5;
    line-height: 14px;
    text-align: left;
    font-style: normal;
  }
  .book-info-box {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #777777;
    line-height: 14px;
    text-align: left;
    font-style: normal;
  }
  .save-draft-btn, .publish-btn { 
    position: absolute;
    width: 100px;
    height: 28px;
    border-radius: 24px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #D5D5D5;
    line-height: 28px;
    text-align: center;
    font-style: normal;
  }
  .save-draft-btn {
    top: 15px;
    right: 144px;
    background: #4D4D4D;
  }
  .publish-btn {
    top: 15px;
    right: 28px;
    background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  }
  .wirte-book-main-box {
    margin-top: 24px;
    width: 800px;
    height: 100vh;
    background: #262626;
    border-radius: 10px 10px 0px 0px;
  }
  .write-book-textarea {
    width: 100%;
    height: calc(100vh - 370px);
    background: #262626;
    border: none;
    outline: none;
    resize: none;
    color: #D5D5D5;
    font-family: PingFangSC, PingFang SC;
    font-size: 14px;
    padding: 20px;
    box-sizing: border-box;
  }
  .author-note-textarea {
    width: 100%;
    background: #424242;
    border: none;
    outline: none;
    resize: none;
    color: #D5D5D5;
    font-family: PingFangSC, PingFang SC;
    font-size: 14px;
    padding: 8px 18px 8px 18px;
    box-sizing: border-box;
  }
  .author-note-box {
    display: flex;
    flex-direction: column;
    width: 640px;
    height: 200px;
    background: #424242;
    border-radius: 6px;
    margin: 0 auto;
    // margin-top: 430px;
  }
  .author-note-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #D5D5D5;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    margin: 18px 0 0 18px;
  }
  .write-book-chapter-box {
    display: flex;
    align-items: center;
    margin-top: 60px;
    padding: 0 20px;
  }

  .chapter-info {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }

  .chapter-num-input {
    width: 40px;
    height: 20px;
    background: #262626;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: PingFangSC, PingFang SC;
    font-size: 14px;
    text-align: center;
    padding: 0;
    margin: 0 8px;
    border-bottom: 1px solid #fff;
    -moz-appearance: textfield; /* Firefox */
    appearance: textfield; /* Chrome, Safari */

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .write-book-chapter-box input[type="text"] {
    width: 200px;
    height: 20px;
    background: #262626;
    border: none;
    outline: none;
    color: #D5D5D5;
    font-family: PingFangSC, PingFang SC;
    font-size: 14px;
    padding: 0;
    margin: 0;
  }
  .chapter-title-input {
    margin-left: 16px !important;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #D5D5D5;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }

  .write-book-footer-box {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 800px;
    height: 48px;
    background: #262626;
    border-top: 1px solid #6F7378;
  }
  .undo-btn, .redo-btn { 
    background: #4D4D4D;
    border: none;
    color: #D5D5D5;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 5px;
    text-align: center;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  ::v-deep(.font-size-reset .el-select__wrapper) {
    font-size: 14px;
    background: #424242;
    border-radius: 6px;
    border: 1px solid #6F7378;
    color: #A2A0A0;
    &:focus-within { 
      box-shadow: 1px 1px 2px 0px rgba(249,110,8,0.3), -1px -1px 2px 0px rgba(249,110,8,0.3);
      border: 1px solid #F96E08;
    }
     // 下拉选项文字颜色
    .el-select__selected-item {
      color: #A2A0A0;
    }
  }
  .font-size-reset { 
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #A2A0A0;
    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
</style>