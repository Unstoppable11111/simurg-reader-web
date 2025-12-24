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
        <span class="author-work-num"> {{ authorInfo?.bookCount || 0}} </span>
      </div>
      <div class="author-reader-num-box">
        <label class="author-reader-num-label">累计读者</label>
        <span class="author-reader-num">0</span>
      </div>
      <div class="author-word-num-box">
        <label class="author-word-num-label">累计字数</label>
        <span class="author-word-num"> {{ authorInfo?.totalCompletedWords || 0}} </span>
      </div>
    </div>

    <!-- 作品小说 -->
    <div class="author-works-box">
      <div style="position: relative;height: 68px;">
        <label class="author-works-box-title">作品小说</label>
        <span class="to-work-management" @click="handleMoreWork">更多<el-icon><ArrowRight /></el-icon></span>
      </div>
      <!-- 作者作品管理 -->
      <div v-if="true" class="author-works-content-box">
        <div class="author-create-book-box">
          <el-upload
            class="create-book-img-upload"
            action="http://localhost:8082/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="coverImageUrl" :src="coverImageUrl" class="create-book-img" />
            <el-icon v-else class="book-img-upload-icon"><Plus /></el-icon>
          </el-upload>
          <div class="create-book-info">
            <span class="create-book-title">来创作新书吧~</span>
            <span class="create-book-desc">码字码字</span>
            <button class="create-book-btn" @click="handleCreateBook">新建小说</button>
          </div>
        </div>

        <div class="author-recent-book-box">
          <img class="book-img" :src="authorBookInfo.coverImageUrl" alt="">
          <div class="book-info">
            <span class="book-title">{{ authorBookInfo.title }}</span>
            <span class="book-update-info">最近更新：{{ authorBookInfo.currentChapterTitle }}</span>
            <div class="book-detail-info-box">
              <span class="book-chapter-count">{{ authorBookInfo.totalChapters }}章</span>
              <span class="divider"></span>
              <span class="book-word-count">{{ authorBookInfo.totalCharCount }}字</span>
              <span class="divider"></span>
              <span class="book-status">{{ formatSerialStatus(authorBookInfo.serialStatus) }}</span>
            </div>
            <div class="book-btn-box">
              <button class="edit-book-btn" @click="handleOpenBookSetting()">作品设置</button>
              <button class="create-chapter-btn" @click="handleCreateChapter">创建章节</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 如果作者还没创建作品，则展示空的盒子 -->
      <div v-else class="empty-box">
        <img class="empty-img" src="" alt="">
        <label class="empty-label">你还没有作品，快去创建你的新作品吧～</label>
        <button class="to-write-book" @click="handleCreateBook">新建小说</button>
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
  import type { CalendarInstance, CalendarDateType} from 'element-plus'
  import {Plus, ArrowRight } from '@element-plus/icons-vue'
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';

  const props = defineProps<{
    authorInfo: any
  }>()
  const emit = defineEmits(['to-edit-book', 'to-work-management', 'to-create-book']);
  const router = useRouter();
  const authorBookInfo = ref({});
  const coverImageUrl = ref('')
  const { userAvatar, userName } = useAuth();
  const calendar = ref<CalendarInstance>()

  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    console.log('handleAvatarSuccess', uploadFile)
    console.log('response', response)
    coverImageUrl.value = response.data
  }

  const allowImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const allowExts = ['jpg', 'jpeg', 'png', 'gif'];
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    console.log('beforeAvatarUpload', rawFile)
    const fileExt = rawFile.name.split('.').pop().toLowerCase();
    // 双重验证：MIME类型 或 后缀名
    if (!allowImageTypes.includes(rawFile.type) && !allowExts.includes(fileExt)) {
      ElMessage.error('仅支持上传 jpg/jpeg/png/gif 格式的图片！');
      return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('Avatar picture size can not exceed 2MB!')
      return false
    }
    return true
  }
  const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return
    calendar.value.selectDate(val)
  }
  // 点击更多跳转到作品管理列表 
  const handleMoreWork = () => {
    emit('to-work-management');
  }
  // 跳转到创建新书
  const handleCreateBook = () => {
    console.log("handleCreateBook");
    emit('to-create-book');
  }

  // 作品设置按钮处理逻辑
  const handleOpenBookSetting = () => {
    if (!authorBookInfo.value || !authorBookInfo.value.bookId) {
      ElMessage.warning('暂无书籍信息');
      return;
    }
    // 发射事件给 index.vue，携带当前书籍信息
    emit('to-edit-book', authorBookInfo.value);
  }
  // 创建章节按钮处理函数
  const handleCreateChapter = () => { 
    console.log('handleCreateChapter');
    if (!authorBookInfo.value || !authorBookInfo.value.bookId) {
      ElMessage.warning('暂无书籍信息，无法创建章节');
      return;
    }
    
    const bookDataStr = JSON.stringify(authorBookInfo.value);
    // 这里保持与 WorkManagement 一致的编码逻辑
    const encodedBookData = btoa(encodeURIComponent(bookDataStr)); 
    
    router.push({
      path: '/author/writeBook',
      query: {
        bookId: authorBookInfo.value.bookId,
        bookData: encodedBookData,
        from: 'create-chapter',
        opType: 'createChapter'
      }
    });
  }
  // 获取作者书籍列表
  const getAuthorBookInfo = async () => { 
    try { 
      // 获取当前作者所有未发布的书籍
      const authorBookListResult = await apiRequest(API_ENDPOINTS.LIST_ALL_BOOS_BY_AUTHOR, {
        method: 'GET'
      });
      console.log("获取作者未发布书籍列表", authorBookListResult);
      if (authorBookListResult.code === 200 && authorBookListResult.data) {
        authorBookInfo.value = authorBookListResult.data[0];
      }
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => { 
    getAuthorBookInfo();
  })

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
  cursor: pointer;
  display: flex;
  align-items: center;
}
.author-works-content-box {
  display: flex;
  margin-top: 12px;
}
.author-create-book-box { 
  display: flex;
  width: 468px;
  height: 152px;
  margin-left: 24px;
}
.create-book-img-upload {
  display: flex;
  width: 114px;
  height: 152px;
  background: #A2A0A0;
  border-radius: 4px;
  justify-content: center;
}
.create-book-img {
  width: 114px;
  height: 152px;
  border-radius: 4px;
}
.book-img-upload-icon {
  font-size: 38px;
  color: #424242;
}
.create-book-info {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}
.create-book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.create-book-desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #999797;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 10px;
}
.create-book-btn {
  width: 120px;
  height: 28px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  margin-top: 75px;
}
.author-recent-book-box {
  display: flex;
  margin-left: 32px;
}
.book-img {
  width: 114px;
  height: 152px;
  background: #424242;
}
.book-info {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}
.book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.book-update-info {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #999797;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 10px;
}
.book-detail-info-box {
  display: flex;
  margin-top: 42px;
}
.book-chapter-count, .book-word-count, .book-status {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-right: 10px;
}
.book-btn-box {
  margin-top: 16px;
}
.edit-book-btn, .create-chapter-btn {
  width: 120px;
  height: 28px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 17px;
  text-align: center;
  font-style: normal;
}
.create-chapter-btn {
  margin-left: 32px;
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