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
        <img style="color: black;" src="/images/search.png" alt="">
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

  // 轻量 debounce 实现（替代 lodash 全量引入）
  function debounce(fn, delay) {
    let timer = null
    const debounced = (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
    debounced.cancel = () => { if (timer) clearTimeout(timer) }
    return debounced
  }

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

  // 定义事件（同时声明 input 与 input-change 保证兼容性）
  const emit = defineEmits(['search', 'clear', 'input', 'input-change'])

  // 搜索框状态
  const searchQuery = ref(props.initialValue)
  const isFocused = ref(false)

  // 核心：创建防抖函数（延迟触发输入事件/清空事件）
  const handleInputDebounce = debounce(() => {
    const trimedValue = searchQuery.value.trim()
    emit('input', trimedValue) // 派发标准 input 事件
    emit('input-change', trimedValue) // 派发与 Header 对齐的 input-change 事件
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
  align-items: center;
  width: 240px;
  max-width: 100%;
  box-sizing: border-box;
}

.search-input {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 0 32px 0 14px;
  font-size: 13px;
  color: #ffffff;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.25);
  border-color: #e59344;
  box-shadow: 0 0 0 2px rgba(229, 147, 68, 0.25);
}

.search-button {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  transition: all 0.2s ease;
}

.search-button img {
  width: 14px;
  height: 14px;
  object-fit: contain;
  opacity: 0.8;
}

.search-button:hover img {
  opacity: 1;
}

.clear-button {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  cursor: pointer;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
  line-height: 1;
  padding: 0;
}

.clear-button:hover {
  background: #e59344;
}

@media (max-width: 900px) {
  .search-container {
    width: 160px;
  }
}

@media (max-width: 640px) {
  .search-container {
    width: 120px;
  }
  .search-input {
    height: 28px;
    font-size: 12px;
    padding: 0 26px 0 10px;
  }
}

@media (max-width: 420px) {
  .search-container {
    width: 96px;
  }
  .search-input {
    height: 26px;
    font-size: 11px;
    padding: 0 22px 0 8px;
  }
  .search-input::placeholder {
    font-size: 11px;
  }
  .search-button {
    right: 2px;
    width: 20px;
    height: 20px;
  }
  .search-button img {
    width: 12px;
    height: 12px;
  }
  .clear-button {
    right: 22px;
    width: 14px;
    height: 14px;
    font-size: 9px;
  }
}
</style>
