<template>
  <Transition name="back-to-top-fade">
    <button 
      v-if="visible" 
      class="back-to-top-btn"
      @click="scrollToTop"
      aria-label="回到顶部"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const visible = ref(false);

const handleScroll = () => {
  visible.value = window.scrollY > 320;
};

const scrollToTop = () => {
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth' 
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 80px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--bg-surface-3);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  z-index: var(--z-sticky);
  transition: transform var(--duration-small) var(--ease-out-smooth),
              background var(--duration-small) var(--ease-standard),
              border-color var(--duration-small) var(--ease-standard),
              color var(--duration-small) var(--ease-standard);
  backdrop-filter: blur(8px);
}

.back-to-top-btn:hover {
  transform: translateY(-3px);
  background: var(--brand-primary);
  border-color: var(--brand-hover);
  color: var(--text-inverse);
  box-shadow: var(--shadow-lg);
}

.back-to-top-btn:active {
  transform: translateY(-1px) scale(0.96);
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity var(--duration-small) var(--ease-standard),
              transform var(--duration-small) var(--ease-out-smooth);
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .back-to-top-btn {
    bottom: 74px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}
</style>
