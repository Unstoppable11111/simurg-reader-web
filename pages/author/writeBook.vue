<template>
  <div class="write-book-page">
    <div class="write-book-header-box">
      <div class="back-btn" @click="goBack"><</div>
      <div class="wirte-book-info-box">
        <span class="book-title">炮灰的任意门</span>
        <div class="book-info-box">
          <span>上一章 您还没有发布章节，开始创建第一章吧！</span>
          <span class="work-count">当前字数：0</span>
        </div>
      </div>
      <button class="save-draft-btn" @click="saveDraft">存草稿</button>
      <button class="publish-btn" @click="publishBook">发布</button>
    </div>

    <div class="wirte-book-main-box">
      <div class="write-book-chapter-box">
        <span class="chapter-info">第 <input class="chapter-num-input" type="number"> 章</span>
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
      </div>
    </div>
  </div>
</template>

<script setup>    
  const chapterContent = ref('');
  const chapterTitle = ref('');
  const authorNote = ref('');
  const historyStack = ref([]);
  const currentIndex = ref(-1);
  const maxHistory = 50;
  // 添加防抖函数避免频繁保存历史记录
  const debounceTimer = ref(null)
  const router = useRouter();
  
  const goBack = () => {
    router.back();
  }

  const saveDraft = () => {
    console.log('saveDraft')
  }

  const publishBook = () => {
    console.log('publishBook')
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
    margin: 13px 0 0 12px; 
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
    height: 998px;
    background: #262626;
    border-radius: 10px 10px 0px 0px;
  }
  .write-book-textarea, .author-note-textarea {
    width: 100%;
    height: 100%;
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
    width: 800px;
    height: 48px;
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
</style>