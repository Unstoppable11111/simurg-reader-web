<template>
  <div class="simu-chat-experience">
    <!-- 顶部状态栏 -->
    <div class="chat-header">
      <div class="assistant-info">
        <div class="avatar-badge">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <!-- 凤凰/书卷羽翼羽毛造型 -->
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div class="title-row">
            <span class="assistant-name">司木 · Simu</span>
            <span class="online-tag">
              <span class="online-dot"></span>
              伴读中
            </span>
          </div>
          <span class="assistant-desc">Simurg Reader 智慧伴读官</span>
        </div>
      </div>

      <div class="header-actions">
        <!-- 未登录/已登录额度指示 -->
        <div class="quota-pill" :class="{ 'quota-exhausted': !chatStore.canSend }">
          <template v-if="chatStore.isLoggedIn">
            <span class="vip-icon">✨</span>
            <span>已登录 · 无限畅聊</span>
          </template>
          <template v-else>
            <span>体验额度: </span>
            <strong class="quota-number">{{ chatStore.remainingGuestQuota }}</strong>
            <span>/5 次</span>
          </template>
        </div>

        <!-- 开启新会话 -->
        <button
          type="button"
          class="icon-action-btn"
          title="新建对话"
          :disabled="chatStore.loading"
          @click="chatStore.createNewThread"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 消息滚动列表区域 -->
    <div ref="scrollerRef" class="messages-scroll-area">
      <!-- 空状态欢迎界面 -->
      <div v-if="!chatStore.currentMessages.length" class="empty-state">
        <div class="welcome-emblem">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <h3 class="welcome-title">你好，我是伴读官「司木」</h3>
        <p class="welcome-subtitle">
          专注为您解答 Simurg Reader 平台使用、阅读体验、书架与创作投稿疑问。<br />
          您可以点击下方热门问题，或在底部直接向我提问：
        </p>

        <div class="quick-chips-grid">
          <button
            v-for="(chip, idx) in quickPrompts"
            :key="idx"
            type="button"
            class="quick-chip-btn"
            @click="handleQuickSend(chip)"
          >
            <span class="chip-arrow">›</span>
            <span>{{ chip }}</span>
          </button>
        </div>
      </div>

      <!-- 消息气泡列表 -->
      <div v-else class="bubbles-list">
        <div
          v-for="(msg, index) in chatStore.currentMessages"
          :key="index"
          class="message-row"
          :class="[msg.role === 'user' ? 'user-row' : 'assistant-row']"
        >
          <!-- 助手头像 -->
          <div v-if="msg.role === 'assistant'" class="avatar-cell">
            <div class="assistant-mini-avatar">司</div>
          </div>

          <!-- 气泡内容主体 -->
          <div class="bubble-wrapper">
            <!-- 深度思考展示（仅助手消息且存在 reasoning_content 时） -->
            <ThinkingBlock
              v-if="msg.role === 'assistant' && msg.reasoning_content"
              :reasoning-content="msg.reasoning_content"
              :is-thinking="chatStore.loading && index === chatStore.currentMessages.length - 1"
            />

            <div class="bubble-content" :class="{ 'error-bubble': msg.error }">
              <div
                v-if="msg.role === 'assistant'"
                class="markdown-rendered"
                v-html="renderMarkdown(msg.content || (chatStore.loading ? '司木正在为您组织文字...' : ''))"
              ></div>
              <div v-else class="user-text">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制与输入区 -->
    <div class="chat-input-section">
      <!-- 达到 5 次未登录额度上限时的拦截引导卡片 -->
      <div v-if="!chatStore.canSend" class="login-gate-banner">
        <div class="gate-info">
          <span class="gate-icon">🔒</span>
          <div class="gate-texts">
            <strong>未登录体验额度已用完 (5/5)</strong>
            <p>登录账号即可免费开启无限对话，并同步云端书架与阅读记忆</p>
          </div>
        </div>
        <button type="button" class="gate-login-btn" @click="handleGoLogin">
          立即登录
        </button>
      </div>

      <!-- 正常输入卡片 -->
      <form v-else @submit.prevent="handleSubmit" class="input-box-wrapper">
        <textarea
          ref="textareaRef"
          v-model="inputDraft"
          rows="1"
          class="chat-textarea"
          placeholder="向司木提问关于 Simurg Reader 平台或小说阅读创作的问题..."
          :disabled="chatStore.loading"
          @keydown="handleKeyDown"
        ></textarea>

        <div class="input-actions-bar">
          <span class="keyboard-tip">Enter 发送，Shift+Enter 换行</span>

          <div class="action-buttons">
            <button
              v-if="chatStore.loading"
              type="button"
              class="stop-btn"
              @click="chatStore.stopGeneration"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              <span>停止</span>
            </button>
            <button
              v-else
              type="submit"
              class="send-btn"
              :disabled="!inputDraft.trim()"
            >
              <span>发送</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { useChatStore } from "~/stores/chat";
import { renderMarkdown } from "~/utils/formatMarkdown";
import ThinkingBlock from "./ThinkingBlock.vue";

const emit = defineEmits(["close"]);

const chatStore = useChatStore();
const inputDraft = ref("");
const scrollerRef = ref<HTMLDivElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// 契合 Simurg Reader 的站内热门问题
const quickPrompts = [
  "如何将喜欢的小说加入书架并设置离线阅读？",
  "作为作者，如何在平台申请入驻并发布新作品？",
  "平台支持哪些小说分类？排行榜是如何计算的？",
];

onMounted(() => {
  chatStore.init();
  scrollToBottom();
});

// 监听消息变化自动触底滚动
watch(
  () => [chatStore.currentMessages.length, chatStore.loading],
  () => {
    nextTick(() => scrollToBottom());
  }
);

function scrollToBottom() {
  if (scrollerRef.value) {
    scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight;
  }
}

function handleQuickSend(prompt: string) {
  inputDraft.value = prompt;
  handleSubmit();
}

async function handleSubmit() {
  const text = inputDraft.value.trim();
  if (!text || chatStore.loading) return;
  inputDraft.value = "";
  await chatStore.sendMessage(text);
  nextTick(() => {
    scrollToBottom();
    textareaRef.value?.focus();
  });
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
}

// 跳转登录页并关闭对话窗口
function handleGoLogin() {
  emit("close");
  navigateTo("/login");
}
</script>

<style scoped>
.simu-chat-experience {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-surface-1, #17181c);
  color: var(--text-primary, #f5f5f7);
  font-family: var(--font-sans, sans-serif);
}

/* 顶部状态栏 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  background-color: var(--bg-surface-1, #17181c);
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-badge {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md, 8px);
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(229, 158, 43, 0.25);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assistant-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary, #f5f5f7);
}

.online-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px;
  border-radius: var(--radius-full, 9999px);
  font-size: 10px;
  background-color: rgba(56, 178, 105, 0.12);
  color: #38b269;
  border: 1px solid rgba(56, 178, 105, 0.25);
}

.online-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #38b269;
}

.assistant-desc {
  font-size: 11px;
  color: var(--text-secondary, #90949d);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quota-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-full, 9999px);
  background-color: var(--bg-surface-2, #202227);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  color: var(--text-secondary, #90949d);
  display: flex;
  align-items: center;
  gap: 3px;
}

.quota-number {
  color: var(--brand-primary, #e59e2b);
  font-weight: 600;
}

.quota-exhausted {
  border-color: rgba(229, 72, 77, 0.4);
  background-color: rgba(229, 72, 77, 0.08);
  color: #e5484d;
}

.icon-action-btn {
  background: transparent;
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  color: var(--text-secondary, #90949d);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm, 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-action-btn:hover:not(:disabled) {
  color: var(--brand-primary, #e59e2b);
  border-color: var(--brand-primary, #e59e2b);
}

/* 消息滚动列表 */
.messages-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* 空状态欢迎界面 */
.empty-state {
  margin: auto 0;
  text-align: center;
  padding: 20px 10px;
}

.welcome-emblem {
  width: 54px;
  height: 54px;
  margin: 0 auto 12px;
  border-radius: var(--radius-xl, 16px);
  background: rgba(229, 158, 43, 0.1);
  border: 1px solid rgba(229, 158, 43, 0.2);
  color: var(--brand-primary, #e59e2b);
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #f5f5f7);
  margin-bottom: 6px;
}

.welcome-subtitle {
  font-size: 12px;
  color: var(--text-secondary, #90949d);
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto 18px;
}

.quick-chips-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.quick-chip-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: var(--radius-md, 8px);
  background-color: var(--bg-surface-2, #202227);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.08));
  color: var(--text-regular, #cfd1d6);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-chip-btn:hover {
  background-color: rgba(229, 158, 43, 0.08);
  border-color: rgba(229, 158, 43, 0.35);
  color: var(--brand-primary, #e59e2b);
}

.chip-arrow {
  color: var(--brand-primary, #e59e2b);
  font-size: 14px;
}

/* 消息气泡 */
.bubbles-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.user-row {
  flex-direction: row-reverse;
}

.assistant-mini-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm, 6px);
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble-wrapper {
  max-width: 82%;
}

.user-row .bubble-wrapper {
  max-width: 78%;
}

.bubble-content {
  padding: 10px 14px;
  border-radius: var(--radius-lg, 12px);
  font-size: 13px;
  line-height: 1.65;
  word-break: break-word;
}

.user-row .bubble-content {
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  border-top-right-radius: 2px;
}

.assistant-row .bubble-content {
  background-color: var(--bg-surface-2, #202227);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.08));
  color: var(--text-regular, #cfd1d6);
  border-top-left-radius: 2px;
}

.error-bubble {
  border-color: rgba(229, 72, 77, 0.4) !important;
  color: #e5484d !important;
}

/* 底部输入区 */
.chat-input-section {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  background-color: var(--bg-surface-1, #17181c);
}

/* 登录门禁提示 */
.login-gate-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-lg, 12px);
  background-color: rgba(229, 72, 77, 0.08);
  border: 1px solid rgba(229, 72, 77, 0.25);
}

.gate-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gate-icon {
  font-size: 18px;
}

.gate-texts strong {
  display: block;
  font-size: 12.5px;
  color: #e5484d;
}

.gate-texts p {
  font-size: 11px;
  color: var(--text-secondary, #90949d);
  margin-top: 2px;
}

.gate-login-btn {
  padding: 6px 14px;
  border-radius: var(--radius-md, 8px);
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(229, 158, 43, 0.3);
}

/* 输入框主体 */
.input-box-wrapper {
  border-radius: var(--radius-lg, 12px);
  background-color: var(--bg-surface-2, #202227);
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  padding: 10px 12px 8px;
  transition: border-color 0.2s ease;
}

.input-box-wrapper:focus-within {
  border-color: var(--brand-primary, #e59e2b);
}

.chat-textarea {
  width: 100%;
  max-height: 100px;
  min-height: 38px;
  border: none;
  background: transparent;
  color: var(--text-primary, #f5f5f7);
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
}

.chat-textarea::placeholder {
  color: var(--text-muted, #5e626c);
}

.input-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
}

.keyboard-tip {
  font-size: 10.5px;
  color: var(--text-muted, #5e626c);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.send-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: var(--radius-sm, 6px);
  background: var(--brand-gradient, linear-gradient(135deg, #e59e2b 0%, #e06828 100%));
  color: #fff;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stop-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: var(--radius-sm, 6px);
  background-color: rgba(229, 72, 77, 0.15);
  color: #e5484d;
  border: 1px solid rgba(229, 72, 77, 0.3);
  font-size: 12px;
  cursor: pointer;
}
</style>
