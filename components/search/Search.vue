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
      @input="handleInputDebounce"
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
  import { ref, defineProps, defineEmits, onUnmounted } from 'vue'
  import { debounce } from 'lodash' // 导入 Lodash 防抖函数

  // 定义Props
  const props = defineProps({
    placeholder: {
      type: String,
      default: '搜索书籍、作者...'
    },
    initialValue: {
      type: String,
      default: ''
    },
    debounceTime: { // 新增：防抖时间（毫秒），可由父组件自定义
      type: Number,
      default: 300
    }
  })

  // 定义事件（新增 clear 事件，用于输入为空时通知父组件）
  const emit = defineEmits(['search', 'clear', 'input'])

  // 搜索框状态
  const searchQuery = ref(props.initialValue)
  const isFocused = ref(false)

  // 核心：创建防抖函数（延迟触发输入事件/清空事件）
  const handleInputDebounce = debounce(() => {
    const trimedValue = searchQuery.value.trim()
    emit('input', trimedValue) // 派发输入变化事件
    if (trimedValue) {
      // 输入有内容：可选择自动触发搜索（可选，根据需求）
      // emit('search', trimedValue)
    } else {
      // 输入为空：派发清空事件，通知父组件恢复首页内容
      emit('clear')
    }
  }, props.debounceTime)

  // 原有搜索逻辑（点击按钮/回车触发，无防抖）
  const handleSearch = () => {
    const trimedValue = searchQuery.value.trim()
    if (trimedValue) {
      emit('search', trimedValue)
    } else {
      emit('clear') // 空值时也触发清空
    }
  }

  // 清空搜索内容（触发清空事件）
  const clearSearch = () => {
    searchQuery.value = ''
    emit('clear') // 通知父组件清空
  }

  // 组件卸载时：取消防抖函数，避免内存泄漏
  onUnmounted(() => {
    handleInputDebounce.cancel()
  })
</script>

<style scoped>
.search-container {
  position: relative;
  display: flex;
  width: 260px;
  /* 响应式适配：小屏缩窄 */
  @media (max-width: 768px) {
    width: 200px;
  }
}

.search-input {
  width: 100%;
  height: 28px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  border: none;
  padding: 0 40px 0 16px; /* 右侧预留更多空间给清除按钮 */
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
  box-shadow: 0 0 0 2px rgba(255, 155, 81, 0.2); /* 匹配项目主色 */
}

.search-input:disabled {
  background: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

/* 搜索按钮：优化定位和交互 */
.search-button {
  position: absolute;
  right: 16px;
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

.search-button.has-content {
  color: #FF9B51; /* 匹配项目主色 */
}

.search-button:hover:not(:disabled) {
  background-color: #FF9B51;
  color: #fff;
}

.search-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: inherit; /* 继承按钮颜色 */
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 清除按钮：修复定位+优化样式 */
.clear-button {
  position: absolute;
  right: 38px; /* 调整位置，避免和搜索按钮重叠 */
  top: 40%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 14px;
}

.clear-button:hover {
  background-color: #FF9B51;
  color: #fff;
}

.clear-icon {
  line-height: 1;
  font-weight: bold;
}
</style>