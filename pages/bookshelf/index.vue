<template>
  <div class="book-shelf-container">
    <Header :margin-left="'244px'"/>
    <div class="book-shelf-box">
      <!-- 左侧导航栏 -->
      <div class="book-shelf-left-nav-box">
        <!-- 作者头像区域 -->
        <div class="author-avatar-box"> 
          <img class="author-avatar" src="http://tireba.com/simurg-reader/images/author1.png" alt="">
          <div class="author-name">腹黑的龙王在吃西瓜</div>
          <div class="author-id">ID：1212454546</div>
          <div class="follow-box">
            <div class="author-follow">关注 <span class="author-follow-num">0</span></div>
            <div class="author-fan">粉丝 <span class="author-fan-num">22</span></div>
          </div>
        </div>
        <!-- 用户余额区域 -->
        <div class="user-balance-box">
          <div class="user-balance">
            书币余额：<span class="user-balance-num">0</span>
          </div>
          <div class="balance-recharge-box">
            <div class="balance-recharge-btn">书币充值</div>
            <div class="balance-recharge-record-btn">书币充值记录</div>
          </div>
        </div>
        <!-- 我的书架 -->
        <div 
          class="my-book-shelf" 
          :class="{ 'active': activeNav === 'bookshelf' }"
          @click="queryMyBookShelf()">我的书架</div>
        <div 
          class="my-history"  
          :class="{ 'active': activeNav === 'history' }"
          @click="queryMyHistory()">历史记录</div>
      </div>

      <!-- 右侧导航栏 -->
      <div class="book-shelf-right-nav-box">
        <!-- 根据激活的导航显示不同内容 -->
        <div v-if="activeNav === 'bookshelf'" class="bookshelf-content">
          <!-- 用户收藏的书籍 -->
          <div class="bookshelf-book-list">
            <div 
              v-for="book in books" 
              :key="book.bookId"
              @click="gotoBookDetail(book.bookId)"
              class="book-item">
              <img class="book-img" :src="book.image" :alt="book.title">
              <div class="book-title">{{ book.title }}</div>
              <div class="book-author">{{ book.author }}</div>
              <div class="book-read-history">{{ book.readHistory }}</div>
              <div class="book-operate">
                <div class="continue-read">继续阅读</div>
                <div class="book-delete">删除</div>
              </div>
            </div>
            <!-- 添加喜欢的小说按钮 -->
            <div class="add-book-btn-box">
              <button class="add-book-btn">点击添加你喜欢的小说</button>
            </div>
          </div>
        </div>
        <div v-if="activeNav === 'history'" class="history-content">
         <div class="add-book-btn-box">
            <button class="add-book-btn">点击添加你喜欢的小说</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import Header from "@/components/layout/Header.vue";

  // 定义响应式数据，用于跟踪当前激活的导航项
  const activeNav = ref('bookshelf');
 const router = useRouter()

  // 定义书籍数据
  const books = ref([
    {
      bookId: 1,
      image: 'http://tireba.com/simurg-reader/images/1.jpg',
      title: '穿书荒年，我靠修仙无敌了',
      author: '奈奈一',
      readHistory: '最近阅读至 第一章 飞升失败'
    },
    {
      bookId: 2,
      image: 'http://tireba.com/simurg-reader/images/1.jpg',
      title: '穿书荒年，我靠修仙无敌了',
      author: '奈奈一',
      readHistory: '最近阅读至 第一章 飞升失败'
    },
    {
      bookId: 3,
      image: 'http://tireba.com/simurg-reader/images/1.jpg',
      title: '穿书荒年，我靠修仙无敌了',
      author: '奈奈一',
      readHistory: '最近阅读至 第一章 飞升失败'
    },
    {
      bookId: 4,
      image: 'http://tireba.com/simurg-reader/images/1.jpg',
      title: '穿书荒年，我靠修仙无敌了',
      author: '奈奈一',
      readHistory: '最近阅读至 第一章 飞升失败'
    }
  ]);

  // 加载我的书架数据
  const queryMyBookShelf = async () => {
    if (activeNav.value === 'bookshelf') return; // 如果已经是当前页面，不需要重复加载
    
    activeNav.value = 'bookshelf';
    // 这里调用后端接口获取用户收藏的书籍
    // const response = await fetch('/api/user/bookshelf');
    // const books = await response.json();
    // 处理返回的数据
    console.log('加载我的书架数据');
  };

  // 加载历史记录数据
  const queryMyHistory = async () => {
    if (activeNav.value === 'history') return; // 如果已经是当前页面，不需要重复加载
    
    activeNav.value = 'history';
    // 这里调用后端接口获取用户的历史阅读记录
    // const response = await fetch('/api/user/history');
    // const history = await response.json();
    // 处理返回的数据
    console.log('加载历史记录数据');
  };

  // 点击书籍跳转到详情页
  const gotoBookDetail = (bookId) => {
    console.log('点击了书籍，ID:', bookId)
    // 使用路由跳转到书籍详情页
    router.push(`/book/${bookId}`)
  }

  // 页面加载时默认加载书架数据
  onMounted(() => {
    queryMyBookShelf();
  });
</script>

<style lang="scss" scoped>
.book-shelf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.book-shelf-box {
  display: flex;
}
.book-shelf-left-nav-box {
  width: 220px;
  height: 100vh;
}

.author-avatar-box { 
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  height: 198px;
  background: #424242;
}
.author-avatar {
  width: 68px;
  height: 68px;
  margin-top: 28px;
  border-radius: 50%;
}
.author-name {
  height: 20px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 16px;
  cursor: pointer;
  &:hover {
    color: #F96E08;
  }
}
.author-id {
  height: 20px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 4px;
  cursor: pointer;
  &:hover {
    color: #F64E05;
  }
}
.follow-box { 
  display: flex;
  margin-top: 11px;
}
.author-follow, .author-fan {
  width: 110px;
  height: 30px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 30px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
}
.author-follow-num, .author-fan-num { 
  color: #fff;
  &:hover {
    color: #F96E08;
  }
}
.author-follow { 
  left: -30px;
}
.author-fan { 
  right: -30px;
}
.user-balance-box { 
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-top: 6px;
  width: 220px;
  height: 70px;
  background: #424242;
}
.user-balance {
  height: 20px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  margin-top: 11px;
}
.user-balance-num { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 18px;
  color: #F96E08;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.balance-recharge-box {
  display: flex;
}
.balance-recharge-btn, .balance-recharge-record-btn { 
  width: 110px;
  height: 30px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: center;
  font-style: normal;
  margin-top: 16px;
}
.my-book-shelf, .my-history { 
  width: 220px;
  height: 48px;
  background: #424242;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  line-height: 48px;
  text-align: center;
  font-style: normal;
  color: #A2A0A0;
  cursor: pointer;
}
.my-book-shelf { 
  margin-top: 6px;
}
.active {
  color: #F96E08;
}
.book-shelf-right-nav-box {
  display: flex;
  width: 1116px;
  height: 646px;
  border-radius: 6px;
  margin-left: 24px;
}
.add-book-btn-box { 
  width: 267px;
  height: 315px;
  background: #424242;
  border-radius: 6px;
  text-align: center;
  line-height: 315px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 267px;
  height: 315px;
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
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: left;
  font-style: normal;
  margin-top: 18px;
  cursor: pointer;
  &:hover {
    color: #F96E08;
  }
}
.book-author {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 4px;
  cursor: pointer;
  &:hover {
    color: #F64E05;
  }
}
.book-read-history {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  cursor: pointer;
  &:hover {
    color: #F64E05;
  }
}
.book-operate {
  display: flex;
  position: relative;
  margin-top: 18px;
}
.continue-read {
  position: absolute;
  right: 20px;
  width: 89px;
  height: 30px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 30px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  &:hover {
    background: linear-gradient( 90deg, #F96C05 0%, #F64E05 100%);
  }
}
.book-delete {
  position: absolute;
  left: 20px;
  width: 89px;
  height: 30px;
  border-radius: 18px;
  border: 1px solid #6F7378;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #6F7378;
  line-height: 30px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  &:hover {
    border: 1px solid #A3A3A3;
    color: #A3A3A3;
  }
}
</style>