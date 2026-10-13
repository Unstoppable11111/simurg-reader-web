<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="computedWidth"
    :height="computedHeight  "
    :style="{
      display: 'inline-block',
      verticalAlign: 'middle',
      overflow: 'hidden',
      color: color,
      width: computedWidth,
      height: computedHeight
    }"
    fill="inherit"
    stroke="inherit"
  >

    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  width: {
    type: [String, Number],
    default: '16px'
  },
  height: {
    type: [String, Number],
    default: '16px'
  },
  size: {
    type: [String, Number],
    default: ''
  }
})

const formatSize = (size) => {
  if (typeof size === 'number') {
    return `${size}px`
  } else if (typeof size === 'string') {
    // 如果是字符串但没有单位，添加 px 单位
    if (!isNaN(Number(size)) && !size.includes('px') && !size.includes('%') && !size.includes('em') && !size.includes('rem')) {
      return `${size}px`
    }
    return size
  }
  return '16px'
}

// 正确的计算属性逻辑
const computedWidth = computed(() => {
  if (props.size) {
    return formatSize(props.size)
  }
  return formatSize(props.width)
})

const computedHeight = computed(() => {
  if (props.size) {
    return formatSize(props.size)
  }
  return formatSize(props.height)
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

</script>

<style>
.svg-icon {
  box-sizing: border-box !important;
  preserveAspectRatio: xMidYMid meet;
  color: inherit;
  fill: currentColor;
  stroke: currentColor;
  width: inherit;
  height: inherit;
}

/* 关键：通过样式强制 use 标签填满 svg 容器 */
.svg-icon use {
  display: block;
  width: 100% !important;
  height: 100% !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>
