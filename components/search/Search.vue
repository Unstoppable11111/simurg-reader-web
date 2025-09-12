<template>
  <div class="relative search-container">
    <input
      type="text"
      v-model="searchQuery"
      :placeholder="placeholder"
      class="search-input"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="handleSearch"
    >
    <button 
      class="search-button" 
      @click="handleSearch"
      aria-label="搜索"
      :class="{ 'has-content': searchQuery.trim() }"
    >
      <i class="fa fa-search">
        <img style="color: black;" src="/public/images/search.png" alt="">
      </i>
    </button>
    
    <!-- 输入内容后显示清除按钮，增强交互 -->
    <button 
      v-if="searchQuery.trim()"
      class="clear-button"
      @click="clearSearch"
      aria-label="清除搜索内容"
    >
      <i class="fa fa-times">x</i>
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// 定义组件属性
const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索书籍、作者...'
  },
  initialValue: {
    type: String,
    default: ''
  }
})

// 定义组件事件
const emit = defineEmits(['search'])

// 搜索框状态
const searchQuery = ref(props.initialValue)
const isFocused = ref(false)

// 处理搜索逻辑
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

// 清除搜索内容
const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 260px;
}

.search-input {
  width: 100%;
  height: 28px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  border: none;
  padding: 0 36px 0 16px;
  font-size: 14px;
  color: #2d3748;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #4a5568;
  opacity: 1;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 搜索按钮优化 - 核心改进 */
.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #4a5568;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

/* 输入内容后增强图标对比度 */
.search-button.has-content {
  color: #2563eb; /* 蓝色图标，更醒目 */
}

/* 悬停时进一步增强可见性 */
.search-button:hover {
  background-color: #FF9B51;
  color: #fff;
}

.search-button i {
  font-size: 16px;
}

/* 新增清除按钮，提升交互体验 */
.clear-button {
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  color: #000;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-button:hover {
  /* background: rgba(0, 0, 0, 0.1); */
  background-color: #FF9B51;
  color: #fff;
}

/* 深色模式适配 */
/* :deep(.dark) .search-input {
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.5);
}

:deep(.dark) .search-input::placeholder {
  color: #a0aec0;
}

:deep(.dark) .search-button {
  color: #a0aec0;
}

:deep(.dark) .search-button.has-content {
  color: #93c5fd;
}

:deep(.dark) .search-button:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #bfdbfe;
}

:deep(.dark) .clear-button {
  color: #94a3b8;
}

:deep(.dark) .clear-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #e2e8f0;
} */
</style>
    