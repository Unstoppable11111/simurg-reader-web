<template>
  <div class="simu-chat-widget-root">
    <!-- 全屏柔和遮罩：打开后点击外部任意空白处自动关闭 -->
    <transition name="backdrop-fade">
      <div 
        v-if="isOpen" 
        class="chat-dialog-backdrop" 
        aria-hidden="true"
        @click="closeChat"
      ></div>
    </transition>

    <!-- 贴边灵动小精灵与智能气泡（收起时展示） -->
    <transition name="pet-enter">
      <div 
        v-if="!isOpen" 
        class="simu-pet-container"
        :class="{ 'is-hovered': isHovered }"
        @mouseenter="onPetMouseEnter"
        @mouseleave="onPetMouseLeave"
      >
        <!-- 智能场景气泡 -->
        <transition name="bubble-pop">
          <div 
            v-if="bubbleVisible" 
            class="pet-speech-bubble"
            @click="openChat"
          >
            <div class="bubble-arrow"></div>
            <div class="bubble-header-bar">
              <span class="bubble-sparkle">✨ 司木伴读</span>
              <button 
                type="button" 
                class="bubble-close-btn" 
                title="稍后再说" 
                aria-label="关闭气泡"
                @click.stop="dismissBubble"
              >
                ×
              </button>
            </div>
            <p class="bubble-text">{{ currentBubbleText }}</p>
          </div>
        </transition>

        <!-- 灵动小精灵主体（点击唤醒） -->
        <div 
          class="pet-mascot-body" 
          @click="openChat"
          title="点击唤醒「司木」小伴读官"
        >
          <!-- 呼吸发光底盘 -->
          <div class="pet-glow-aura"></div>

          <!-- 贴边露出的萌趣小书灵造型 -->
          <div class="pet-avatar-wrapper">
            <svg viewBox="0 0 36 36" width="38" height="38" fill="none" class="pet-mascot-svg">
              <circle cx="18" cy="18" r="15" fill="url(#simuPetBodyGrad)" />
              <!-- 灵动双翼 (呼吸微扇) -->
              <path class="pet-wing pet-wing-left" d="M4 19C2 14.5 4 8.5 8.5 10C9.8 15 6.8 18.5 4 19Z" fill="#FFA726" />
              <path class="pet-wing pet-wing-right" d="M32 19C34 14.5 32 8.5 27.5 10C26.2 15 29.2 18.5 32 19Z" fill="#FF7043" />
              <!-- 顶羽 -->
              <circle cx="18" cy="3.5" r="1.8" fill="#FFE082" />
              <!-- 灵动大眼睛 -->
              <ellipse class="pet-eye" cx="13" cy="17" rx="2.2" ry="2.6" fill="#211812" />
              <circle cx="13.8" cy="16.1" r="0.9" fill="#FFFFFF" />
              <ellipse class="pet-eye" cx="23" cy="17" rx="2.2" ry="2.6" fill="#211812" />
              <circle cx="23.8" cy="16.1" r="0.9" fill="#FFFFFF" />
              <!-- 腮红与微笑 -->
              <ellipse cx="9.5" cy="20" rx="1.8" ry="1.2" fill="rgba(255, 87, 34, 0.45)" />
              <ellipse cx="26.5" cy="20" rx="1.8" ry="1.2" fill="rgba(255, 87, 34, 0.45)" />
              <path d="M15.5 20.8C16.8 22 19.2 22 20.5 20.8" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round" />
              <defs>
                <linearGradient id="simuPetBodyGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFD54F" />
                  <stop offset="0.5" stop-color="#FFA726" />
                  <stop offset="1" stop-color="#F57C00" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- 迷你文字标签 -->
          <span class="pet-name-pill">AI 伴读</span>
        </div>
      </div>
    </transition>

    <!-- 弹出的对话主面板 -->
    <transition name="widget-panel">
      <div 
        v-if="isOpen" 
        class="chat-dialog-panel" 
        role="dialog" 
        aria-label="司木 AI 伴读窗口"
        @click.stop
      >
        <!-- 窗口操作顶栏 -->
        <div class="dialog-top-bar">
          <div class="dialog-bar-left">
            <span class="bar-tag">SIMURG COPILOT</span>
          </div>
          <button
            type="button"
            class="dialog-close-btn"
            title="关闭窗口 (点击空白处亦可关闭)"
            aria-label="关闭窗口"
            @click="closeChat"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 嵌入的核心对话组件 -->
        <div class="dialog-inner-content">
          <ChatExperience @close="closeChat" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ChatExperience from "./ChatExperience.vue";

const isOpen = ref(false);
const isHovered = ref(false);
const bubbleVisible = ref(false);
const currentBubbleText = ref("嗨！读累了歇歇眼，司木随时待命哦~ 🦉✨");

// 伴读语料库
const regularQuotes = [
  "嗨！找书没头绪？告诉司木，包在神鸟书灵身上！✨",
  "大大卡文了吗？快抓司木当你的脑洞灵感搭子！💡",
  "这里的热门好书很多哦，需要司木为你挑一本吗？📖",
  "需要本小伴读为你答疑解惑嘛？点我就对啦！(๑•̀ㅂ•́)و✧",
  "司木栖息在书架旁，时刻陪伴你的每一次夜读与创作 🦉✨",
];

const nightQuotes = [
  "夜深了，注意护眼哦~ 司木陪你读完这一章 🌙",
  "夜猫子书友，今夜又陷在哪本扣人心弦的小说里啦？🦉✨",
  "夜深人静灵感正浓，新章节大纲有思路了吗？快来和司木聊聊！💡",
];

let bubbleTimer: any = null;
let autoHideTimer: any = null;
let dismissedUntil = 0;

// 获取随机适时气泡文案
function pickBubbleText(): string {
  try {
    // 检查北京时间是否为深夜 (22:00 ~ 06:00)
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Shanghai",
      hour: "numeric",
      hour12: false,
    });
    const hour = parseInt(formatter.format(new Date()), 10);
    if ((hour >= 22 || hour < 6) && Math.random() > 0.4) {
      return nightQuotes[Math.floor(Math.random() * nightQuotes.length)];
    }
  } catch {}
  return regularQuotes[Math.floor(Math.random() * regularQuotes.length)];
}

// 弹出气泡
function showBubble(text?: string) {
  if (isOpen.value || Date.now() < dismissedUntil) return;
  currentBubbleText.value = text || pickBubbleText();
  bubbleVisible.value = true;

  clearTimeout(autoHideTimer);
  // 5.5 秒后自动柔和隐藏
  autoHideTimer = setTimeout(() => {
    if (!isHovered.value) {
      bubbleVisible.value = false;
    }
  }, 5500);
}

// 用户手动关闭气泡（120秒内不重复打扰）
function dismissBubble() {
  bubbleVisible.value = false;
  dismissedUntil = Date.now() + 120000;
}

// 打开聊天面板
function openChat() {
  isOpen.value = true;
  bubbleVisible.value = false;
}

// 关闭聊天面板
function closeChat() {
  isOpen.value = false;
}

function onPetMouseEnter() {
  isHovered.value = true;
  clearTimeout(autoHideTimer);
}

function onPetMouseLeave() {
  isHovered.value = false;
  if (bubbleVisible.value) {
    autoHideTimer = setTimeout(() => {
      bubbleVisible.value = false;
    }, 2500);
  }
}

// 监听 ESC 键关闭窗口
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    closeChat();
  }
}

// 监听标签页切换（离开时暂停计时）
function handleVisibilityChange() {
  if (document.hidden) {
    bubbleVisible.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // 进站 8 秒后首次可爱打招呼
  setTimeout(() => {
    showBubble();
  }, 8000);

  // 随后每 48 秒进行一次闲时轮播提示
  bubbleTimer = setInterval(() => {
    if (!document.hidden && !isOpen.value && !bubbleVisible.value) {
      showBubble();
    }
  }, 48000);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  clearInterval(bubbleTimer);
  clearTimeout(autoHideTimer);
});
</script>

<style scoped>
.simu-chat-widget-root {
  position: relative;
  z-index: var(--z-popover, 500);
}

/* 全屏透明/柔和点击遮罩：点击空白处收起 */
.chat-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-popover, 500) - 1);
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  cursor: pointer;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* 小精灵贴边外层容器 */
.simu-pet-container {
  position: fixed;
  bottom: 32px;
  right: 0;
  z-index: var(--z-popover, 500);
  display: flex;
  align-items: center;
  transition: transform 0.32s cubic-bezier(0.34, 1.25, 0.64, 1);
  transform: translateX(8px);
  user-select: none;
}

.simu-pet-container.is-hovered {
  transform: translateX(-10px);
}

/* 智能场景对话气泡 */
.pet-speech-bubble {
  position: absolute;
  right: 100%;
  bottom: 8px;
  margin-right: 16px;
  width: max-content;
  max-width: 250px;
  padding: 10px 14px;
  background: rgba(26, 27, 31, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(249, 168, 37, 0.35);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(249, 168, 37, 0.15);
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.pet-speech-bubble:hover {
  transform: translateY(-2px);
  border-color: rgba(249, 168, 37, 0.6);
}

.bubble-arrow {
  position: absolute;
  right: -7px;
  bottom: 18px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 7px solid rgba(26, 27, 31, 0.94);
}

.bubble-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.bubble-sparkle {
  font-size: 11px;
  font-weight: 700;
  color: #F9A825;
  letter-spacing: 0.02em;
}

.bubble-close-btn {
  background: transparent;
  border: none;
  color: #8c8f96;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.bubble-close-btn:hover {
  color: #ffffff;
}

.bubble-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #f0f0f2;
}

/* 小精灵主体 */
.pet-mascot-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  animation: pet-float 3.4s ease-in-out infinite;
}

.pet-avatar-wrapper {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 213, 79, 0.4);
  box-shadow: 0 4px 18px rgba(245, 124, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s ease;
}

.simu-pet-container.is-hovered .pet-avatar-wrapper {
  transform: scale(1.1) rotate(5deg);
  border-color: #FFD54F;
  box-shadow: 0 6px 24px rgba(245, 124, 0, 0.65);
}

.pet-mascot-svg {
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}

/* 灵动双翼微扇动动效 */
.pet-wing-left {
  transform-origin: 8px 12px;
  animation: wing-flap-left 2.8s ease-in-out infinite;
}

.pet-wing-right {
  transform-origin: 28px 12px;
  animation: wing-flap-right 2.8s ease-in-out infinite;
}

.pet-glow-aura {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 167, 38, 0.35) 0%, transparent 70%);
  filter: blur(6px);
  pointer-events: none;
  animation: aura-pulse 3s ease-in-out infinite;
}

.pet-name-pill {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #F9A825 0%, #ED5B00 100%);
  padding: 2px 8px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(237, 91, 0, 0.4);
  white-space: nowrap;
}

/* 动效 Keyframes */
@keyframes pet-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes wing-flap-left {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-10deg);
  }
}

@keyframes wing-flap-right {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@keyframes aura-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.15);
  }
}

/* 气泡弹跳过渡 */
.bubble-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bubble-pop-leave-active {
  transition: all 0.22s ease-in;
}
.bubble-pop-enter-from {
  opacity: 0;
  transform: scale(0.8) translateX(12px);
}
.bubble-pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(8px);
}

/* 小精灵进场淡出 */
.pet-enter-enter-active,
.pet-enter-leave-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.25, 0.64, 1);
}
.pet-enter-enter-from,
.pet-enter-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.85);
}

/* 浮动对话弹窗 */
.chat-dialog-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-popover, 500);
  width: min(450px, calc(100vw - 32px));
  height: min(650px, calc(100vh - 56px));
  border-radius: 20px;
  background-color: rgba(22, 23, 27, 0.95);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(229, 158, 43, 0.25);
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.85), 
              0 0 24px -4px rgba(229, 158, 43, 0.2), 
              inset 0 1px 1px rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶栏迷你条 */
.dialog-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(30, 32, 38, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.bar-tag {
  font-size: 10px;
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  color: var(--brand-primary, #e59e2b);
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.dialog-close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary, #90949d);
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dialog-close-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.12);
  transform: rotate(90deg);
}

.dialog-inner-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.widget-panel-enter-active,
.widget-panel-leave-active {
  transition: opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

.widget-panel-enter-from,
.widget-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 640px) {
  .simu-pet-container {
    bottom: 20px;
    right: 0;
  }
  .pet-speech-bubble {
    max-width: 200px;
  }
  .chat-dialog-panel {
    bottom: 10px;
    right: 10px;
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
    border-radius: 16px;
  }
}
</style>
