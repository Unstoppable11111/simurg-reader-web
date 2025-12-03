<!-- components/HistoryContent.vue -->
<template>
  <div class="history-content">
    <div class="add-book-btn-box">
      <button class="add-book-btn">点击添加你喜欢的小说</button>
    </div>
  </div>
</template>

<script setup>
// 历史记录组件可以根据需要添加更多功能
</script>

<style lang="scss" scoped>
.history-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-book-btn-box { 
  width: 228px;
  height: 302px;
  background: #424242;
  border-radius: 6px;
  text-align: center;
  line-height: 315px;
}
.add-book-btn {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
</style>