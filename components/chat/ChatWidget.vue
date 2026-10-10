<template>
  <div class="simu-chat-widget-root">
    <!-- 右下角悬浮触发胶囊按钮 -->
    <transition name="widget-fade">
      <button
        v-if="!isOpen"
        type="button"
        class="floating-trigger-btn"
        aria-label="打开司木 AI 伴读官"
        title="打开司木 AI 伴读官"
        @click="isOpen = true"
      >
        <div class="trigger-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span class="trigger-label">AI 伴读</span>
      </button>
    </transition>

    <!-- 弹出的对话主面板 -->
    <transition name="widget-panel">
      <div v-if="isOpen" class="chat-dialog-panel" role="dialog" aria-label="司木 AI 伴读窗口">
        <!-- 窗口操作顶栏 -->
        <div class="dialog-top-bar">
          <div class="dialog-bar-left">
            <span class="bar-tag">SIMURG COPILOT</span>
          </div>
          <button
            type="button"
            class="dialog-close-btn"
            title="关闭窗口 (ESC)"
            aria-label="关闭窗口"
            @click="isOpen = false"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 嵌入的核心对话组件 -->
        <div class="dialog-inner-content">
          <ChatExperience @close="isOpen = false" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ChatExperience from "./ChatExperience.vue";

const isOpen = ref(false);

// 监听 ESC 键关闭窗口
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    isOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.simu-chat-widget-root {
  position: relative;
  z-index: var(--z-popover, 500);
}

/* 悬浮按钮 */
.floating-trigger-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-popover, 500);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px 10px 14px;
  border-radius: var(--radius-full, 9999px);
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px -4px rgba(229, 158, 43, 0.45), 0 0 1px 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.floating-trigger-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 28px -4px rgba(229, 158, 43, 0.6);
}

.trigger-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trigger-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* 浮动对话弹窗 */
.chat-dialog-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-popover, 500);
  width: min(420px, calc(100vw - 32px));
  height: min(620px, calc(100vh - 56px));
  border-radius: var(--radius-xl, 16px);
  background-color: var(--bg-surface-1, #17181c);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.12));
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶栏迷你条 */
.dialog-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px 4px;
  background-color: var(--bg-surface-2, #202227);
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
}

.bar-tag {
  font-size: 10px;
  font-family: var(--font-mono, monospace);
  color: var(--text-muted, #5e626c);
  letter-spacing: 0.08em;
}

.dialog-close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary, #90949d);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-xs, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.dialog-close-btn:hover {
  color: var(--text-primary, #f5f5f7);
  background-color: rgba(255, 255, 255, 0.08);
}

.dialog-inner-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 动效过渡 */
.widget-fade-enter-active,
.widget-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.widget-fade-enter-from,
.widget-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.widget-panel-enter-active,
.widget-panel-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.widget-panel-enter-from,
.widget-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

@media (max-width: 640px) {
  .floating-trigger-btn {
    bottom: 16px;
    right: 16px;
  }
  .chat-dialog-panel {
    bottom: 12px;
    right: 12px;
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
  }
}
</style>
