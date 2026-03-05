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
      color: color
    }"
    fill="inherit"
    stroke="inherit"
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
  return typeof size === 'number' ? `${size}px` : size || '16px'
}

const width = computed(() => props.size ? formatSize(props.size) : formatSize(props.width))
const height = computed(() => props.size ? formatSize(props.size) : formatSize(props.height))

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

</script>

<style>
.svg-icon {
  box-sizing: border-box !important;
  preserveAspectRatio: xMidYMid meet;
  color: inherit;
  fill: currentColor;
  stroke: currentColor;
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