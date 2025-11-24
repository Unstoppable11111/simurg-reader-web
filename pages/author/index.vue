<template>
  <div class="author-page">
    <Header :margin-left="'360px'" :isAuthor="true"/>
    <div class="author-container">
      <div class="author-left-nav-box">
        <div class="nav-list">
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'author-home' }"
            @click="switchNav('author-home')"
          >
            作者首页
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'work-management' }"
            @click="switchNav('work-management')"
          >
            作品管理
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'work-data' }"
            @click="switchNav('work-data')"
          >
            作品数据
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'income-management' }"
            @click="switchNav('income-management')"
          >
            收入管理
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'personal-info' }"
            @click="switchNav('personal-info')"
          >
            个人信息
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'notifications' }"
            @click="switchNav('notifications')"
          >
            消息通知
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'benefits' }"
            @click="switchNav('benefits')"
          >
            福利中心
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeNav === 'contracts' }"
            @click="switchNav('contracts')"
          >
            我的合同
          </div>
        </div>
      </div>
      <div class="author-right-content-box">
        <!-- 作者首页内容 -->
        <div v-if="activeNav === 'author-home'" class="author-home-content">
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

        <!-- 作品管理内容 -->
        <div v-if="activeNav === 'work-management'" class="author-content-section">
          <div v-if="!showCreateBookFlag">
            <div class="work-management-title-box">
              <span class="author-work-title">我的小说</span>
              <span class="create-novel" @click="createBook">创建小说</span>
            </div>
            <div class="work-item-list">
              <div class="work-item">
                <img class="work-book-img" src="https://www.tata2025.xyz/uploads/2025/09/19/ed9bd8e3-3eee-494c-a890-068b6cce18f7.png" alt="">
                <div class="work-book-info">
                  <span class="work-book-title">穿越七零：大佬的小作精又娇又飒</span>
                  <span class="work-update-info">最近更新：暂未发布章节</span>
                  <div class="work-book-detail-info">
                    <span class="work-book-chapter">0章</span>
                    <div class="divider"></div>
                    <span class="work-book-count">0字</span>
                    <div class="divider"></div>
                    <span class="work-status">连载中</span>
                  </div>
                </div>
                <button class="work-chapter-manage-btn" @click="manageChapter">章节管理</button>
                <button class="work-create-chapter-btn" @click="createChapter">创建章节</button>
              </div>
            </div>
            <div class="content-placeholder">
              <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
              <p>功能开发中...</p>
            </div>
          </div>

          <div v-else class="create-book-form-box">
            <div class="create-book-title-box"><
              <span class="create-book-title">创建小说</span>
            </div>
            <el-form
              class="create-book-form"
              ref="ruleFormRef"
              style="max-width: 600px"
              :model="ruleForm"
              :rules="rules"
              label-width="auto"
            >
              <el-upload
                class="create-book-img-upload"
                action="http://localhost:8082/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="coverImageUrl" :src="ruleForm.coverImageUrl" class="create-book-img" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-warn-info-box">
                <div class="upload-warn-info-title">温馨提示</div>
                <ul>
                  <li>书封尺寸为3:4，支持 jpg/png格</li>
                  <li>请保证封面图、书名、作者名清晰，信息正确，否则影响流量推荐</li>
                </ul>
              </div>
              <el-form-item class="create-book-label" label="书本名称" prop="bookName">
                <el-input class="create-book-input" v-model="ruleForm.bookName" placeholder="请输入作品名称，2-30字内"/>
              </el-form-item>

              <el-form-item class="create-book-label" label="作品分类" prop="bookCategoryList">
                <el-select class="create-book-select" v-model="ruleForm.bookCategoryList" placeholder="请选择作品类型" multiple>
                  <el-option label="科技末世" value="1" />
                  <el-option label="历史脑洞" value="2" />
                  <el-option label="悬疑脑洞" value="3" />
                  <el-option label="传统玄幻" value="4" />
                </el-select>
              </el-form-item>

              <el-form-item class="create-book-label" label="作品标签" prop="bookTagList">
                <el-select class="create-book-select" v-model="ruleForm.bookTagList" placeholder="请选择标签" multiple>
                  <el-option label="历史脑洞" value="2" />
                  <el-option label="悬疑脑洞" value="3" />
                  <el-option label="传统玄幻" value="4" />
                </el-select>
              </el-form-item>

              <el-form-item class="create-book-label" label="主角介绍" prop="bookProtagonist">
                <el-input class="create-book-input" v-model="ruleForm.bookProtagonist" placeholder="请输入主角介绍"/>
              </el-form-item>
              
              <el-form-item class="create-book-label" label="作品简介" prop="bookDesc">
                <el-input 
                    class="create-book-input" 
                    v-model="ruleForm.bookDesc" 
                    placeholder="请输入50-500字以内的作品简介，不可出现低俗、暴力、血腥等不符合法律法规的内容"
                    type="textarea"/>
              </el-form-item>

              <!--  -->
               <el-form-item class="agree-protocol-checkbox" label="" prop="agreeProtocol">
                  <el-checkbox class="agree-protocol-label" v-model="ruleForm.agreeProtocol">我已阅读并同意</el-checkbox>
                  <NuxtLink to="/" class="personal-info-protection">《个人信息保护声明》</NuxtLink>
              </el-form-item>

              <el-form-item class="create-book-btn-box">
                <el-button class="cancel-create-book-btn" @click="cancle">取消</el-button>
                <el-button class="create-book-btn" @click="continueCreateChapter(ruleFormRef)">确认创建</el-button>
              </el-form-item>
            </el-form>
            
          </div>
          
        </div>


        <!-- 作品数据内容 -->
        <div v-if="activeNav === 'work-data'" class="author-content-section">
          <h2>作品数据</h2>
          <p>查看你的作品统计数据</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 收入管理内容 -->
        <div v-if="activeNav === 'income-management'" class="author-content-section">
          <h2>收入管理</h2>
          <p>查看和管理你的收入</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 个人信息内容 -->
        <div v-if="activeNav === 'personal-info'" class="author-content-section">
          <div class="personal-info-title">个人信息</div>
          <p>编辑和管理你的个人信息</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 消息通知内容 -->
        <div v-if="activeNav === 'notifications'" class="author-content-section">
          <h2>消息通知</h2>
          <p>查看系统消息和通知</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 福利中心内容 -->
        <div v-if="activeNav === 'benefits'" class="author-content-section">
          <h2>福利中心</h2>
          <p>查看可享受的福利和活动</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>

        <!-- 我的合同内容 -->
        <div v-if="activeNav === 'contracts'" class="author-content-section">
          <h2>我的合同</h2>
          <p>查看和管理你的合同</p>
          <div class="content-placeholder">
            <img src="/public/images/simurg-reader-logo.png" alt="Placeholder" class="placeholder-image">
            <p>功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from "@/components/layout/Header.vue";
  import { useAuth } from '@/composables/useAuth';
  import type { FormInstance, FormRules, UploadProps } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
import { rule } from "postcss";
  const {isLoggedIn, isAuthor, userAvatar, userName, userId} = useAuth();
  const router = useRouter();
  const route = useRoute();
  const authorInfo = ref(null);
  const showCreateBookFlag = ref(false)
  const coverImageUrl = ref('')
  const ruleFormRef = ref<FormInstance>()
  // 定义响应式数据，跟踪当前激活的导航项
  const activeNav = ref('author-home');
  interface RuleForm {
    bookName: string
    bookCategoryList: String[]
    bookTagList: string[]
    bookProtagonist: string
    bookDesc: string
    agreeProtocol: boolean
    coverImageUrl: string
  }
  const ruleForm = reactive<RuleForm>({
    bookName: '',
    bookCategoryList: [],
    bookTagList: [],
    bookProtagonist: '',
    bookDesc: '',
    agreeProtocol: false,
    coverImageUrl: ''
  })
  const locationOptions = ['Home', 'Company', 'School']
  const calendar = ref<CalendarInstance>()
  const rules = reactive<FormRules<RuleForm>>({
    bookName: [
      { required: true, message: 'Please input Book name', trigger: 'blur' },
      { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
    ],
    bookCategoryList: [
      { required: true, message: 'Please select Book category', trigger: 'change' },
    ],
    bookTagList: [
      { required: true, message: 'Please select Book tag', trigger: 'change' },
    ],
    bookProtagonist: [
      { required: true, message: 'Please input Book protagonist', trigger: 'blur' },
      { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
    ],
    bookDesc: [
      { required: true, message: 'Please input Book description', trigger: 'blur' },
      { min: 50, max: 500, message: 'Length should be 50 to 500', trigger: 'blur' },
    ],
    agreeProtocol: [
      { required: true, message: 'Please agree to the protocol', trigger: 'change' },
      { type: 'boolean', message: 'Please agree to the protocol', trigger: 'change' },
    ],
    coverImageUrl: [
      { required: true, message: 'Please select Book cover image', trigger: 'change' },
    ],
  })

  watch(
    () => route.query.tab,
    (newTab) => {
      if (newTab && ['work-data', 'income-management', 'personal-info', 'notifications', 'benefits', 'contracts'].includes(newTab)) {
        activeNav.value = newTab
      }
    },
    {immediate: true}
  )

  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    console.log('handleAvatarSuccess', uploadFile)
    console.log('response', response)
    coverImageUrl.value = response.data
    ruleForm.coverImageUrl = response.data
  }

  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    console.log('beforeAvatarUpload', rawFile)
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('Avatar picture must be JPG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('Avatar picture size can not exceed 2MB!')
      return false
    }
    return true
  }

  // 继续创建章节
  const continueCreateChapter = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
        const bookDataStr = JSON.stringify(ruleForm);
        const encodedBookData = btoa(encodeURIComponent(bookDataStr)) // 先 encodeURIComponent 防止特殊字符问题
        router.push({
          path: '/author/writeBook',
          query: {
            bookData: encodedBookData,
          }
        })
      } else {
         ElMessage.error('缺少必填字段！')
      }
    })
  }
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  const options = Array.from({ length: 10000 }).map((_, idx) => ({
    value: `${idx + 1}`,
    label: `${idx + 1}`,
  }))

  // 获取分类书籍
  const bookCateResult = await apiRequest(API_ENDPOINTS.LIST_ALL_BOOK_CATEGORY, {
    method: 'POST',
  });
  console.log("分类书籍响应数据：", bookCateResult);

  console.log("userId", userId.value);
  // 查询作者信息
  const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}${userId.value}`;
  const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
    method: 'GET'
  });
  console.log("作者信息：", authorInfoResult);
  authorInfo.value = authorInfoResult.data;

  // 查询作者书籍列表
  const authorBookList = await apiRequest(API_ENDPOINTS.LIST_AUTHOR_BOOKS, {
    method: 'GET'
  });
  console.log("作者书籍列表：", authorBookList);

  // 切换导航的方法
  const switchNav = (nav) => {
    activeNav.value = nav;
  };

  const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return
    calendar.value.selectDate(val)
  }

  const createBook = () => {
    console.log("创建小说");
    showCreateBookFlag.value = true;
    nextTick(() => {
      console.log('DOM 更新完成')
    })
  }

  onMounted(() => {
    if (route.query.tab) {
      activeNav.value = route.query.tab;
    }
  });
</script>

<style lang="scss" scoped>
.author-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.author-container {
  display: flex;
  color: #fff;
  margin-top: 122px;
}
.author-left-nav-box {
  width: 220px;
  text-align: center;
}
.nav-list {
  display: flex;
  flex-direction: column;
}
.nav-item {
  width: 220px;
  height: 54px;
  background: #424242;
  line-height: 54px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #A2A0A0;
  font-style: normal;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(249,110,8,0.35);
  }
  
  &.active {
    color: #F96E08;
    background: rgba(249,110,8,0.35);
    font-weight: bold;
  }
}
.nav-item:first-child.active, .nav-item:first-child:hover{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.nav-item:last-child.active, .nav-item:last-child:hover{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.author-right-content-box {
  display: flex;
  width: 1016px;
  margin-left: 24px;
}
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
.work-management-title-box {
  position: relative;
}
.create-novel {
  position: absolute;
  top: 26px;
  right: 40px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  text-align: left;
  font-style: normal;
  &:hover { 
    cursor: pointer;
    color: #F96E08;
  }
}
.work-item-list {
  padding: 68px 0 0 24px;
}
.work-item {
  position: relative;
  display: flex;
  width: 968px;
  height: 144px;
  border-bottom: 1px solid #a2a0a0;
}
.work-book-img {
  width: 90px;
  height: 120px;
  border-radius: 8px;
  margin: 12px 0 0 12px;
}
.work-book-info {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 12px 0 0 12px;
}
.work-book-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.work-update-info {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 12px;
}
.work-book-detail-info {
  position: absolute;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.work-book-chapter, .work-book-count, .work-status{
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.divider {
  height: 10px;
  border: 1px solid #a2a0a0
}
.work-chapter-manage-btn, .work-create-chapter-btn {
  position: absolute;
  width: 148px;
  height: 38px;
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  border-radius: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}
.work-chapter-manage-btn {
  right: 184px;
  bottom: 12px;
}
.work-create-chapter-btn {
  right: 12px;
  bottom: 12px;
}
// 新增的内容区域样式
.author-content-section {
  position: relative;
  width: 100%;
  background: #424242;
  border-radius: 6px;
}

.author-work-title {
  position: absolute;
  top: 24px;
  left: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  text-align: left;
  font-style: normal;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  
  .placeholder-image {
    width: 100px;
    height: 100px;
    opacity: 0.5;
    margin-bottom: 20px;
  }
}
.create-book-form-box {
  height: 640px;
}
.create-book-title-box {
  margin: 28px 0 0 24px;
}
.create-book-form {
  padding: 38px 0 0 188px;
}
.create-book-img-upload {
  position: absolute;
  top: 82px;
  left: 24px;
  display: flex;
  justify-content: center;
  font-size: 44px;
  background: #929292;
  width: 132px;
  height: 176px;
  border-radius: 6px;
}
.create-book-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-warn-info-box {
  position: absolute;
  top: 284px;
  left: 24px;
  width: 132px;
  height: 143px;
  background: #929292;
  border-radius: 6px;

  ul {
    list-style: none;
    padding: 0;
    
    li {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #FFFFFF;
      line-height: 1.5;
      text-align: left;
      font-style: normal;
      margin-bottom: 4px;
      padding-left: 10px;
      padding-top: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      
      &::before {
        content: "•";
        color: #FFFFFF;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
      }
    }
  }
}
.upload-warn-info-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin: 8px 0 0 8px
}
.create-book-label {
  ::v-deep(.el-form-item__label) {
    color: #a2a0a0;
  }
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ED5B00;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
.create-book-input {
  ::v-deep(.el-input__wrapper) {
    background: #424242;
    border-radius: 6px;
    border: 1px solid transparent;

    &:focus-within {
      box-shadow: 1px 1px 2px 0px rgba(249,110,8,0.3), -1px -1px 2px 0px rgba(249,110,8,0.3);
      border: 1px solid #F96E08;
    }
  }
  
  ::v-deep(.el-input__inner) {
    background: #424242;
    color: #FFFFFF;
    border: none;
  }
}
.create-book-input {
  ::v-deep(.el-textarea__wrapper) {
    background: #424242;
    border-radius: 6px;
    border: 1px solid transparent;

    &:focus-within {
      box-shadow: 1px 1px 2px 0px rgba(249,110,8,0.3), -1px -1px 2px 0px rgba(249,110,8,0.3);
      border: 1px solid #F96E08;
    }
  }
  
  ::v-deep(.el-textarea__inner) {
    height: 200px;
    background: #424242;
    color: #FFFFFF;
    border: none;
  }
}
.agree-protocol-checkbox {
  margin-left: 78px;
}
.agree-protocol-label {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
.personal-info-protection {
  color: #F96E08;
}
.create-book-btn-box {
  display: flex;
}
.cancel-create-book-btn, .create-book-btn {
  width: 168px;
  height: 42px;
  background: #646261;
  border-radius: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  border: none;
}
.cancel-create-book-btn {
  margin: 0 0 0 228px;
}
.create-book-btn {
  background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
  margin: 0 0 0 32px;
}
::v-deep(.create-book-select .el-select__wrapper) {
  font-size: 14px;
  background: #424242;
  border-radius: 6px;
  border: 1px solid transparent;
  &:focus-within { 
    box-shadow: 1px 1px 2px 0px rgba(249,110,8,0.3), -1px -1px 2px 0px rgba(249,110,8,0.3);
    border: 1px solid #F96E08;
  }
}

// 个人信息样式
.personal-info-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin: 35px 0 0 24px;
}

</style>