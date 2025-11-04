<template>
  <div class="book-shelf-container">
    <Header :margin-left="'360px'"/>
    <div class="book-shelf-box">
      <!-- 左侧导航栏 -->
      <div class="book-shelf-left-nav-box">
        <!-- 作者头像区域 -->
        <div class="author-avatar-box"> 
          <img class="author-avatar" :src="userInfo.pictureUrl" alt="">
          <div class="author-name">{{ userInfo.username }}</div>
          <div class="author-id">ID：{{ userInfo.userId }}</div>
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
              <img class="book-img" :src="book.coverImageUrl" :alt="book.title">
              <div class="book-title">{{ book.title }}</div>
              <div class="book-author">{{ book.penName }}</div>
              <div class="book-read-history">最近阅读至：第{{book.currentReadingChapterNumber}}章 {{ book.chapterTitle }}</div>
              <div class="book-operate">
                <div class="continue-read">继续阅读</div>
                <div class="book-delete" @click.stop="deleteBookShelf(book.bookId)">删除</div>
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
  import { API_ENDPOINTS, apiRequest } from "@/utils/api";

  // 定义响应式数据，用于跟踪当前激活的导航项
  const activeNav = ref('bookshelf');
  const router = useRouter()

  const userInfo = ref({});
  // 定义书籍数据
  const books = ref([]);

  // 加载我的书架数据
  const queryMyBookShelf = async () => {
    // 这里调用后端接口获取用户收藏的书籍
    const reqData = {
      page: 1,
      size: 10
    }
    try {
      const response = await apiRequest(API_ENDPOINTS.LIST_FAVORITE_BOOKS, {
        method: 'POST',
        body: JSON.stringify(reqData)
      });
      // 处理返回的数据
      console.log('加载我的书架数据', response);
      if (response.code === 200) {
        books.value = response.data.records;
      } else if (response.code === 2008) {
        router.push('/login');
      }
    } catch (error) {
      console.error('获取用户收藏的书籍失败：', error);
    }
  };

  // 加载历史记录数据
  const queryMyHistory = async () => {
    // 这里调用后端接口获取用户的历史阅读记录
    // const response = await fetch('/api/user/history');
    // const history = await response.json();
    // 处理返回的数据
    console.log('加载历史记录数据');
  };

  // 点击书籍跳转到详情页
  const gotoBookDetail = (bookId) => {
    // 使用路由跳转到书籍详情页
    router.push(`/book/${bookId}`)
  }

  const deleteBookShelf = async (bookId) => {
    // 这里调用后端接口删除用户收藏的该书籍
    try {
      const deleteFavoriteReq = {
        bookIdList: [bookId]
      };
      const response = await apiRequest(API_ENDPOINTS.DELETE_BOOKS_FROM_FAVORITE, {
        method: 'POST',
        body: JSON.stringify(deleteFavoriteReq)
      });
      console.log("删除用户收藏的该书籍成功", response);
      alert("删除成功");
      queryMyBookShelf();
    } catch (error) {
      console.error('删除用户收藏的该书籍失败：', error);
    }
  }

  const fetchUserInfo = async () => { 
    try {
      const response = await apiRequest(API_ENDPOINTS.USER_INFO);
      if (response.code === 200) {
        userInfo.value = response.data;
      }
      // 处理返回的用户信息
    } catch (error) {
      console.error('获取用户信息失败：', error);
    }
  }

  // 页面加载时默认加载书架数据
  onMounted(() => {
    fetchUserInfo();
    queryMyBookShelf();

  });
</script>

<style lang="scss" scoped>
.book-shelf-container {
  display: flex;
  flex-direction: column;
}
.book-shelf-box {
  display: flex;
  width: 1200px;
  margin-top: 122px;
}
.book-shelf-left-nav-box {
  width: 220px;
  height: 100vh;
  margin-left: 360px;
}

.author-avatar-box { 
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  height: 198px;
  background: #424242;
  border-radius: 6px 6px 0px 0px;
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
  width: 228px;
  height: 302px;
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
  margin-top: 4px;
  cursor: pointer;
  &:hover {
    color: #F64E05;
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
    color: #F64E05;
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
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  &:hover {
    background: linear-gradient( 90deg, #F96C05 0%, #F64E05 100%);
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