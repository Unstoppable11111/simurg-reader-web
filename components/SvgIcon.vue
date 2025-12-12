<!-- components/SvgIcon.vue -->
<template>
  <svg aria-hidden="true" :class="svgClass" :style="svgStyle">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: '1em',
  },
  className: {
    type: String,
    default: '',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})

const svgStyle = computed(() => {
  return {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    fill: props.color || 'currentColor', // 默认跟随文本颜色
    overflow: 'hidden'
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>