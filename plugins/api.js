export default defineNuxtPlugin(() => {
  $fetch.create({
    onRequest({ request, options }) {
      if (process.client) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          options.headers = {
            ...options.headers,
            'Authorization': token
          };
        }
      }
    },
    
    onResponse({ response }) {
      // 响应拦截器 - 处理认证错误
      if (response._data?.code === 2008) {
        // 清除本地存储
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_method');
        
        // 重定向到登录页
        if (process.client) {
          window.location.href = '/login';
        }
      }
    }
  })
})