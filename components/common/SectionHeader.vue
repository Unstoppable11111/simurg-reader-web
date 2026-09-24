<template>
  <div class="section-header">
    <div class="header-left">
      <h2 class="section-title">{{ title }}</h2>

      <!-- 现代极简线条微标（与文字字体完美契合） -->
      <span v-if="iconName" class="section-icon-badge" aria-hidden="true">
        <!-- 1. 推荐：极简罗盘/导向标（彻底替换突兀的点赞大拇指） -->
        <svg v-if="iconName === 'recommend'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.6"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>
        </svg>

        <!-- 2. 精选：精致四芒星徽 -->
        <svg v-else-if="iconName === 'featured' || iconName === 'feature-noval'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" fill-opacity="0.2"/>
        </svg>

        <!-- 3. 排行榜：极简荣誉奖杯 -->
        <svg v-else-if="iconName === 'ranking'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 3h16v7a8 8 0 0 1-16 0V3z"/>
          <path d="M12 18v3M8 21h8"/>
        </svg>

        <!-- 4. 分类：极简 2x2 矩阵网格 -->
        <svg v-else-if="iconName === 'category' || iconName === 'i-category'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.2"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.2"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        </svg>

        <!-- 5. 最近更新：极简时钟脉冲标 -->
        <svg v-else-if="iconName === 'recent' || iconName === 'recent-updates'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 7 12 12 15 15"/>
        </svg>

        <!-- 兜底图标 -->
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="8"/>
        </svg>
      </span>

      <slot name="extra" />
    </div>

    <div class="header-right">
      <slot name="action">
        <NuxtLink 
          v-if="moreLink" 
          :to="moreLink" 
          class="more-link"
          :aria-label="`查看更多${title}`"
        >
          <span>{{ moreText }}</span>
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  iconName?: string;
  moreLink?: string;
  moreText?: string;
}

withDefaults(defineProps<Props>(), {
  iconName: '',
  moreLink: '',
  moreText: '更多'
});
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--space-6);
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.section-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-h2);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.section-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--brand-primary, #e59344);
  flex-shrink: 0;
  transition: transform var(--duration-small) var(--ease-standard);
  opacity: 0.95;
}

.section-header:hover .section-icon-badge {
  transform: scale(1.08);
}

.header-right {
  display: flex;
  align-items: center;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-small) var(--ease-standard),
              transform var(--duration-small) var(--ease-standard);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.more-link:hover {
  color: var(--brand-primary);
  transform: translateX(2px);
}

.arrow-icon {
  transition: transform var(--duration-small) var(--ease-standard);
}

.more-link:hover .arrow-icon {
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .section-header {
    margin-bottom: var(--space-4);
  }
  .section-title {
    font-size: var(--text-h3);
  }
  .section-icon-badge {
    width: 18px;
    height: 18px;
  }
  .section-icon-badge svg {
    width: 18px;
    height: 18px;
  }
}
</style>
