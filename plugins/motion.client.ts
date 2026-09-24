import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // 检查用户是否开启了系统级减弱动效偏好
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * v-reveal 指令
   * 用法: <div v-reveal> 或 <div v-reveal="{ delay: 100 }">
   * 功能: 当元素进入视口约 8% 时添加 .is-revealed 类，触发平滑入场并解除监听
   */
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-revealed');
        return;
      }

      el.classList.add('reveal-on-scroll');

      if (binding.value?.delay) {
        el.style.transitionDelay = `${binding.value.delay}ms`;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('is-revealed');
              obs.unobserve(el);
            }
          });
        },
        {
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08
        }
      );

      observer.observe(el);
      // 挂载 observer 实例以便卸载时清理
      (el as any)._revealObserver = observer;
    },
    unmounted(el: HTMLElement) {
      if ((el as any)._revealObserver) {
        (el as any)._revealObserver.disconnect();
        delete (el as any)._revealObserver;
      }
    }
  });
});
