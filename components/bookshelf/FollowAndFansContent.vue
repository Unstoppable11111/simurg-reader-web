<!-- components/bookshelf/FollowContent.vue -->
<template>
  <div class="follow-box">
    <!-- 头部导航 -->
    <div class="follow-header-box">
      <button 
        class="follow-btn" 
        :class="{ active: activeTab === 'follow' }"
        @click="handleTabSwitch('follow')"
      >
        关注
      </button>
      <button 
        class="fans-btn" 
        :class="{ active: activeTab === 'fans' }"
        @click="handleTabSwitch('fans')"
      >
        粉丝
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="follow-content-box">
      <!-- 关注列表 -->
      <div v-if="activeTab === 'follow'" class="follow-list">
        <div 
          v-if="followList.length"
          v-for="item in followList" 
          :key="item.id"
          class="follow-item">
          <img class="follow-user-img" :src="item.pictureUrl" alt="">
          <div class="follow-user-info">
            <div class="follow-user-name">{{ item.penName || item.username }}</div>
            <div class="follow-user-desc">{{ item.briefIntroduction }}</div>
          </div>
          <button class="follow-status">
            {{ item.isMutual ? '互相关注' : '已关注' }}
          </button>
        </div>
        
        <!-- 关注列表为空 -->
        <div v-else class="follow-empty-box">
          <el-icon class="empty-icon"></el-icon>
          <div class="follow-empty-text">空空如也~</div>
        </div>
      </div>

      <!-- 粉丝列表 -->
      <div v-else-if="activeTab === 'fans'" class="fans-list">
        <div 
          v-if="fansList.length"
          v-for="fan in fansList" 
          :key="fan.id"
          class="fan-item">
          <img class="fan-user-img" :src="fan.pictureUrl" alt="">
          <div class="fan-user-info">
            <div class="fan-user-name">{{ fan.username }}</div>
            <div class="fan-user-desc">{{ fan.desc }}</div>
          </div>
          <button 
            v-if="!fan.mutualFollowing"
            class="follow-back-btn"
            @click="followBack(fan.userId)"
          >
           <el-icon class="add-follow-icon"><Plus/></el-icon>
            关注
          </button>
          <button 
            v-else
            class="following-btn"
            @click="cancelFollow(fan.userId)"
          >
            已关注
          </button>
        </div>
        
        <!-- 粉丝列表为空 -->
        <div v-else class="fans-empty-box">
          <el-icon class="empty-icon"></el-icon>
          <div class="fans-empty-text">暂无粉丝</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup type="ts">
  import { ref, onMounted, watch} from 'vue';
  import { API_ENDPOINTS, apiRequest } from "@/utils/api";
  import { Plus } from '@element-plus/icons-vue'
  // 接收外部传递的激活标签页
  const props = defineProps({
    initialTab: {type: String, default: 'follow'},
    followList: {type: Array, default: () => []},
    fansList: {type: Array, default: () => []},
    followCount: { type: Number, default: 0 }, // 新增：接收父组件的关注数
    fanCount: { type: Number, default: 0 }     // 新增：接收父组件的粉丝数
  });
  // 当前激活的标签页
  const activeTab = ref(props.initialTab);
  const emit = defineEmits(['update-follow-list', 'update-fans-list', 'tab-change', 'update-fans-item', 'update-count']);
    // 切换标签页
  const handleTabSwitch = (tab) => {
    activeTab.value = tab;
    emit('tab-change', tab);
    fetchFollowAndFansList();
  };
  // 统一的请求方法：支持指定Tab，预加载另一组数据
  const fetchFollowAndFansList = async (currentTab = props.initialTab) => {
    // 1. 请求当前Tab的数据（若父组件无缓存）
    // if (currentTab === 'follow' && props.followList.length === 0) {
    if (currentTab === 'follow') {
      try {
        const followListReq = { page: 1, size: 10 };
        const followListResult = await apiRequest(API_ENDPOINTS.LIST_FOLLOW, {
          method: 'POST',
          body: JSON.stringify(followListReq)
        });
        if (followListResult.code === 200) {
          emit('update-follow-list', followListResult.data.records);
        }
      } catch (error) {
        console.error('获取关注列表失败：', error);
      }
    // } else if (currentTab === 'fans' && props.fansList.length === 0) {
    } else if (currentTab === 'fans') {
      try {
        const fansListReq = { page: 1, size: 10 };
        const fansListResult = await apiRequest(API_ENDPOINTS.LIST_FANS, {
          method: 'POST',
          body: JSON.stringify(fansListReq)
        });
        if (fansListResult.code === 200) {
          emit('update-fans-list', fansListResult.data.records);
        }
      } catch (error) {
        console.error('获取粉丝列表失败：', error);
      }
    }
  }

  // 回关操作
  const followBack = async (id) => {
    try {
      const followReq = {
        userId: id,
        type: 0, // 关注
      }
      const followResult = await apiRequest(API_ENDPOINTS.FOLLOW, {
        method: 'POST',
        body: JSON.stringify(followReq)
      });
      console.log("回关结果: {}", followResult);
      if (followResult.code === 200) {
        // 1. 更新单条记录粉丝的互关状态
        if (Array.isArray(props.fansList)) {
          // 找到当前操作的粉丝记录
          const targetFan = props.fansList.find(fan => fan.userId === id);
          if (targetFan) {
            // 注意：不能直接修改 props，需通过 emit 通知父组件更新
            emit('update-fans-item', { 
              userId: id, 
              mutualFollowing: true  // 关注成功后，互关状态变为 true
            });
          }
        }

        // 2. 刷新粉丝列表
        emit('update-count', { 
          followCount: props.followCount ++ , 
          fanCount: props.fanCount // 粉丝数不变
        });
        // await fetchFollowAndFansList('fans');
      }
    } catch (error) {
      console.error('回关失败:', error);
    }
  };

  // 取消关注操作
  const cancelFollow = async (id) => { 
     // 加日志：确认入参和当前计数
    console.log('取消关注入参：', id);
    console.log('当前followCount：', props.followCount);
    try {
      const followReq = {
        userId: id,
        type: 1, // 取消关注
      }
      const followResult = await apiRequest(API_ENDPOINTS.FOLLOW, {
        method: 'POST',
        body: JSON.stringify(followReq)
      });
      console.log("取消关注结果: {}", followResult);
      if (followResult.code === 200) {
        // 1、更新单条记录状态
        if (Array.isArray(props.fansList)) {
          const targetFan = props.fansList.find(fan => fan.userId === id);
          if (targetFan) {
            emit('update-fans-item', { 
              userId: id, 
              mutualFollowing: false  // 取消关注后，互关状态变为 false
            });
          }
        }
        // 2、通知父组件更新计数
        let newFollowCount = props.followCount --;
        console.log('计算后的newFollowCount：', newFollowCount);
        emit('update-count', {
          followCount: Math.max(0, newFollowCount),
          fanCount: props.fanCount
        });
        // 可选：异步重新请求列表
        // await fetchFollowAndFansList('fans');
      }
    } catch (error) {
      console.error('回关失败:', error);
    }
  };

  // 页面加载时初始化数据
  onMounted(() => {
    fetchFollowAndFansList(props.initialTab);
    // 确保数据被正确绑定
    // console.log('Received followList:', props.followList);
    // console.log('Received fansList:', props.fansList);
  });

  watch(
    () => props.followList,
    (newList) => {
      console.log('关注列表更新了', newList);
    },
    { immediate: true, deep: true }
  );

  watch(
    () => props.fansList,
    (newList) => {
      console.log('粉丝列表更新了', newList); // 修复笔误
    },
    { immediate: true, deep: true }
  );
  watch(
    () => props.initialTab,
    (newTab) => {
      activeTab.value = newTab; // 左侧导航点击时，子组件Tab同步切换
      fetchFollowAndFansList(newTab); // 同步加载数据
    },
    { immediate: true, deep: true }
  );

</script>

<style lang="scss" scoped>
.follow-box {
  width: 956px;
  height: 646px;
}

.follow-header-box {
  display: flex;
  width: 956px;
  height: 48px;
  background: #424242;
  border-radius: 6px 6px 0px 0px;
}

.follow-btn,
.fans-btn {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  padding: 0 20px;
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
  transition: all 0.3s ease;
}

.follow-btn.active,
.fans-btn.active {
  color: #FFFFFF;
  font-weight: 600;
}

.follow-content-box {
  width: 956px;
  margin-top: 12px;
  min-height: 600px;
  overflow-y: auto;
}

.follow-list,
.fans-list {
  width: 100%;
}

.follow-item,
.fan-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 90px;
  padding-left: 20px;
  background: #424242;
}

.follow-user-img,
.fan-user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.follow-user-info,
.fan-user-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
}

.follow-user-name,
.fan-user-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}

.follow-user-desc,
.fan-user-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  color: #777777;
  line-height: 14px;
  text-align: left;
  font-style: normal;
  margin-top: 4px;
}

.follow-status {
  position: absolute;
  right: 20px;
  width: 84px;
  height: 32px;
  background: #7D7D7D;
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #D5D5D5;
  line-height: 17px;
  text-align: center;
  font-style: normal;
  cursor: default;
}
.follow-empty-box, .fans-empty-box { 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.empty-icon {
  width: 150px;
  height: 150px;
  background: #808080;
  margin-top: 136px;
}
.follow-empty-text, .fans-empty-text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: center;
  font-style: normal;
}
.follow-back-btn {
  position: absolute;
  right: 20px;
  width: 84px;
  height: 32px;
  background: rgba(237,91,0,0.18);
  border-radius: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #F96E08;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  border: none;
}
.add-follow-icon {
  height: 32px;
  line-height: 32px;
}
.following-btn {
  position: absolute;
  right: 20px;
  width: 84px;
  height: 32px;
  background: #7D7D7D;
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #D5D5D5;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}
</style>