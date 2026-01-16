<template>
  <div class="become-author-page">
    <Header  :margin-left="'360px'"/>
    <div class="become-author-container">
      <!-- 推荐信息区域 -->
      <div class="become-author-recommend-box">
        <img class="become-author-recommend-img" src="http://www.tireba.com/simurg-reader/images/welcome-author.png" alt="欢迎成为作家">
        <div class="become-author-recommend-text-box">
          <div class="become-author-recommend-text">欢迎成为simurg reader作家，快来填写信息吧~</div>
          <div class="become-author-recommend-text-sub">
            1. 作者信息会同步更新到simurg reader<br/>
            2. 优质的头像、笔名和简介，能让更多读者记住你
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <div class="become-author-form-box">
        <!-- 头像上传 -->
        <div class="become-author-form-item">
          <label class="form-label"><span class="required">*</span> 作家头像</label>
          <div class="avatar-upload-container" 
              @dragover.prevent="onDragOver"
              @drop.prevent="onDrop"
              @dragenter.prevent="onDragEnter"
              @dragleave.prevent="onDragLeave"
              @click="triggerFileSelect">
            <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarChange" class="avatar-input" />
            <div class="avatar-preview">
              <img v-if="avatarPreview" :src="avatarUrl" alt="预览" />
              <div v-else class="placeholder">点击上传或拖拽头像</div>
            </div>
            <button type="button" class="upload-btn" @click.stop="triggerFileSelect">上传头像</button>
          </div>
        </div>

        <!-- 笔名 -->
        <div class="become-author-form-item">
          <label class="form-label"><span class="required">*</span> 笔名</label>
          <input
            type="text"
            v-model="penName"
            placeholder="请输入笔名"
            class="form-input"
            maxlength="20"
          />
        </div>

        <!-- 简介 -->
        <div class="become-author-form-item">
          <label class="form-label"><span class="required">*</span> 作家简介</label>
          <textarea
            v-model="bio"
            placeholder="10~30字内，展示个人特色和写作经验，请勿使用特殊符号"
            class="form-textarea"
            maxlength="30"
            rows="3"
          ></textarea>
          <div class="char-count">{{ bio.length }}/30</div>
        </div>
      </div>

      <!-- 协议与提交 -->
      <div class="become-author-box">
        <div class="agreement-section">
          <label class="agreement-checkbox">
            <input type="checkbox" v-model="agree" />
            <span class="agreement-text">我已阅读并同意 <a href="#" class="link">个人信息保护声明</a></span>
          </label>
        </div>
        <button class="submit-btn" :disabled="!agree || !penName || !bio" @click="handleBecomeAuthor">成为作家</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import { API_ENDPOINTS, apiFileRequest, apiRequest } from "@/utils/api";
  import { ca } from "element-plus/es/locale/index.mjs";

  const penName = ref('');
  const bio = ref('');
  const agree = ref(false);
  const avatarPreview = ref('');
  const fileInput = ref(null);
  const avatarUrl = ref('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    // 可选：高亮区域
    e.currentTarget.style.borderColor = '#FF9800';
    e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    // 恢复样式
    e.currentTarget.style.borderColor = '#ccc';
    e.currentTarget.style.backgroundColor = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    // 恢复样式
    e.currentTarget.style.borderColor = '#ccc';
    e.currentTarget.style.backgroundColor = '';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadAvatar(file);
    } else {
      alert('请上传有效的图片文件');
    }
  };

  // 上传头像到后端
  const uploadAvatar = async (file) => {
    // 显示预览
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarPreview.value = event.target.result;
    };
    reader.readAsDataURL(file);

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', file);
    console.log("文件对象",formData);
    try {
      // 这里需要替换为实际的上传接口URL
      // 假设有一个上传头像的接口
      const response = await apiFileRequest(API_ENDPOINTS.FILE_UPLOAD, {
        method: 'POST',
        body: formData
      });
      console.log("response：{}", response);
      if (response.code != 200) {
        throw new Error('上传失败');
      }
      // 保存返回的图片URL
      if (response.data) {
        avatarUrl.value = response.data;
        console.log('头像上传成功，URL:', avatarUrl.value);
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert('头像上传失败，请重试');
    }
  };

  const pendingAuthorData = ref(null);
  // 添加提交处理函数
  const handleBecomeAuthor = async () => {
    // 验证必填字段
    if (!agree.value || !penName.value || !bio.value) {
      return;
    }

    try {
      const becomeAuthorReq = {
        penName: penName.value,
        briefIntroduction: bio.value,
        country: "tr",
        avatarUrl: avatarUrl.value
      }
      const becomeAuthorResult = await apiRequest(API_ENDPOINTS.BECOME_AUTHOR, {
        method: 'POST',
        body: JSON.stringify(becomeAuthorReq)
      });
      console.log("becomeAuthorResult：{}", becomeAuthorResult);
      if (becomeAuthorResult.code === 200) {
        // 跳转到作者页面
        await navigateTo('/author');
      }
      if (becomeAuthorResult.code === 2008) {
        // 跳转登录页面，登录完成直接跳转
        pendingAuthorData.value = becomeAuthorReq;
        await navigateTo(`/login?redirect=/becomeAuthor&autoSubmit=true`)
      }
    } catch (error) {
      console.error('提交错误:', error);
      alert('提交失败，请检查填写的表单数据');
    }
  };
</script>

<style scoped>
  .become-author-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .become-author-container {
    display: flex;
    flex-direction: column;
    width: 1360px;
    height: 878px;
    background: #424242;
    border-radius: 14px;
    margin: 122px 54px 0;
  }
  .become-author-recommend-box {
    display: flex;
    width: 1252px;
    height: 174px;
    background: #646261;
    border-radius: 6px;
    margin: 54px 0 38px 54px;
  }
  .become-author-recommend-img {
    width: 74px;
    height: 135px;
    margin: 20px 0 0 50px;
  }
  .become-author-recommend-text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #FFFFFF;
    line-height: 28px;
    text-align: left;
    margin: 45px 0 0 74px;
  }
  .become-author-recommend-text-sub {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #A2A0A0;
    line-height: 22px;
    text-align: left;
    margin: 8px 0 0 74px;
  }
  .become-author-form-box {
    width: 1252px;
    margin-bottom: 40px;
  }
  .become-author-form-item {
    display: flex;
    align-items: center;
    margin: 0 0 24px 54px;
  }
  .form-label .required {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #F9A825;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
  .form-label {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #A2A0A0;
    line-height: 25px;
    text-align: left;
    font-style: normal;
    width: 130px;
  }
  .avatar-upload-container {
    display: flex;
    align-items: center;
    margin-left: 38px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .avatar-upload-container:hover {
    border-color: #FF9800;
    background-color: rgba(255, 152, 0, 0.1);
  }
  .avatar-input {
    display: none;
  }
  .upload-btn {
    padding: 8px 16px;
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 24px;
  }
  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
  }
  .avatar-preview img {
    width: 78px;
    height: 78px;
    background: #D8D8D8;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .placeholder {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #A2A0A0;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .form-input,
  .form-textarea {
    width: 1126px;
    height: 48px;
    border: 1px solid #555;
    background: #333;
    color: white;
    border-radius: 4px;
    font-size: 18px;
    padding-left: 22px;
    /* padding-top: 12px; */
  }
  .form-textarea {
    resize: none;
    min-height: 80px;
  }
  .char-count {
    font-size: 12px;
    color: #aaa;
    text-align: right;
    margin-top: 4px;
  }
  .become-author-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .agreement-section {
    margin: 20px 0;
  }
  .agreement-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
  }
  .agreement-checkbox input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1.2);
  }
  .agreement-text {
    color: #ccc;
  }
  .link {
    color: #FF9800;
    text-decoration: underline;
  }
  .submit-btn {
    padding: 12px 40px;
    background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>