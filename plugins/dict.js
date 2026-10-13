import { useDictStore } from "@/stores/dict";

export default defineNuxtPlugin((nuxtApp) => {
  // 1. 获取 Nuxt3 封装的 Vue Router 实例
  const router = nuxtApp.$router;

  // 2. 监听路由守卫：进入页面之前
  router.beforeEach(async (to, from, next) => {
    // 核心新增逻辑：判断是否是倒计时页面
    const isCountdownPage = to.path === '/countdown';
    
    // 如果是倒计时页面，直接放行，不处理字典加载
    if (isCountdownPage) {
      next();
      return; // 终止后续逻辑，避免执行字典加载
    }

    // 非倒计时页面，仍保留原有字典加载逻辑
    const dictStore = useDictStore();
    if (!dictStore.isLoaded) {
      await dictStore.fetchDictMap(); // 等待字典请求完成
    }

    // 放行路由（Nuxt3 中 next() 可选，也可直接 return）
    next();
    // 或用 return 控制：return true（放行）/ return false（拦截）/ return '/login'（跳转）
  });

  // 可选：监听路由后置钩子（页面进入后执行，如埋点、日志）
  router.afterEach((to, from) => {
    console.log(`从 ${from.path} 跳转到 ${to.path}`);
  });
});