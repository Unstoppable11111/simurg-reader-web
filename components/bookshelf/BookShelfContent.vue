<!-- components/bookshelf/BookShelfContent.vue -->
<template>
  <div class="bookshelf-content">
    <!-- 用户收藏的书籍 -->
    <div class="bookshelf-book-list">
      <div 
        v-for="book in books" 
        :key="book.bookId"
        @click="$emit('goto-book-detail', book.bookId)"
        class="book-item">
        <img class="book-img" :src="book.coverImageUrl" :alt="book.title">
        <div class="book-title">{{ book.title }}</div>
        <div class="book-author">{{ book.penName }}</div>
        <div class="book-read-history">最近阅读至：第{{book.currentReadingChapterNumber}}章 {{ book.chapterTitle }}</div>
        <div class="book-operate">
          <div class="continue-read" @click="continueRead(book.bookId, book.currentReadingChapterNumber)">继续阅读</div>
          <div class="book-delete" @click.stop="$emit('delete-book', book.bookId)">删除</div>
        </div>
      </div>
      <!-- 添加喜欢的小说按钮 -->
      <NuxtLink class="add-book-btn-box" to="/">
        <el-icon class="icon-plus"><Plus /></el-icon>
        <button class="add-book-btn">点击添加你喜欢的小说</button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  const router = useRouter();
  defineProps({
    books: {
      type: Array,
      default: () => []
    }
  });

  defineEmits(['goto-book-detail', 'delete-book']);

  const continueRead = (bookId: string, chapterId: string) => {
    console.log('继续阅读', bookId, chapterId);
    // 获取用户阅读记录，用于跳转
    router.push(`/book/read?book=${bookId}&chapter=${chapterId}`);
  }
</script>

<style lang="scss" scoped>
.add-book-btn-box { 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 228px;
  height: 302px;
  background: #424242;
  border-radius: 6px;
  text-align: center;
  line-height: 315px;
}
.icon-plus { 
  font-size: 28px;
  color: #fff;
  &:hover { 
    cursor: pointer;
  }
}
.add-book-btn {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.bookshelf-content {
  display: flex;
  flex-wrap: wrap;
}
.bookshelf-book-list {
  display: flex;
  gap: 16px;
  margin-right: 16px;
  width: 1116px;
  flex-wrap: wrap;
}
.book-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 227px;
  height: 302px;
  background: #424242;
  border-radius: 6px;
}
.book-img {
  width: 102px;
  height: 136px;
  margin-top: 24px;
  // 添加过渡动画：所有属性变化在0.3秒内完成，动画曲线为ease
  transition: all 0.3s ease;
  // 初始阴影（轻微，增强质感）
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  // 防止缩放时内容溢出
  transform-origin: center;
  border-radius: 10px;
}
// 鼠标悬停时的动画效果
.book-img:hover {
  // 轻微放大（1.05倍）
  transform: scale(1.05);
  // 加深阴影，增强立体感
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  // 可选：添加亮度调整
  filter: brightness(1.05);
}
.book-title {
  width: 168px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  margin-top: 18px;
  padding: 0 8.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;  
  cursor: pointer;
  &:hover {
    color: #F9A825;
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
  margin-top: 4px;
  cursor: pointer;
  &:hover {
    color: #F9A825;
  }
}
.book-read-history {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  cursor: pointer;
  &:hover {
    color: #F9A825;
  }
}
.book-operate {
  display: flex;
  margin-top: 18px;
}
.continue-read {
  position: absolute;
  left: 20px;
  bottom: 16px;
  width: 80px;
  height: 28px;
  background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  &:hover {
    background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
  }
}
.book-delete {
  position: absolute;
  right: 20px;
  bottom: 16px;
  width: 80px;
  height: 28px;
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #6F7378;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  &:hover {
    border: 1px solid #A3A3A3;
    color: #A3A3A3;
  }
}
</style>