<!-- pages/feedback.vue -->
<template>
  <Header :margin-left="'360px'"/>
  <div class="feedback-page">
    <!-- 顶部大标题 -->
    <div class="page-title-container">
      <h1 class="page-main-title">意见反馈</h1>
      <p class="page-sub-title">您的每一条建议，都是我们进步的动力</p>
    </div>
    
    <div class="container">
      <!-- 反馈表单区域 -->
      <div class="feedback-form-wrapper">
        <form @submit.prevent="submitFeedback" class="feedback-form">
          <!-- 反馈类型 -->
          <div class="form-group">
            <label class="form-label">反馈类型 <span class="required">*</span></label>
            <select 
              v-model="formData.type" 
              class="form-select"
              :disabled="isSubmitting"
              required
            >
              <option value="">请选择反馈类型</option>
              <option value="reading">阅读体验问题</option>
              <option value="account">账户相关问题</option>
              <option value="recharge">充值消费问题</option>
              <option value="content">内容质量问题</option>
              <option value="function">功能建议</option>
              <option value="other">其他问题</option>
            </select>
          </div>

          <!-- 联系方式 -->
          <div class="form-group">
            <label class="form-label">联系方式 <span class="required">*</span></label>
            <input 
              v-model="formData.contact" 
              type="text" 
              class="form-input"
              placeholder="请输入手机号/邮箱（方便我们回复您）"
              :disabled="isSubmitting"
              required
            >
          </div>

          <!-- 反馈内容 -->
          <div class="form-group">
            <label class="form-label">反馈内容 <span class="required">*</span></label>
            <textarea 
              v-model="formData.content" 
              class="form-textarea"
              placeholder="请详细描述您遇到的问题或建议，越详细越容易解决哦~"
              rows="8"
              :disabled="isSubmitting"
              required
            ></textarea>
          </div>

          <!-- 截图/附件（可选） -->
          <div class="form-group">
            <label class="form-label">上传截图（可选）</label>
            <div class="upload-area" :class="{ disabled: isSubmitting }">
              <input 
                type="file" 
                accept="image/png,image/jpg,image/jpeg"
                @change="handleFileUpload"
                :disabled="isSubmitting"
                class="file-input"
              >
              <div class="upload-tips">
                <span class="icon">📎</span>
                <span>点击上传截图（支持png/jpg/jpeg格式，最大2MB）</span>
              </div>
              <!-- 已上传文件预览 -->
              <div v-if="uploadedFile" class="file-preview">
                <img :src="uploadedFile" alt="截图预览" class="preview-img">
                <button 
                  type="button" 
                  @click="removeFile"
                  :disabled="isSubmitting"
                  class="remove-file-btn"
                >
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="form-submit">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting || !formData.type || !formData.contact || !formData.content"
            >
              <span v-if="!isSubmitting">提交反馈</span>
              <span v-else>提交中...</span>
            </button>
          </div>
        </form>

        <!-- 提交成功提示 -->
        <div v-if="submitSuccess" class="success-tip">
          <div class="success-icon">✓</div>
          <h3>反馈提交成功！</h3>
          <p>我们会在1-3个工作日内处理您的反馈，并通过您提供的联系方式回复您~</p>
          <button 
            type="button" 
            @click="resetForm"
            class="back-btn"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = ref({
  type: '',        // 反馈类型
  contact: '',     // 联系方式
  content: '',     // 反馈内容
  file: null       // 上传的文件
})

// 上传文件预览
const uploadedFile = ref('')
// 提交状态
const isSubmitting = ref(false)
// 提交成功状态
const submitSuccess = ref(false)

// 处理文件上传
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 校验文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    alert('文件大小不能超过2MB，请选择更小的图片！')
    return
  }

  // 生成预览URL
  const reader = new FileReader()
  reader.onload = (event) => {
    uploadedFile.value = event.target.result
  }
  reader.readAsDataURL(file)
  formData.value.file = file
}

// 删除上传的文件
const removeFile = () => {
  uploadedFile.value = ''
  formData.value.file = null
  // 重置file input
  document.querySelector('.file-input').value = ''
}

// 提交反馈
const submitFeedback = async () => {
  try {
    isSubmitting.value = true

    // 模拟接口请求（实际项目中替换为真实接口）
    const mockApiCall = () => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ code: 200 }), 1500)
      })
    }

    const res = await mockApiCall()
    if (res.code === 200) {
      submitSuccess.value = true
    } else {
      alert('提交失败，请稍后重试！')
    }
  } catch (error) {
    console.error('提交反馈失败：', error)
    alert('提交失败，请检查网络后重试！')
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单并返回首页
const resetForm = () => {
  formData.value = {
    type: '',
    contact: '',
    content: '',
    file: null
  }
  uploadedFile.value = ''
  submitSuccess.value = false
  // 跳转到首页（可根据实际需求修改路由）
  router.push('/')
}
</script>

<style lang="scss" scoped>
.feedback-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 120px);
  background-color: #1a1a1a;
  color: #ffffff;
}

// 顶部标题样式
.page-title-container {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 800px;
}

.page-main-title {
  font-size: 36px;
  font-weight: 700;
  color: #f96e08;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f9a825 0%, #f96e08 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.page-sub-title {
  font-size: 18px;
  color: #bbb;
  letter-spacing: 1px;
}

.container {
  width: 100%;
  max-width: 800px;
  background: #2d2d2d;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 40px;
}

.feedback-form-wrapper {
  width: 100%;
}

// 表单样式
.feedback-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 16px;
  color: #f9a825;
  margin-bottom: 8px;
  font-weight: 500;
}

.required {
  color: #ff4444;
  margin-left: 4px;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  background: #3a3a3a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f96e08;
  }

  &:disabled {
    background: #444;
    color: #999;
    cursor: not-allowed;
  }
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: #3a3a3a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f96e08;
  }

  &:disabled {
    background: #444;
    color: #999;
    cursor: not-allowed;
  }
}

// 上传区域样式
.upload-area {
  width: 100%;
  padding: 24px;
  border: 1px dashed #444;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #f96e08;
    background: rgba(249, 110, 8, 0.05);
  }

  &.disabled {
    cursor: not-allowed;
    background: #444;
    border-color: #555;
  }

  .file-input {
    display: none;
  }

  .upload-tips {
    font-size: 15px;
    color: #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .icon {
      font-size: 20px;
    }
  }

  .file-preview {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .preview-img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 6px;
      border: 1px solid #444;
    }

    .remove-file-btn {
      padding: 6px 12px;
      background: #ff4444;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #cc0000;
      }

      &:disabled {
        background: #666;
        cursor: not-allowed;
      }
    }
  }
}

// 提交按钮
.form-submit {
  text-align: center;
  margin-top: 16px;
}

.submit-btn {
  padding: 14px 48px;
  background: #f96e08;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e06000;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

// 提交成功提示
.success-tip {
  text-align: center;
  padding: 40px 20px;

  .success-icon {
    font-size: 48px;
    color: #4cd964;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 24px;
    color: #fff;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: #bbb;
    margin-bottom: 24px;
  }

  .back-btn {
    padding: 12px 32px;
    background: #f96e08;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #e06000;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .page-main-title {
    font-size: 28px;
  }
  
  .page-sub-title {
    font-size: 16px;
  }

  .container {
    padding: 20px;
  }

  .upload-area {
    padding: 16px;
  }

  .submit-btn {
    width: 100%;
    padding: 14px 0;
  }

  .feedback-form {
    padding: 16px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
  }
}
</style>
