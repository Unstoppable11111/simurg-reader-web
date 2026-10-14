<template>
  <div class="user-page">
    <div class="redirect-hint">
      <div class="spinner"></div>
      <p>正在前往个人中心...</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn } = useAuth()

onMounted(() => {
  if (isLoggedIn.value) {
    navigateTo('/bookshelf', { replace: true })
  } else {
    navigateTo('/login?redirectPath=/bookshelf', { replace: true })
  }
})
</script>

<style scoped>
.user-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #b0b1b3;
}
.redirect-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(249, 168, 37, 0.2);
  border-top-color: #f9a825;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
