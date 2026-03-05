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
      @click="$emit('switch-tab', 'bookshelf')">
      <SvgIcon name="bookshelf" class="bookshelf" :class="{ 'active-icon': activeNav === 'bookshelf' }" size="34" />
      我的书架
      <SvgIcon name="arrow-right" class="arrow-right" :class="{ 'active-icon': activeNav === 'bookshelf' }" size="34"/>
    </div>
    <div 
      class="my-history"  
      :class="{ 'active': activeNav === 'history' }"
      @click="$emit('switch-tab', 'history')">
      <SvgIcon name="history" class="history" :class="{ 'active-icon': activeNav === 'bookshelf' }" size="34" />
      历史记录
      <SvgIcon name="arrow-right" class="arrow-right" :class="{ 'active-icon': activeNav === 'bookshelf' }" size="34" />
    </div>

    <!-- 头像裁剪弹窗：居中+背景模糊 -->
    <div class="avatar-modal-mask" v-if="avatarModalVisible" @click="closeAvatarModal">
      <div class="avatar-modal-content" @click.stop>
        <!-- 弹窗头部：标题+关闭按钮 -->
        <div class="modal-header">
          <span class="modal-title">更换头像</span>
          <button class="modal-close" @click="closeAvatarModal">×</button>
        </div>

        <!-- 裁剪区域：圆形头像+上传+缩放 -->
        <div class="crop-area">
          <!-- 点击头像触发上传 -->
          <div class="avatar-preview" @click="triggerUpload">
            <img
              ref="cropperRef"
              :src="cropImg || (userInfo.pictureUrl || defaultAvatar)"
              :auto-crop="true"
              :auto-crop-width="150"
              :auto-crop-height="150"
              :fixed="true"
              :fixed-number="[1, 1]"
              :center-box="true"
              :output-type="'png'"
              class="cropper"
            />
          </div>

          <!-- 缩放按钮 -->
          <!-- <div class="scale-btns">
            <button class="scale-btn" @click="cropScale(0.1)">+</button>
            <button class="scale-btn" @click="cropScale(-0.1)">-</button>
          </div> -->

          <!-- 隐藏的上传按钮 -->
          <input
            type="file"
            ref="uploadInput"
            class="upload-input"
            accept="image/jpeg,image/png"
            @change="handleFileUpload"
          >
        </div>

        <!-- 底部按钮：取消+保存 -->
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeAvatarModal">取消</button>
          <button class="save-btn" @click="confirmCrop">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import SvgIcon from '@/components/SvgIcon.vue';
  import { EditPen } from '@element-plus/icons-vue'
  import { VueCropper } from 'vue-cropper' // 引入裁切组件
  import { API_ENDPOINTS, apiRequest } from "@/utils/api" // 假设你有接口请求工具

  const props = defineProps({
    userInfo: { type: Object, required: true },
    activeNav: { type: String, default: 'bookshelf' },
    followCount: { type: Number, default: 0 },
    fanCount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }
  });

  defineEmits(['navigate-to-follow', 'navigate-to-fans', 'recharge', 'show-recharge-record', 'switch-tab']);
  // 状态定义
  const avatarModalVisible = ref(false) // 弹窗显示状态
  const defaultAvatar = 'https://via.placeholder.com/68x68' // 默认头像
  const cropperRef = ref(null) // 裁剪组件实例
  const cropperAvatar = ref('') // 修复：声明裁剪用的头像变量
  const cropImg = ref('') // 待裁剪的图片（上传后赋值）
  const uploadInput = ref(null) // 上传input实例  // 编辑用户信息（原有逻辑）
  const localUserInfo = ref({ ...props.userInfo })
  // 打开弹窗
  const openAvatarModal = async() => {
     // 解构props中的userInfo，避免直接赋值
    const { userInfo } = props;
    console.log("用户头像：", userInfo.pictureUrl)
    if (!userInfo.pictureUrl) {
      avatarModalVisible.value = true;
      return;
    }
    cropImg.value = userInfo.pictureUrl;
    // 核心：图片转Base64避免跨域
    const forceImgToBase64 = async (url) => {
      try {
        // 方案1：用fetch的no-cors模式获取图片（绕开跨域限制）
        const response = await fetch(url, { mode: 'no-cors' });
        const blob = await response.blob();
        
        // 将blob转为Base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        // 方案2：降级为直接使用默认头像
        return defaultAvatar;
      }
    };

    // 转换后赋值给裁剪组件
    cropperAvatar.value = await forceImgToBase64(userInfo.pictureUrl);
    avatarModalVisible.value = true;
    cropImg.value = '' // 重置裁剪图片
  };

  // 关闭弹窗
  const closeAvatarModal = () => {
    avatarModalVisible.value = false
    cropImg.value = ''
  };

  // 触发上传（点击头像打开文件选择）
  const triggerUpload = () => {
    uploadInput.value.click()
  };

  // 处理文件上传（转base64给裁剪组件）
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      cropImg.value = event.target.result // 赋值给裁剪组件
    }
    reader.readAsDataURL(file)
    e.target.value = '' // 重置input，允许重复选择同一文件
  };

  // 缩放裁剪区域
  const cropScale = (val) => {
    cropperRef.value.zoom(val)
  };

  // 确认裁剪并上传
  const confirmCrop = async () => {
    // 获取裁剪后的图片（base64格式）
    const cropData = await cropperRef.value.getCropData()
    
    // 转Blob用于接口上传
    const blob = dataURLtoBlob(cropData)
    const formData = new FormData()
    formData.append('avatar', blob, 'avatar.png')

    try {
      // 调用后端上传接口
      const res = await apiRequest(API_ENDPOINTS.UPLOAD_AVATAR, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.code === 200) {
        // 通知父组件更新头像
        emit('update-avatar', res.data.avatarUrl)
        closeAvatarModal()
      }
    } catch (err) {
      console.error('头像上传失败:', err)
    }
  };

  // base64转Blob工具函数
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  };
  const editUserInfo = (userInfo) => {
    console.log("编辑用户信息：", userInfo)
  }

  // 图片转base64工具函数
  const convertImgToBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        resolve(defaultAvatar); // 加载失败用默认头像
      };
      img.src = url;
    });
  };
  onMounted(async () => {
    // 假设你通过接口获取userInfo
    const res = await apiRequest(API_ENDPOINTS.USER_INFO);
    if (res.code === 200) {
      let userData = res.data;
      // 转换头像为base64，避免CORS
      if (userData.pictureUrl) {
        userData.pictureUrl = await convertImgToBase64(userData.pictureUrl);
      }
      localUserInfo.value = userData;
    }
  });
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
    color: #F9A825;
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
    color: #F9A825;
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
    color: #F9A825;
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
  color: #F9A825;
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
  position: relative;
  display: flex;
  align-items: center;
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
.bookshelf, .history, .ranking-hot, .bookshelfTest {
  width: 12px;
  height: 12px;
  color: transparent;
  margin: 0 6px 0 16px;
}
.arrow-right {
  position: absolute;
  right: 16px;
  width: 12px;
  height: 12px;
  color: transparent;
}
.active {
  color: #F9A825;
}
.active-icon {
  color: #F9A825;
}

/* 新增：头像弹窗样式 */
/* 弹窗遮罩：全屏+背景模糊 */
.avatar-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px); /* 背景模糊效果 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 弹窗内容：居中+固定宽度 */
.avatar-modal-content {
  width: 400px;
  background: #424242;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* 弹窗头部：标题+关闭按钮 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-title {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}
.modal-close {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
}

/* 裁剪区域：圆形头像+缩放按钮 */
.crop-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-preview {
  width: 150px;
  height: 150px;
  cursor: pointer;
}
/* 裁剪组件：强制圆形显示 */
.cropper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
}

/* 缩放按钮 */
.scale-btns {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}
.scale-btn {
  display: flex;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: #7D7D7D;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #F9A825;
  }
}

/* 隐藏的上传input */
.upload-input {
  display: none;
}

/* 弹窗底部按钮 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.cancel-btn {
  padding: 8px 20px;
  border: none;
  background: #7D7D7D;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn {
  padding: 8px 20px;
  border: none;
  background: #F9A825;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>