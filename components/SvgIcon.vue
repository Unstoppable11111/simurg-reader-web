<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="width"
    :height="height"
    :style="{
      display: 'inline-block',
      verticalAlign: 'middle',
      overflow: 'hidden',
      fill: color
    }"
  >
    <!-- 移除 :width/:height，仅保留 xlink:href -->
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
    default: 'transparent'
  },
  width: {
    type: [String, Number],
    default: '16px'
  },
  height: {
    type: [String, Number],
    default: '16px'
  }
})

const formatSize = (size) => {
  return typeof size === 'number' ? `${size}px` : size
}

const width = computed(() => formatSize(props.width))
const height = computed(() => formatSize(props.height))

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scoped>
.svg-icon {
  box-sizing: border-box !important;
  preserveAspectRatio: xMidYMid meet;
}

/* 关键：通过样式强制 use 标签填满 svg 容器 */
.svg-icon use {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>