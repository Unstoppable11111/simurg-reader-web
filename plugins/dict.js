import { useDictStore } from "@/stores/dict";

export default defineNuxtPlugin((nuxtApp) => {
  // 1. 获取 Nuxt3 封装的 Vue Router 实例
  const router = nuxtApp.$router;

  // 2. 监听路由守卫：进入页面之前（等价于 Vue Router 的 beforeEach）
  router.beforeEach(async (to, from, next) => {
    // 3. 获取字典 Store（Nuxt3 会自动处理服务端/客户端的实例隔离）
    const dictStore = useDictStore();

    // 4. 预加载字典：未加载则等待完成，已加载则直接放行
    if (!dictStore.isLoaded) {
      await dictStore.fetchDictMap(); // 等待字典请求完成
    }

    // 5. 放行路由（Nuxt3 中 next() 可选，也可直接 return）
    next();
    // 或用 return 控制：return true（放行）/ return false（拦截）/ return '/login'（跳转）
  });

  // 可选：监听路由后置钩子（页面进入后执行，如埋点、日志）
  router.afterEach((to, from) => {
    console.log(`从 ${from.path} 跳转到 ${to.path}`);
  });
});