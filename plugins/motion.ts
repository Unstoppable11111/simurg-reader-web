import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * v-reveal 指令
   * 用法: <div v-reveal> 或 <div v-reveal="{ delay: 100 }">
   * 支持客户端 IntersectionObserver 视口平滑入场
   * 支持 SSR 服务端渲染（提供 getSSRProps 钩子防止 hydration 报错）
   */
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (typeof window === 'undefined') return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      (el as any)._revealObserver = observer;
    },
    unmounted(el: HTMLElement) {
      if ((el as any)._revealObserver) {
        (el as any)._revealObserver.disconnect();
        delete (el as any)._revealObserver;
      }
    },
    // 关键：在服务端渲染执行时返回空属性，避免 @vue/server-renderer 抛出 getSSRProps 未定义异常
    getSSRProps() {
      return {};
    }
  });
});
