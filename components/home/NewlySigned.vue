<template>
  <div class="newly-signed-box">
    <div class="newly-signed-list">
      <!-- 使用v-for循环渲染书籍项 -->
      <div 
        class="newly-signed-item" 
        v-for="(book, index) in newlySignedBooks" 
        :key="index"
        @click="gotoBookDetail(book.bookId)"
      >
        <img :src="book.imgUrl" :alt="book.title">
        <div class="book-info">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-desc">{{ book.desc }}</div>
          <div class="book-author">{{ book.author }}</div>
          <div class="book-cate">{{ book.category }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const router = useRouter();
const props = defineProps({
    books: {
      type: Array,
      default: () => [],
      required: true
    }
})

// 点击书籍跳转到详情页
const gotoBookDetail = (bookId) => {
  console.log('点击了书籍，ID:', bookId)
  // 使用路由跳转到书籍详情页
  router.push(`/book/${bookId}`)
}

// 新签约书籍数据
const newlySignedBooks = ref([
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  },
  {
    bookId: 1,
    imgUrl: "http://www.tireba.com/simurg-reader/images/signed.png",
    title: "穿越七零：大佬的小作精又娇又飒哈哈哈红红火火恍恍惚惚",
    desc: "穿越成年代文中的炮灰女配，带全家逆袭！",
    author: "墨香",
    category: "年代重生"
  }
]);
</script>

<style lang="scss" scoped>
.newly-signed-box {
  margin-top: 38px;
}

// 列表容器添加flex布局，让书籍项自动排列
.newly-signed-list {
  display: flex;
  flex-wrap: wrap; // 自动换行
  gap: 24px; // 项之间的间距，替代margin
}

.newly-signed-item {
  display: flex;
  width: 322px;
  height: 168px;
  // 添加过渡效果，提升交互体验
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px); // 悬停时轻微上浮
  }
}

// 统一设置图片样式
.newly-signed-item img {
  width: 120px; // 明确图片宽度，避免布局偏移
  height: 168px;
  object-fit: cover; // 保持图片比例
}

.book-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex: 1; // 自适应剩余宽度
  // 移除不必要的position: relative
}

.book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 21px;
  color: #FFFFFF;
  line-height: 29px;
  text-align: left;
  font-style: normal;
  
  // 两行省略号核心样式
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  
  max-width: 180px; // 更精确的宽度限制
  margin-bottom: 8px; // 增加与描述的间距
  
  &:hover {
    color: #F9A825;
    cursor: pointer;
  }
}

.book-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  
  // 给描述也添加两行省略
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px; // 固定与作者的间距
}

.book-author {
  color: #A2A0A0;
  margin-bottom: 8px; // 使用margin控制间距，替代absolute
  font-size: 14px;
}

.book-cate {
  width: 56px;
  height: 20px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
</style>
