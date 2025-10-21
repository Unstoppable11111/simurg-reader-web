// composables/useAuth.js
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  const setAuthCookies = (authData) => {
    authStore.handleLoginSuccess(
      authData.user,
      authData.accessToken,
      'account' // 这里根据实际登录方式调整
    )
  }
  
  const checkAuth = () => {
    console.log('校验登录状态', authStore.isLoggedIn)
    return authStore.isLoggedIn
  }
  
  return {
    setAuthCookies,
    checkAuth,
    logout: authStore.logout,
    user: computed(() => authStore.user),
    isLoggedIn: computed(() => authStore.isLoggedIn)
  }
}