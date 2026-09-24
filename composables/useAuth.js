// composables/useAuth.js
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  const userName = computed(() => authStore.user?.username || '')
  const userAvatar = computed(() => authStore.user?.avatar || '/images/default-avatar.png')

  return {
    isLoggedIn: computed(() => authStore.isLoggedIn),
    isAuthor: computed(() => authStore.isAuthor),
    userName,
    userAvatar,
    userId: computed(() => authStore.user?.uuid),
  }
}