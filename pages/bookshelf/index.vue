<!-- pages/bookshelf/index.vue -->
<template>
  <div class="book-shelf-container">
    <Header :margin-left="'360px'"/>
    <div class="book-shelf-box">
      <!-- 左侧导航栏 -->
      <LeftNav
        class="left-nav" 
        :user-info="userInfo"
        :active-nav="activeNav"
        :follow-count="followCount"
        :fan-count="fanCount"
        :balance="balance"
        @navigate-to-follow="navigateToFollow"
        @navigate-to-fans="navigateToFans"
        @recharge="handleRecharge"
        @show-recharge-record="showRechargeRecord"
        @switch-tab="switchTab"
        @update-avatar="handleAvatarUpdate"
      />

      <!-- 右侧导航栏 -->
      <div class="book-shelf-right-nav-box">
        <!-- 使用插槽占位，根据不同状态显示不同内容 -->
        <slot name="content">
          <BookShelfContent 
            v-if="activeNav === 'bookshelf'"
            :books="books"
            @goto-book-detail="gotoBookDetail"
            @delete-book="deleteBookShelf"
          />
          
          <HistoryContent 
            v-else-if="activeNav === 'history'"
          />
          
          <FollowAndFansContent 
            v-else
            :initial-tab = "activeNav"
            :follow-list="followList"
            :fans-list="fansList"
            :follow-count="followCount"
            :fan-count="fanCount"
            @update-follow-list="handleUpdateFollowList"
            @update-fans-list="handleUpdateFansList"
            @tab-change="handleTabChange"
            @update-fans-item="handleUpdateFansItem"
            @update-count="handleUpdateCount"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import LeftNav from "@/components/bookshelf/LeftNav.vue";
import BookShelfContent from "@/components/bookshelf/BookShelfContent.vue";
import HistoryContent from "@/components/bookshelf/HistoryContent.vue";
import FollowAndFansContent from "@/components/bookshelf/FollowAndFansContent.vue";
import { API_ENDPOINTS, apiRequest } from "@/utils/api";

// 定义响应式数据，用于跟踪当前激活的导航项
const activeNav = ref('bookshelf');
const router = useRouter()

const userInfo = ref({});
// 定义书籍数据
const books = ref([]);

// 用户相关信息
const followList = ref([]);
const fansList = ref([]);
const followCount = ref(0);
const fanCount = ref(22);
const balance = ref(0);

const handleUpdateFansList = (newFansList: any) => {
  fansList.value = newFansList;
};

const handleUpdateFollowList = (newFollowList: any) => {
  followList.value = newFollowList;
};

const handleTabChange = (tab: string) => {
  activeNav.value = tab;
};

const handleUpdateFansItem = (updateData: any) => {
  const { userId, mutualFollowing } = updateData;
  // 找到对应记录并更新状态（响应式数据，修改后子组件UI自动刷新）
  const targetIndex = fansList.value.findIndex(fan => fan.userId === userId);
  if (targetIndex !== -1) {
    // 注意：直接修改响应式数组的元素属性，Vue能检测到变化
    fansList.value[targetIndex].mutualFollowing = mutualFollowing;
    // 若接口返回的字段名是 isMutual / isFollowing，替换为对应字段名
    // fansList.value[targetIndex].isMutual = mutualFollowing;
  }
};

const handleUpdateCount = (countData: any) => {
  // 本地更新计数（响应式数据，LeftNav会自动刷新）
  if (countData.followCount !== undefined) {
    followCount.value = countData.followCount;
  }
  if (countData.fanCount !== undefined) {
    fanCount.value = countData.fanCount;
  }
};
// 切换标签页
const switchTab = (tab: string) => {
  activeNav.value = tab;
};

// 处理头像更新
const handleAvatarUpdate = (newAvatarUrl:any) => {
  userInfo.value.pictureUrl = newAvatarUrl // 更新头像
}

// 导航到关注页面
const navigateToFollow = () => {
  activeNav.value = 'follow';
};

// 导航到粉丝页面
const navigateToFans = () => {
  activeNav.value = 'fans';
};

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


// 获取关注列表数据
const queryMyFollow = async () => { 
  const followListReq = {
    page: 1,
    size: 10
  }
  const followListResult = await apiRequest(API_ENDPOINTS.LIST_FOLLOW, {
    method: 'POST',
    body: JSON.stringify(followListReq)
  });
  console.log("获取关注列表: {}", followListResult);
  followList.value = followListResult.data.records;
  followCount.value = followListResult.data.total;
};

const queryMyFans = async () => { 
  const fansListReq = {
    page: 1,
    size: 10
  }
  const fansListResult = await apiRequest(API_ENDPOINTS.LIST_FANS, {
    method: 'POST',
    body: JSON.stringify(fansListReq)
  });
  console.log("获取粉丝列表: {}", fansListResult);
  fansList.value = fansListResult.data.records
  fanCount.value = fansListResult.data.total;
}

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
    ElMessage.success('删除成功');
    queryMyBookShelf();
  } catch (error) {
    console.error('删除用户收藏的该书籍失败：', error);
    ElMessage.error('删除失败');
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

// 处理书币充值
const handleRecharge = () => {
  alert('跳转到充值页面');
};

// 显示充值记录
const showRechargeRecord = () => {
  alert('跳转到充值记录页面');
};

// 页面加载时默认加载书架数据
onMounted(() => {
  fetchUserInfo();
  queryMyBookShelf();
  queryMyFollow();
  queryMyFans();
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
.left-nav {
  margin-left: 360px;
}

.book-shelf-right-nav-box {
  display: flex;
  width: 1116px;
  height: 646px;
  border-radius: 6px;
  margin-left: 24px;
}

@media (max-width: 768px) {
  .book-shelf-box {
    flex-direction: column;
    width: 100%;
    margin-top: 90px;
    padding: 0 16px;
  }
  .left-nav {
    margin-left: 0;
    width: 100%;
  }
  .book-shelf-right-nav-box {
    width: 100%;
    height: auto;
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>
