<template>
  <div v-if="reasoningContent || isThinking" class="thinking-container">
    <button type="button" @click="isExpanded = !isExpanded" class="thinking-header">
      <div class="thinking-title">
        <span class="pulse-indicator" :class="{ active: isThinking }"></span>
        <span class="status-text">{{ isThinking ? "司木正在深度推演中..." : "已完成推演思索" }}</span>
      </div>
      <div class="thinking-toggle">
        <span>{{ isExpanded ? "收起思索" : "查看思索" }}</span>
        <svg
          class="chevron-icon"
          :class="{ rotated: isExpanded }"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>

    <div v-if="isExpanded" class="thinking-body">
      <div v-if="reasoningContent" class="reasoning-text">{{ reasoningContent }}</div>
      <div v-else class="thinking-loading">思索脉络组织中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  reasoningContent?: string;
  isThinking?: boolean;
}>();

const isExpanded = ref(true);
</script>

<style scoped>
.thinking-container {
  margin-bottom: 12px;
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  background-color: var(--bg-surface-2, #202227);
  overflow: hidden;
  font-size: 12px;
  transition: all 0.2s ease;
}

.thinking-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary, #90949d);
  transition: background-color 0.15s ease;
}

.thinking-header:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.thinking-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--brand-primary, #e59e2b);
}

.pulse-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--brand-primary, #e59e2b);
  display: inline-block;
  opacity: 0.6;
}

.pulse-indicator.active {
  opacity: 1;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(229, 158, 43, 0.6);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(229, 158, 43, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(229, 158, 43, 0);
  }
}

.thinking-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted, #5e626c);
}

.chevron-icon {
  transition: transform 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.thinking-body {
  border-top: 1px dashed var(--border-subtle, rgba(255, 255, 255, 0.06));
  padding: 10px 12px;
  max-height: 240px;
  overflow-y: auto;
  color: var(--text-regular, #cfd1d6);
  line-height: 1.6;
}

.reasoning-text {
  white-space: pre-wrap;
  font-family: var(--font-mono, monospace);
  font-size: 11.5px;
  opacity: 0.88;
}

.thinking-loading {
  font-style: italic;
  color: var(--text-muted, #5e626c);
}
</style>
