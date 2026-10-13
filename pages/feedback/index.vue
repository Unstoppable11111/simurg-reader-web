<template>
  <div class="feedback-page">
    <Header :margin-left="'360px'"/>
    <div class="feedback-container">
      <div class="feedback-recommend-box">
        <!-- <img class="feedback-recommend-img" src="@/assets/icons/feedback.png" alt="反馈"> -->
        <div class="feedback-recommend-text-box">
          <div class="feedback-recommend-text">意见反馈</div>
          <div class="feedback-recommend-text-sub">
            您的建议是我们进步的动力，请详细描述您遇到的问题或改进建议。
          </div>
        </div>
      </div>

      <div class="feedback-form-box">
        <div class="feedback-form-item">
          <label class="form-label"><span class="required">*</span> 反馈类型</label>
          <div class="type-radio-group">
            <label v-for="item in typeOptions" :key="item.value" class="radio-label">
              <input type="radio" :value="item.value" v-model="form.feedbackType" />
              <span class="radio-text">{{ item.label }}</span>
            </label>
          </div>
        </div>

        <div class="feedback-form-item">
          <label class="form-label"><span class="required">*</span> 联系方式</label>
          <input
            type="text"
            v-model="form.contactInfo"
            placeholder="请输入手机号或邮箱"
            class="form-input"
          />
        </div>

        <div class="feedback-form-item">
          <label class="form-label"><span class="required">*</span> 反馈内容</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="form.content"
              placeholder="请描述具体问题，建议在500字以内"
              class="form-textarea"
              maxlength="500"
              rows="5"
            ></textarea>
            <div class="char-count">{{ form.content.length }}/500</div>
          </div>
        </div>

        <div class="feedback-form-item">
          <label class="form-label">上传截图</label>
          <div class="screenshot-upload-container" @click="triggerFileSelect">
            <input ref="fileInput" type="file" accept="image/*" @change="handleScreenshotChange" class="hidden-input" />

            <div class="upload-preview-area">
              <img v-if="screenshotPreview" :src="screenshotPreview" class="preview-img" />
              <div v-else class="upload-placeholder">点击上传问题截图</div>
            </div>

            <button type="button" class="upload-btn-secondary">上传图片</button>
          </div>
        </div>
      </div>

      <div class="feedback-action-box">
        <button
          class="submit-btn"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          提交反馈
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Header from "@/components/layout/Header.vue";
import { API_ENDPOINTS, apiFileRequest, apiRequest } from "@/utils/api";

const typeOptions = [
  { label: '建议', value: 1 },
  { label: '投诉', value: 2 },
  { label: '举报', value: 3 },
  { label: '其他', value: 4 }
];

const form = reactive({
  feedbackType: 1,
  contactInfo: '',
  content: '',
  screenshotUrl: ''
});

const screenshotPreview = ref('');
const fileInput = ref(null);

const triggerFileSelect = () => fileInput.value.click();

const isFormValid = computed(() => {
  return form.contactInfo && form.content;
});

const handleScreenshotChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 本地预览
  const reader = new FileReader();
  reader.onload = (ev) => screenshotPreview.value = ev.target.result;
  reader.readAsDataURL(file);

  // 调用上传接口
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await apiFileRequest(API_ENDPOINTS.FILE_UPLOAD, {
      method: 'POST',
      body: formData
    });
    if (res.code === 200) {
      form.screenshotUrl = res.data;
    }
  } catch (err) {
    console.error("上传失败", err);
  }
};

const handleSubmit = async () => {
  try {
    const res = await apiRequest(API_ENDPOINTS.USER_FEEDBACK, {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res.code === 200) {
      alert("反馈成功");
      // 清空逻辑...
    }
  } catch (err) {
    alert("提交失败");
  }
};
</script>

<style scoped>
/* 基础容器 */
.feedback-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a;
  min-height: 100vh;
}

.feedback-container {
  width: 1360px;
  background: #424242;
  border-radius: 14px;
  margin-top: 122px;
  padding-bottom: 80px;
}

/* Banner 区域 */
.feedback-recommend-box {
  display: flex;
  width: 1252px;
  height: 174px;
  background: #646261;
  border-radius: 6px;
  margin: 54px auto 38px;
}

.feedback-recommend-img {
  width: 74px;
  height: 135px;
  margin: 20px 0 0 50px;
}

.feedback-recommend-text {
  font-size: 20px;
  color: #FFFFFF;
  font-weight: 600;
  margin: 45px 0 0 74px;
}

.feedback-recommend-text-sub {
  font-size: 16px;
  color: #A2A0A0;
  margin: 8px 0 0 74px;
}

/* 表单通用项 */
.feedback-form-box {
  width: 1252px;
  margin: 0 auto;
}

.feedback-form-item {
  display: flex;
  margin-bottom: 24px;
  padding-left: 54px;
}

.form-label {
  width: 130px;
  font-size: 18px;
  color: #A2A0A0;
  padding-top: 12px;
}

.required {
  color: #ED5B00;
}

/* 反馈类型 Radio */
.type-radio-group {
  display: flex;
  gap: 30px;
  padding-top: 14px;
}

.radio-label {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.radio-label input {
  margin-right: 8px;
  accent-color: #ED5B00;
}

/* 输入框 & 文本域 */
.form-input {
  width: 1122px;
  height: 48px;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  padding-left: 22px;
}

.textarea-wrapper {
  width: 1122px;
  position: relative;
}

.form-textarea {
  width: 100%;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  padding: 15px 22px;
  resize: none;
}

.char-count {
  position: absolute;
  right: 15px;
  bottom: 10px;
  color: #666;
  font-size: 12px;
}

/* 截图上传区域优化 (对照截图) */
.screenshot-upload-container {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px dashed #666;
  padding: 15px 25px;
  border-radius: 6px;
  cursor: pointer;
}

.upload-preview-area {
  width: 100px;
  height: 60px;
  background: #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  font-size: 14px;
  color: #A2A0A0;
  text-align: center;
}

.hidden-input {
  display: none;
}

.upload-btn-secondary {
  padding: 8px 18px;
  background: #646261;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 提交按钮 */
.feedback-action-box {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  text-align: center;
}

.submit-btn {
  width: 260px;
  height: 50px;
  background: linear-gradient(90deg, #FF9B51 0%, #ED5B00 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
