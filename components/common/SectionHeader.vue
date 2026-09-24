<template>
  <div class="section-header">
    <div class="header-left">
      <h2 class="section-title">{{ title }}</h2>
      <SvgIcon 
        v-if="iconName" 
        :name="iconName" 
        class="section-icon" 
        size="24" 
        color="currentColor"
        aria-hidden="true"
      />
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
import SvgIcon from '@/components/SvgIcon.vue';

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

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--brand-primary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .section-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
