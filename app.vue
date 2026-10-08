<template>
  <div class="app">
    <NuxtLoadingIndicator color="#F9A825" :height="3" :duration="2000" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  useSeoMeta({
    // 网站标题
    title: "Simurg Reader - 一千零一夜的故事正在被重写",
    // 网站描述
    description: "Simurg Reader 是一个在线小说阅读与创作平台，汇集海量精品小说，提供沉浸式阅读体验。",
    // 搜索关键字
    keywords: "小说阅读,在线小说,Simurg Reader,创作平台,免费小说"
  })
</script>

<style lang="scss" scoped>

</style>