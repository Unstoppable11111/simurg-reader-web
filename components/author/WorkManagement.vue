<!-- components/author/WorkManagement.vue -->
<template>
  <div class="author-content-section">
    <!-- 默认作品列表视图 -->
    <div v-if="currentView === 'list'">
      <div class="work-management-title-box">
        <div class="author-work-title">我的小说</div>
        <div class="create-novel" @click="switchView('create-book')">创建新书</div>
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
          <button class="work-book-setting-btn" @click="switchView('book-setting')">作品设置</button>
          <button class="work-chapter-manage-btn" @click="switchView('chapter-management')">章节管理</button>
          <button class="work-create-chapter-btn" @click="switchView('create-chapter')">创建章节</button>
        </div>
      </div>
    </div>

    <!-- 创建小说视图 -->
    <div v-else-if="currentView === 'create-book'" class="create-book-form-box">
      <div class="create-book-title-box">
        <span class="create-book-title">创建小说</span>
        <span class="back-to-list" @click="switchView('list')">返回</span>
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
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId" />
          </el-select>
        </el-form-item>

        <el-form-item class="create-book-label" label="作品标签" prop="bookTagList">
          <el-select class="create-book-select" v-model="ruleForm.bookTagList" placeholder="请选择标签" multiple>
            <el-option
              v-for="item in bookTagTypeList"
              :key="item.key"
              :label="item.key"
              :value="item.value"
            />
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

         <el-form-item class="agree-protocol-checkbox" label="" prop="agreeProtocol">
            <el-checkbox class="agree-protocol-label" v-model="ruleForm.agreeProtocol">我已阅读并同意</el-checkbox>
            <NuxtLink to="/" class="personal-info-protection">《个人信息保护声明》</NuxtLink>
        </el-form-item>

        <el-form-item class="create-book-btn-box">
          <el-button class="cancel-create-book-btn" @click="switchView('list')">取消</el-button>
          <el-button class="create-book-btn" @click="continueCreateChapter(ruleFormRef)">确认创建</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 作品设置视图 -->
    <div v-else-if="currentView === 'book-setting'" class="book-setting-box">
      <div class="book-setting-title-box">
        <span class="book-setting-title">作品设置</span>
        <span class="back-to-list" @click="switchView('list')">返回</span>
      </div>
      <div class="book-setting-content">
        <p>这里是作品设置内容区域</p >
        <!-- 在这里添加作品设置的具体表单和功能 -->
      </div>
    </div>

    <!-- 章节管理视图 -->
    <div v-else-if="currentView === 'chapter-management'" class="manage-chapter-box">
      <div class="manage-chapter-title-box">
        <span class="manage-chapter-back-to-list" @click="switchView('list')"><</span>
        <span class="manage-chapter-title">穿书荒年我靠修仙无敌了</span>
        <span class="back-to-list" @click="switchView('list')">返回</span>
      </div>
      <div class="manage-chapter-content-box">
        <div class="manage-chapter-header-box">
          <div class="manage-chapter-header-title">章节管理</div>
          <!-- <button class="update-book-btn" @click="editBookInfo">修改信息</button> -->
        </div>
        <div class="chapter-count">共2章</div>
        <div class="chapter-table-box">
          <el-table
						:data="tableData"
						style="width: 100%; background-color: #424242; --el-table-row-hover-bg-color: #f8f9fa;"
						:row-class-name="tableRowClassName"
					>
						<el-table-column prop="chapterName" label="ChapterName" />
						<el-table-column prop="chapterWordCount" label="ChapterWordCount" />
						<el-table-column prop="updateTime" label="UpdateTime" />
            <el-table-column fixed="right" label="Operations" min-width="120">
              <template #default>
                <el-button class="update-chapter-btn" link size="small" @click="updatechapter()">修改</el-button>
                <el-button class="delete-chapter-btn" link size="small" @click="deleteChapter()">删除</el-button>
              </template>
            </el-table-column>
					</el-table>
        </div>
      </div>
    </div>

    <!-- 创建章节视图 -->
    <div v-else-if="currentView === 'create-chapter'" class="create-chapter-box">
      <div class="create-chapter-title-box">
        <span class="create-chapter-title">创建章节</span>
        <span class="back-to-list" @click="switchView('list')">返回</span>
      </div>
      <div class="create-chapter-content">
        <p>这里是创建章节内容区域</p >
        <!-- 在这里添加创建章节的具体表单和功能 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useDictStore } from "@/stores/dict";

const dictStore = useDictStore();
const router = useRouter()
const bookTagTypeList = computed(() => {
  return dictStore.dict.bookTagType || [];
});

interface RuleForm {
  bookName: string
  bookCategoryList: String[]
  bookTagList: string[]
  bookProtagonist: string
  bookDesc: string
  agreeProtocol: boolean
  coverImageUrl: string
}

// 添加视图状态管理
const currentView = ref<'list' | 'create-book' | 'book-setting' | 'chapter-management' | 'create-chapter'>('list')

const ruleFormRef = ref<FormInstance>()
const coverImageUrl = ref('')
const categoryList = ref([])

const ruleForm = reactive<RuleForm>({
  bookName: '',
  bookCategoryList: [],
  bookTagList: [],
  bookProtagonist: '',
  bookDesc: '',
  agreeProtocol: false,
  coverImageUrl: ''
})

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

interface ChapterInfo {
  chapterName: string
  chapterWordCount: number
  updateTime: string
}

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: ChapterInfo
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const tableData: ChapterInfo[] = [
  {
    chapterName: '第1章 我死了，我又活了',
    chapterWordCount: 2000,
    updateTime: '2016-05-03'
  },
  {
    chapterName: '开始逃荒',
    chapterWordCount: 2160,
    updateTime: '2025-12-02'
  }
]

// 视图切换方法 - 合并为一个通用函数
const switchView = (view: 'list' | 'create-book' | 'book-setting' | 'chapter-management' | 'create-chapter') => {
  currentView.value = view
}

try { 
  // 获取当前作者所有未发布的书籍
  const authorBookList = await apiRequest(API_ENDPOINTS.LIST_ALL_BOOS_BY_AUTHOR, {
    method: 'GET'
  });
  console.log(authorBookList)
} catch (error) {
  console.error(error)
}

const editBookInfo = () => {
  // 这里需要获取当前书籍的信息，示例数据如下：
  const bookInfo = {
    bookName: '穿书荒年我靠修仙无敌了',
    bookCategoryList: [],
    bookTagList: [],
    bookProtagonist: '',
    bookDesc: '',
    agreeProtocol: false,
    coverImageUrl: ''
  };
  
  // 将书籍信息编码后传递到创建小说页面
  const bookDataStr = JSON.stringify(bookInfo);
  const encodedBookData = btoa(encodeURIComponent(bookDataStr));
  
  // 切换到创建小说视图
  currentView.value = 'create-book';
  
  // 如果需要在路由间传递数据，可以使用以下方式：
  // router.push({
  //   path: '/author/createBook',
  //   query: {
  //     bookData: encodedBookData,
  //     editMode: 'true'
  //   }
  // });
}

const updatechapter = () => {
  console.log('update')
  router.push({
    path: '/author/writeBook',
    query: {
      chapterId: '1', // This should be the actual chapter ID
      editMode: 'true',
      from: 'chapter-management'
    }
  })
}

const deleteChapter = () => {
  ElMessageBox.confirm(
    '删除后将不会恢复，确定要删除吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      // 自定义样式
      customClass: 'custom-delete-dialog',
      showClose: true,
      center: true,
      draggable: false,
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

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
          from: 'create-book'
        }
      })
    } else {
      //  ElMessage.error('缺少必填字段！')
      console.log('submit!')
      const bookDataStr = JSON.stringify(ruleForm);
      const encodedBookData = btoa(encodeURIComponent(bookDataStr)) // 先 encodeURIComponent 防止特殊字符问题
      router.push({
        path: '/author/writeBook',
        query: {
          bookData: encodedBookData,
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
/* 移动原文件中的相关样式到这里 */
:deep(.custom-delete-dialog .el-message-box) {
  background-color: #424242 !important; /* 自定义背景色 */
}

/* 可选：修改弹窗内容区/表头背景（若需要） */
:deep(.custom-delete-dialog .el-message-box__header),
:deep(.custom-delete-dialog .el-message-box__content) {
  background-color: #424242 !important;
}
.author-content-section {
  position: relative;
  width: 100%;
  height: 639px;
  background: #424242;
  border-radius: 6px;
}

.work-management-title-box {
  position: relative;
}

.author-work-title {
  position: absolute;
  top: 24px;
  left: 24px;
}

.create-novel {
  position: absolute;
  top: 28px;
  right: 24px;
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

.work-book-setting-btn, .work-chapter-manage-btn, .work-create-chapter-btn {
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

.work-book-setting-btn {
  right: 356px;
  bottom: 12px;
}

.work-chapter-manage-btn {
  right: 184px;
  bottom: 12px;
}

.work-create-chapter-btn {
  right: 12px;
  bottom: 12px;
}

.create-book-form-box {
  height: 640px;
}

.create-book-title-box {
  margin: 28px 0 0 24px;
  position: relative;
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

/* 新增的样式 */
.back-to-list {
  position: absolute;
  right: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #A2A0A0;
  text-align: left;
  font-style: normal;
  cursor: pointer;
  &:hover { 
    color: #F96E08;
  }
}

.book-setting-title-box, .manage-chapter-title-box, .create-chapter-title-box {
  margin: 28px 0 0 24px;
  position: relative;
}

.book-setting-title, .manage-chapter-title, .create-chapter-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
.manage-chapter-title {
  margin-left: 8px;
}

.book-setting-content, .manage-chapter-content-box, .create-chapter-content {
  padding: 30px 24px;
  color: #FFFFFF;
}
.manage-chapter-content-box {
	:deep(.el-table) {
    background-color: #424242;
    
    // 表头背景色
    .el-table__header-wrapper {
      margin-top: 16px;
      background-color: #525252;
      
      th {
        background-color: #525252 !important;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #A3A3A3;
        line-height: 17px;
        text-align: left;
        font-style: normal;
        border-bottom: none;
      }
    }
    
    // 表格体背景色
    .el-table__body-wrapper {
      background-color: #424242;
      
      td {
        background-color: #424242 !important;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 17px;
        text-align: left;
        font-style: normal;
      }
    }
    
    // 行悬停效果
    .el-table__body tr:hover > td {
      background-color: #525252 !important;
    }
    
    // 特殊行样式保持一致性
    .el-table__row.warning-row {
      --el-table-tr-bg-color: #525252;
    }

    .el-table__row.success-row {
      --el-table-tr-bg-color: #525252;
    }
  }
}
.manage-chapter-header-box {
	position: relative;
	display: flex;
}
.manage-chapter-header-title {
	font-family: PingFangSC, PingFang SC;
	font-weight: 600;
	font-size: 14px;
	color: #FFFFFF;
	line-height: 20px;
	text-align: left;
	font-style: normal;
}
.update-book-btn {
	position: absolute;
	right: 24px;
	width: 120px;
	height: 32px;
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
.chapter-count {
	font-family: PingFangSC, PingFang SC;
	font-weight: 600;
	font-size: 12px;
	color: #A2A0A0;
	line-height: 17px;
	text-align: left;
	font-style: normal;
	margin-top: 16px;
}
.update-chapter-btn, .delete-chapter-btn {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}
</style>