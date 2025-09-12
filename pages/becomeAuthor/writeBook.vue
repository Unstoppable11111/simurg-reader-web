<template>
  <div class="author-page">
    <ClientOnly>
      <div class="editor-container">
        <CKEditor v-model="content" />
      </div>
    </ClientOnly>
    <button @click="handleSave" class="save-button">保存内容</button>
    
    <!-- 显示当前内容，方便调试 -->
    <div class="content-preview">
      <h3>内容预览：</h3>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script setup>    
import { ref } from 'vue'

const content = ref('<p>开始写作...</p>')

const handleSave = () => {
  console.log('保存的内容：', content.value)
  // 这里可以添加保存到服务器的逻辑
}
</script>

<style scoped>
.author-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  min-height: 400px;
}

.save-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.save-button:hover {
  background-color: #359c6d;
}

.content-preview {
  border: 1px solid #eee;
  padding: 15px;
  background-color: #f9f9f9;
}

.content-preview h3 {
  margin-top: 0;
}
</style>