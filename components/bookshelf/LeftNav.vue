<!-- components/bookshelf/LeftNav.vue -->
<template>
  <div class="book-shelf-left-nav-box">
    <!-- 作者头像区域 -->
    <div class="author-avatar-box"> 
      <!-- 点击头像打开裁切弹窗 -->
      <img 
        class="author-avatar" 
        :src="userInfo.pictureUrl || defaultAvatar" 
        alt="头像"
        @click="openAvatarModal"
        style="cursor: pointer"
      >
      <div class="author-name">{{ userInfo.username }}
        <el-icon @click="editUserInfo(userInfo)" class="edit-icon">
          <EditPen />
        </el-icon>
      </div>
      <div class="author-id">ID：{{ userInfo.userId }}</div>
      <div class="follow-box">
        <div class="author-follow" @click="$emit('navigate-to-follow')">关注 <span class="author-follow-num">{{ followCount }}</span></div>
        <div class="author-fan" @click="$emit('navigate-to-fans')">粉丝 <span class="author-fan-num">{{ fanCount }}</span></div>
      </div>
    </div>
    <!-- 用户余额区域 -->
    <div class="user-balance-box">
      <div class="user-balance">
        书币余额：<span class="user-balance-num">{{ balance }}</span>
      </div>
      <div class="balance-recharge-box">
        <div class="balance-recharge-btn" @click="$emit('recharge')">书币充值</div>
        <div class="balance-recharge-record-btn" @click="$emit('show-recharge-record')">书币充值记录</div>
      </div>
    </div>
    <!-- 我的书架 -->
    <div 
      class="my-book-shelf" 
      :class="{ 'active': activeNav === 'bookshelf' }"
      @click="$emit('switch-tab', 'bookshelf')">我的书架</div>
    <div 
      class="my-history"  
      :class="{ 'active': activeNav === 'history' }"
      @click="$emit('switch-tab', 'history')">历史记录</div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { EditPen } from '@element-plus/icons-vue'
  import { ElDialog, ElUpload, ElButton } from 'element-plus'
  import { VueCropper } from 'vue-cropper' // 引入裁切组件
  import { API_ENDPOINTS, apiRequest } from "@/utils/api" // 假设你有接口请求工具

  defineProps({
    userInfo: {type: Object, required: true},
    activeNav: {type: String, default: 'bookshelf'},
    followCount: {type: Number, default: 0},
    fanCount: {type: Number, default: 0},
    balance: {type: Number, default: 0}
  });

  defineEmits(['navigate-to-follow', 'navigate-to-fans', 'recharge', 'show-recharge-record', 'switch-tab']);
  // 编辑用户信息（原有逻辑）
  const editUserInfo = (userInfo) => {
    console.log("编辑用户信息：", userInfo)
  }
</script>

<style lang="scss" scoped>
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
.edit-icon {
  font-size: 12px;
  margin-left: 4px;
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
/* 新增：头像裁切弹窗样式 */
.avatar-crop-box {
  padding: 10px 0;
}
.avatar-upload-btn {
  margin-bottom: 15px;
}
.cropper-box {
  width: 100%;
  height: 250px;
  margin: 10px 0;
}
.crop-btns {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>