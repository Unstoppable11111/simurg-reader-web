<!-- components/author/AuthorHome.vue -->
<template>
  <div class="author-home-content">
    <!-- 作者信息 -->
    <div class="author-info-box">
      <img class="author-avatar" :src="userAvatar" alt="">
      <div class="author-info">
        <div class="author-name"> {{userName}}，晚上好啊</div>
        <div class="welcome-author-desc">今天是你在simurg reader创作的第1天，继续努力码字吧~</div>
      </div>
      <div class="author-work-num-box">
        <label class="author-work-num-label">作品数量</label>
        <span class="author-work-num"> {{ authorInfo.bookCount }} </span>
      </div>
      <div class="author-reader-num-box">
        <label class="author-reader-num-label">累计读者</label>
        <span class="author-reader-num">0</span>
      </div>
      <div class="author-word-num-box">
        <label class="author-word-num-label">累计字数</label>
        <span class="author-word-num"> {{ authorInfo.totalCompletedWords }} </span>
      </div>
    </div>

    <!-- 作品小说 -->
    <div class="author-works-box">
      <div style="position: relative;height: 68px;">
        <label class="author-works-box-title">作品小说</label>
        <NuxtLink to="/" class="to-work-management">更多</NuxtLink>
      </div>
      <!-- 如果作者还没创建作品，则展示空的盒子 -->
      <div class="empty-box">
        <img class="empty-img" src="" alt="">
        <label class="empty-label">你还没有作品，快去创建你的新作品吧～</label>
        <NuxtLink to="/author/writeBook" class="to-write-book">新建小说</NuxtLink>
      </div>
    </div>
    <el-calendar ref="calendar" class="calendar">
      <template #header="{ date }">
        <span class="calendar-title">作者更新日历</span>
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')" class="calendar-btn">
            Previous Year
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')" class="calendar-btn">
            Previous Month
          </el-button>
          <el-button size="small" @click="selectDate('today')" class="calendar-btn">Today</el-button>
          <el-button size="small" @click="selectDate('next-month')" class="calendar-btn">
            Next Month
          </el-button>
          <el-button size="small" @click="selectDate('next-year')" class="calendar-btn">
            Next Year
          </el-button>
        </el-button-group>
      </template>
    </el-calendar>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { CalendarInstance, CalendarDateType } from 'element-plus'

const props = defineProps<{
  authorInfo: any
}>()

const { userAvatar, userName } = useAuth();
const calendar = ref<CalendarInstance>()

const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
</script>

<style lang="scss" scoped>
/* 移动原文件中的相关样式到这里 */
.author-home-content {
  display: flex;
  flex-direction: column;
}
.author-info-box {
  display: flex;
  align-items: center;
  width: 1016px;
  height: 146px;
  background: #424242;
  border-radius: 6px;
}
.author-avatar { 
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 12px;
  margin-left: 38px;
}
.author-info {
  flex: 1;
}
.author-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.welcome-author-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.author-work-num-box,
.author-reader-num-box,
.author-word-num-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.author-reader-num-box,
.author-word-num-box { 
  margin-left: 76px;
}
.author-work-num-box {
  margin-left: 176px;
}
.author-work-num-label,
.author-reader-num-label,
.author-word-num-label { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #A2A0A0;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}
.author-work-num,
.author-reader-num,
.author-word-num { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 8px;
}
.author-works-box {
  width: 1016px;
  height: 287px;
  background: #424242;
  border-radius: 6px;
  margin-top: 16px;
}
.author-works-box-title {
  position: absolute;
  top: 24px;
  left: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}
.to-work-management {
  position: absolute;
  top: 24px;
  right: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #A2A0A0;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-img {
  width: 100px;
  height: 100px;
  background: #A2A0A0;
}
.empty-label {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #999797;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 7px;
}
.to-write-book {
  width: 200px;
  height: 49px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  text-align: center;
  line-height: 49px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  font-style: normal;
  margin-top: 12px;
}
.calendar {
  width: 625px;
  background: #424242;
  border-radius: 6px;
  margin-top: 16px;
  :deep(.el-calendar__header) {
    display: block !important;
  }
  :deep(td.is-selected) {
    background-color: #ff984e;
  }
  :deep(.el-calendar-day:hover) {
    background: #ff984e;
  }
   :deep(.el-calendar-table td:hover) {
    background-color: #ff984e !important;
    color: #ffffff !important;
  }
}
.calendar-title { 
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.calendar-btn {
  background: #a2a0a0;
  border: 1px solid #a2a0a0;
  &:hover { 
    cursor: pointer;
    color: #ff984e;
  }
}
</style>