<template>
  <div class="last-update-book-box">
    <div class="last-update-book-list">
      <div class="table-header">
        <div class="th th-book-name">书名</div>
        <div class="th th-book-content-name">最新章节</div>
        <div class="th th-book-author">作者</div>
        <div class="th th-type">类型</div>
        <div class="th th-book-update-time">更新时间</div>
      </div>
      <div class="table-body">
        <div 
          v-for="book in recentUpdateBooks" 
          :key="book.id" 
          class="table-row"
        >
          <div class="tr th-book-name">{{ book.title }}</div>
          <div class="tr th-book-content-name">{{ book.chapterTitle }}</div>
          <div class="tr th-book-author">{{ book.authorPenName }}</div>
          <div class="tr th-type">{{ book.bookCategoryResponseList && book.bookCategoryResponseList.length > 0 
              ? book.bookCategoryResponseList[0].categoryName 
              : '' }}</div>
          <div class="tr th-book-update-time">{{ formatTimestamp(book.lastUpdateTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { formatTimestamp } from '@/utils/dataFormatter';
  const props = defineProps({
      recentUpdateBooks: {
        type: Array,
        default: () => [],
        required: true
      }
  })


</script>

<style lang="scss" scoped>
.last-update-book-box {
  width: 1200px;
}
.table-header {
  display: flex;
  flex-direction: row;
  gap: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 21px;
  color: #DADADA;
  line-height: 29px;
  text-align: left;
  font-style: normal;
  border-bottom: 1px solid #434343;
}

.th-type {
  width: 166px;
  height: 68px;
  line-height: 68px;
  padding-left: 20px;
   // 添加以下样式实现单行显示和省略号效果
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.th-book-name {
  width: 332px;
  height: 68px;
  line-height: 68px;
   // 添加以下样式实现单行显示和省略号效果
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.th-book-content-name {
  width: 358px;
  height: 68px;
  line-height: 68px;
   // 添加以下样式实现单行显示和省略号效果
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.th-book-author {
  width: 216px;
  height: 68px;
  line-height: 68px;
   // 添加以下样式实现单行显示和省略号效果
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.th-book-update-time {
  width: 210px;
  height: 68px;
  line-height: 68px;
   // 添加以下样式实现单行显示和省略号效果
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-row { 
  display: flex;
  flex-direction: row;
  gap: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 21px;
  color: #DADADA;
  line-height: 29px;
  text-align: left;
  font-style: normal;
  border-bottom: 1px solid #434343;
}
.table-row div {
   &:hover {
    color: #ED5B00;
    cursor: pointer;
  }
}
.th {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #747474;
  text-align: left;
  font-style: normal;
  }
.table-row .tr {
  height: 68px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #DADADA;
  line-height: 68px;
  text-align: left;
  font-style: normal;
}
</style>