<!-- components/bookshelf/FollowContent.vue -->
<!-- components/bookshelf/FollowContent.vue -->
<template>
  <div class="follow-box">
    <!-- 头部导航 -->
    <div class="follow-header-box">
      <button 
        class="follow-btn" 
        :class="{ active: activeTab === 'follow' }"
        @click="switchTab('follow')"
      >
        关注
      </button>
      <button 
        class="fans-btn" 
        :class="{ active: activeTab === 'fans' }"
        @click="switchTab('fans')"
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
            <div class="follow-user-name">{{ item.penName }}</div>
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
          <img class="fan-user-img" :src="fan.avatar" alt="">
          <div class="fan-user-info">
            <div class="fan-user-name">{{ fan.name }}</div>
            <div class="fan-user-desc">{{ fan.desc }}</div>
          </div>
          <button 
            v-if="!fan.isFollowing"
            class="follow-back-btn"
            @click="followBack(fan.id)"
          >
           <el-icon class="add-follow-icon"><Plus/></el-icon>
            关注
          </button>
          <button 
            v-else
            class="following-btn"
            disabled
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

<script setup>
  import { ref, onMounted } from 'vue';
  import { API_ENDPOINTS, apiRequest } from "@/utils/api";
  import { Plus } from '@element-plus/icons-vue'
  // 接收外部传递的激活标签页
  const props = defineProps({
    initialTab: {
      type: String,
      default: 'follow'
    },
    followList: {
      type: Array,
      default: () => []
    },
    fansList: {
      type: Array,
      default: () => []

    }
  });
  // 当前激活的标签页
  const activeTab = ref(props.initialTab);
  // 切换标签页
  const switchTab = (tab) => {
    activeTab.value = tab;
  };

  // 回关操作
  const followBack = async (id) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.FOLLOW_USER.replace('{id}', id), {
        method: 'POST'
      });
      if (response.code === 200) {
        // 更新粉丝状态
        const fan = fansList.value.find(f => f.id === id);
        if (fan) {
          fan.isFollowing = true;
        }
      }
    } catch (error) {
      console.error('回关失败:', error);
    }
  };

  // 页面加载时初始化数据
  onMounted(() => {
    // 确保数据被正确绑定
    console.log('Received followList:', props.followList);
    console.log('Received fansList:', props.fansList);
  });
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
  height: 598px;
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