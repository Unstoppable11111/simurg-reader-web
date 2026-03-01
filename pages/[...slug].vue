<!-- pages/[...slug].vue -->
<template>
  <div class="page-404">
    <h1>页面未找到</h1>
    <p>你访问的路径不存在</p>
    <NuxtLink to="/">返回首页</NuxtLink>
  </div>
</template>

<script setup>
// 可选：如果想让某些路径跳转到指定页面（比如 /settings 跳转到 /profile）
const route = useRoute()
const router = useRouter()

onMounted(() => {
  const { path } = route
  // 自定义路径重定向规则
  const redirectMap = {
    '/copyright-complaint': '/',
    '/partners': '/about',
    '/settings': '/profile',
    '/contact-info': '/contact'
  }
  if (redirectMap[path]) {
    router.replace(redirectMap[path])
  }
})
</script>