<!-- components/author/WorkManagement.vue -->
<template>
  <div class="confetti-container">
    <Confetti  ref="confettiRef"
      class="confetti-component"
      :manualstart="true"/>
  </div>
  <div class="author-content-section">
    <!-- 默认作品列表视图 -->
    <div v-if="currentView === 'list'">
      <div class="work-management-title-box">
        <div class="author-work-title">我的小说</div>
        <div class="create-novel" @click="openCreateBook">创建新书</div>
      </div>
      <div class="work-item-list">
        <div class="work-item" v-for="bookItem in authorBookList" :key="bookItem.bookId">
          <img class="work-book-img" :src="bookItem.coverImageUrl" alt="">
          <div class="work-book-info">
            <span class="work-book-title">{{ bookItem.title }}</span>
            <span class="work-update-info">最近更新：{{ bookItem.currentChapterTitle }}</span>
            <div class="work-book-detail-info">
              <span class="work-book-chapter">{{ bookItem.totalChapters }}章</span>
              <div class="divider"></div>
              <span class="work-book-count">{{ bookItem.totalCharCount }}字</span>
              <div class="divider"></div>
              <span class="work-status">{{ formatSerialStatus(bookItem.serialStatus) }}</span>
            </div>
          </div>
          <button class="work-book-setting-btn" @click="openBookSetting(bookItem)">作品设置</button>
          <button class="work-chapter-manage-btn" @click="chapterHandle(bookItem.bookId, bookItem.title)">章节管理</button>
          <button class="work-create-chapter-btn" @click="createChapter(bookItem)">创建章节</button>
        </div>
      </div>
      
    </div>

    <!-- 创建小说视图 -->
    <div v-else-if="currentView === 'create-book'" class="create-book-form-box">
      <div class="create-book-title-box">
        <span class="create-book-title">{{ isEditing ? '作品设置' : '创建小说' }}</span>
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
          <el-select class="create-book-select" popper-class="create-book-select-dropdown" v-model="ruleForm.bookCategoryList" placeholder="请选择作品类型" multiple>
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId" />
          </el-select>
        </el-form-item>

        <el-form-item class="create-book-label" label="作品标签" prop="bookTagList">
          <el-select class="create-book-select" popper-class="create-book-select-dropdown" v-model="ruleForm.bookTagList" placeholder="请选择标签" multiple>
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
          <el-button v-if="!isEditing" class="create-book-btn" @click="continueCreateChapter(ruleFormRef)">确认创建</el-button>
          <el-button v-else class="create-book-btn" @click="handleEditBook(ruleFormRef)">确认修改</el-button>
          <template v-if="isEditing">
            <el-button class="delete-book-btn" @click="handleDeleteBook()">删除</el-button>
            <el-button class="finish-book-btn" @click="handleFinishBook()">申请完结</el-button>
          </template>
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
        <span class="manage-chapter-title">{{ bookTitle  }}</span>
        <span class="back-to-list" @click="switchView('list')">返回</span>
      </div>
      <div class="manage-chapter-content-box">
        <div class="manage-chapter-header-box">
          <div class="manage-chapter-header-title">章节管理</div>
          <!-- <button class="update-book-btn" @click="editBookInfo">修改信息</button> -->
        </div>
        <div class="manage-chapter-create-box">
          <div class="chapter-count">共{{chapterCount}}章</div>
          <div class="create-chapter-box" @click="createChapterByBook">创建章节</div>
        </div>
        <div class="chapter-table-box">
          <el-table
						:data="chapterList"
						style="width: 100%; background-color: #424242; --el-table-row-hover-bg-color: #f8f9fa;"
						:row-class-name="tableRowClassName"
					>
						<el-table-column prop="chapterNumber" label="ChapterNumber" />
						<el-table-column prop="chapterTitle" label="ChapterTitle" />
						<el-table-column prop="totalCharCount" label="TotalCharCount" />
						<el-table-column prop="publishDate" label="PublishDate" >
              <template #default="{ row }">
              {{ formatTimestamp(row.publishDate) }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" min-width="120">
              <template #default="{row}">
                <el-button class="update-chapter-btn" link size="small" @click="updatechapter(row)">修改</el-button>
                <el-button v-if="row.isSigned === 0" class="delete-chapter-btn" link size="small" @click="deleteChapter()">删除</el-button>
                <el-button class="publish-chapter-btn" link size="small" @click="publishChapter(row)">发布</el-button>
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
  // <!-- components/author/WorkManagement.js -->
  import type { FormInstance, FormRules, UploadProps } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import { useDictStore } from "@/stores/dict";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  import { Confetti } from '../ui/confetti';
  import { ConfettiButton } from '../ui/confetti';
  
  
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
  const isEditing = ref(false);
  const currentBookId = ref('')
  const categoryList = ref([])
  const authorBookList = ref([])
  const chapterList = ref<ChapterInfo>()
  const chapterCount = ref(0)
  const bookTitle = ref('')
  const bookId = ref('')

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
    chapterNumber: number
    bookChaptersStatus: number
    bookId: string
    chapterId: string
    chapterTitle: string
    id: number
    publishDate: string
    totalCharCount: number
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
  const confettiRef = ref(null);
  const fireConfetti = () => {
    console.log('fireConfetti init');
    if (confettiRef.value) {
      // 先重置/停止可能的自动播放，再手动触发
      confettiRef.value.reset?.(); // 可选：重置组件状态
      confettiRef.value.fire({
        // 可自定义特效参数（如数量、颜色、持续时间）
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    // confettiRef.value?.fire({});
  }

  /**
   * 外部组件打开作品设置
   * @param bookItem 书籍信息
   */
  const openBookSettingWithBook = (bookItem: any) => {
    openBookSetting(bookItem);
  };

  /**
   * 打开书籍作品设置
   * @param bookItem 书籍信息
   */
  const openBookSetting = (bookItem: any) => {
    console.log("打开书籍设置", bookItem)
    console.log("表单数据:", ruleForm)
    ruleForm.bookName = bookItem.title
    ruleForm.bookDesc = bookItem.description
    ruleForm.coverImageUrl = bookItem.coverImageUrl
    ruleForm.bookTagList = bookItem.tag || [] // 防止 null
    ruleForm.bookProtagonist = bookItem.protagonistIntroduction
    // 注意：如果是多选下拉框，分类通常需要处理 ID 数组，这里假设直接赋值即可，根据实际情况调整
    ruleForm.bookCategoryList = bookItem.bookCategoryList || [] 
    coverImageUrl.value = bookItem.coverImageUrl
    currentBookId.value = bookItem.bookId;
    // 切换到创建/编辑视图
    isEditing.value = true;
    currentView.value = 'create-book';
  };
  // 视图切换方法 - 合并为一个通用函数
  const switchView = (view: 'list' | 'create-book' | 'book-setting' | 'chapter-management' | 'create-chapter') => {
    console.log('view', view);
    resetForm();
    currentView.value = view
  }
  // 打开创建新书视图方法
  const openCreateBook = (bookData?: any) => {
    // 如果有bookData，说明是编辑模式
    console.log("打开创建新书视图", bookData)
    if ( !ruleForm ) return;
    if (bookData) {
      isEditing.value = true;
      Object.assign(ruleForm, {
        bookName: bookData.title || '',
        coverImageUrl: bookData.coverImageUrl || '',
        bookCategoryList: bookData.bookCategoryList || [],
        bookProtagonist: bookData.protagonist || '',
        bookDesc: bookData.description || '',
        agreeProtocol: true
      });
      coverImageUrl.value = bookData.coverImageUrl || '';
    } else {
      // 新建模式：重置表单
      isEditing.value = false;
      Object.assign(ruleForm, {
        bookName: '',
        coverImageUrl: '',
        bookCategoryList: [],
        bookTagList: [],
        bookProtagonist: '',
        bookDesc: '',
        agreeProtocol: false
      });
      coverImageUrl.value = '';
    }
    // 切换到创建/编辑表单视图
    currentView.value = 'create-book';
  };
  // 重置表单的方法 (建议添加，防止上次编辑的数据残留)
  const resetForm = () => {
    ruleForm.bookName = '';
    ruleForm.bookCategoryList = [];
    ruleForm.bookTagList = [];
    ruleForm.bookProtagonist = '';
    ruleForm.bookDesc = '';
    ruleForm.agreeProtocol = false;
    ruleForm.coverImageUrl = '';
    coverImageUrl.value = '';
    currentBookId.value = '';
  }

  // 章节管理
  const chapterHandle = async (id: string, title: string) => { 
    switchView('chapter-management');
    bookTitle.value = title;
    bookId.value = id;
    listBookChapter(id);
  }

  const createChapter = (bookItem: any) => {
    const bookDataStr = JSON.stringify(bookItem);
    const encodedBookData = btoa(encodeURIComponent(bookDataStr)) // 先 encodeURIComponent 防止特殊字符问题
    router.push({
      path: '/author/writeBook',
      query: {
        bookId: bookItem.bookId,
        bookData: encodedBookData,
        from: 'create-chapter',
        opType: 'createChapter'
      }
    })
  }

  const createChapterByBook = () => {
    const bookDataReq = {
      bookId: bookId.value,
      title: bookTitle.value
    }
    const encodedBookData = btoa(encodeURIComponent(JSON.stringify(bookDataReq))) // 先 encodeURIComponent 防止特殊字符问题
    router.push({
      path: '/author/writeBook',
      query: {
        bookId: bookId.value,
        bookData: encodedBookData,
        from: 'create-chapter',
        opType: 'createChapter'
      }
    })
  }
  
  // 获取当前作者所有未发布的书籍
  const listAuthoBook = async () => { 
    try { 
      const authorBookListResult = await apiRequest(API_ENDPOINTS.LIST_ALL_BOOS_BY_AUTHOR, {
        method: 'GET'
      });
      console.log("获取作者所有未发布的书籍信息",authorBookListResult)
      authorBookList.value = authorBookListResult.data;
    } catch (error) {
      console.error(error)
    }
  }
  // 获取某本书籍的所有章节信息
  const listBookChapter = async (bookId: string) => {
    try {
      const listPublishedChaptersReq = {
        bookId: bookId,
        page: 1,
        size: 10
      }
      const listPublishedChaptersResult = await apiRequest(API_ENDPOINTS.LIST_ALL_CHAPTERS, {
          method: "POST",
          body: JSON.stringify(listPublishedChaptersReq),
      });
      console.log("获取所有已发布的章节信息结果：｛｝", listPublishedChaptersResult);
      if (listPublishedChaptersResult.code === 200) {
        chapterCount.value = listPublishedChaptersResult.data.records.length;
        chapterList.value = listPublishedChaptersResult.data.records;
      }
    } catch (error){
    }
  }
  // 修改章节信息
  const updatechapter = (chapterInfo: ChapterInfo) => {
    router.push({
      path: '/author/writeBook',
      query: {
        bookId: chapterInfo.bookId,
        chapterNumber: chapterInfo.chapterNumber,
        editMode: 'true',
        from: 'chapter-management',
        opType: 'updateChapter'
      }
    })
  }
  // 删除章节信息
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
  // 发布章节
  const publishChapter = async (chapterInfo: ChapterInfo) => {
    console.log("发布章节参数", chapterInfo);
    try {
      const publishChapterUrl = `${API_ENDPOINTS.PUBLISH_CHAPTER}/${chapterInfo.bookId}/${chapterInfo.chapterId}`
      const result = await apiRequest(publishChapterUrl, {
        method: 'POST'
      })
      console.log("发布章节结果", result);
      if (result.code === 200 && result.data) {
        ElMessage.success('发布成功');
      } else {
        ElMessage.error('发布失败，请稍后重试！');
      }
    } catch (error) {
      console.log("发布章节异常", error);
    }
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

  // 获取书籍分类
    try {
      const bookCateResult = await apiRequest(API_ENDPOINTS.CATEGORIES, {
        method: 'GET'
      });
      console.log("书籍分类", bookCateResult)
      if (!bookCateResult.code === 200) {
        throw new Error(`HTTP error! status: ${bookCateResult.status}`)
      }
      
      const result = await bookCateResult
      
      if (result.code === 200 && Array.isArray(result.data)) {
        categoryList.value = result.data;
      }
    } catch (error) {
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
            from: 'create-book',
            opType: 'createBook'
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

  const handleEditBook = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    try {
      // 1. 简化表单验证：直接await验证结果（失败会抛出异常）
      const isValid = await formEl.validate();
      if (!isValid) {
        ElMessage.error('Please fill in all required fields.');
        return; // 验证失败直接终止
      }

      // 2. 准备请求数据（注意ruleForm是响应式变量，需加.value）
      console.log('ruleForm', ruleForm);
      const updateBookReq = {
        bookId: currentBookId.value,
        title: ruleForm.bookName, // 关键：加.value
        protagonistIntroduction: ruleForm.bookProtagonist,
        description: ruleForm.bookDesc,
        coverImageUrl: ruleForm.coverImageUrl,
        bookCategoryList: ruleForm.bookCategoryList,
        bookTagList: ruleForm.bookTagList,
      };
      // 3. 关键：await等待Promise解析，获取真实响应结果
      const updateBookResult = await apiRequest(API_ENDPOINTS.UPDATE_BOOK, {
        method: 'POST',
        body: JSON.stringify(updateBookReq),
      });

      console.log('Update book result:', updateBookResult);

      // 4. 处理业务响应
      if (updateBookResult?.code === 200) {
        ElMessage({
          type: 'success',
          message: '书籍信息更新成功',
        });
        await listAuthoBook(); // 若列表刷新是异步，也需await
        switchView('list');
      } else {
        ElMessage.error(`更新失败：${updateBookResult?.message || '请重试'}`);
      }
    } catch (error) {
      // 5. 捕获所有异常（验证失败、网络错误、API报错等）
      console.error('Update book failed:', error);
      ElMessage.error('更新失败，请检查网络或联系管理员');
    }
  };
  // 删除书籍
  const handleDeleteBook = async () => { 
    try {
      // 使用 prompt 而不是 confirm
      await ElMessageBox.prompt(
        '删除后作品数据将无法恢复！\n为了确认您的操作，请输入“确认删除”：',
        '删除警告',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          // 输入框占位符
          inputPlaceholder: '确认删除',
          // 自定义样式类名（保持暗黑风格）
          customClass: 'custom-delete-dialog',
          center: true,
          // 校验函数：如果不返回 true，确认按钮无法点击或显示错误提示
          inputValidator: (value) => {
            if (value === '确认删除') {
              return true;
            }
            return '输入内容不匹配，请重新输入';
          },
          inputErrorMessage: '输入内容不匹配，请重新输入'
        }
      ).then(async ({ value }) => {
        // 发送删除请求
        const res = await apiRequest(`${API_ENDPOINTS.DELETE_BOOK}/${currentBookId.value}`, {
          method: 'DELETE',
        });

        if (res.code === 200) {
          ElMessage.success('删除成功');
          listAuthoBook(); // 刷新列表
          switchView('list'); // 返回列表
        } else {
          ElMessage.error(res.msg || '删除失败');
        }
      });

    } catch (error) {
      // 用户点击取消或关闭弹窗会进入这里
      if (error !== 'cancel') {
        console.error(error);
        ElMessage.error('删除操作异常');
      } else {
        ElMessage.info('已取消删除');
      }
    }
  };

  /**
   * 炫酷撒花特效
   */

  /**
   * 申请完结书籍
   */
  const handleFinishBook = async () => { 
    try {
      await ElMessageBox.confirm(
        '确定要申请完结该作品吗？完结后将无法再新增章节。',
        '完结提示',
        {
          confirmButtonText: '确认完结',
          cancelButtonText: '我再想想',
          type: 'warning',
          customClass: 'custom-delete-dialog', // 复用之前的暗色主题样式
          center: true,
        }
      );
      const finishReq = {
        bookId: currentBookId.value,
        toSerialStatus: 1 // 0-连载中，1-完结
      };
      const res = await apiAuthRequest(`${API_ENDPOINTS.UPDATE_BOOK_SERIAL_STATUS}`, {
        method: 'POST',
        body: JSON.stringify(finishReq)
      });
      console.log("申请完结结果：", res.code);
      if (res.code === 200) {
        fireConfetti();
        ElMessage.success('恭喜，作品已成功申请完结！');
        listAuthoBook(); // 刷新列表
        switchView('list'); // 返回列表
      } else {
        console.log("申请完结失败",res);
        ElMessage.error(res.msg || '操作失败，请重试');
      }
      
      // listAuthoBook(); 
      // switchView('list'); 
    } catch (error) {
      if (error !== 'cancel') {
        console.error(error);
        ElMessage.error('网络异常，请稍后重试');
      }
    }
  };

  onMounted(() => { 
    listAuthoBook();
  })
  // 2. 关键：将 openBookSetting 暴露出去
  defineExpose({
    openBookSetting: openBookSettingWithBook,
    openCreateBook: openCreateBook
  });
</script>

<style lang="scss" scoped>
// components/author/WorkManagement.style
.confetti-container {
  position: absolute;
  top: 0;
  left: 25%;
  width: 500px; // 固定宽度为 300px
  height: 100vh; // 全屏高度
  z-index: 9999; // 确保在最顶层
  pointer-events: none; // 确保不影响页面其他交互
  display: flex;
  justify-content: center;
  align-items: center;
}

.confetti-component {
  width: 500px;
  height: 500px;
  
  // 如果组件内部有 canvas 或其他元素，可能需要进一步覆盖
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}

.author-content-section {
  position: relative;
  width: 100%;
  background: #424242;
  border-radius: 6px;
}
.author-content-section {
  position: relative;
  width: 100%;
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
    color: #f9a825;
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
.work-item:last-child {
  margin-bottom: 40px;
}
.work-book-img {
  width: 90px;
  height: 120px;
  border-radius: 8px;
  margin: 12px 0 0 12px;
}

.work-book-info {
  position: relative;
  width: 200px;
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
  background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
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
  width: 1016px;
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
  color: #F9A825;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  width: 686px;
}

.create-book-input {
  ::v-deep(.el-input__wrapper) {
    width: 686px;
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
  justify-content: center;
  flex: 1;
  width: 686px;
  ::v-deep(.el-form-item__content) {
    display: flex;
    gap: 32px;
    justify-content: center;
  }
}

.cancel-create-book-btn, .create-book-btn, .delete-book-btn, .finish-book-btn {
  width: 168px;
  height: 34px;
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

.cancel-create-book-btn, .delete-book-btn {
  // margin: 0 0 0 228px;
  // width: 100px;
}
.cancel-create-book-btn {
  &:hover { 
   color: #f9a825
  }
}

.create-book-btn {
  background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
  // margin: 0 0 0 32px;
}

::v-deep(.create-book-select .el-select__wrapper) {
  font-size: 14px;
  background: #424242;
  border-radius: 6px;
  border: 1px solid transparent;
  &:focus-within { 
    box-shadow: 1px 1px 2px 0px rgba(249,110,8,0.3), -1px -1px 2px 0px rgba(249,110,8,0.3);
    border: 1px solid #f9a825;
  }
}
.create-book-select {
  ::v-deep(.el-tag) {
    background-color: transparent !important;
    // border: 1px solid #FFFFFF !important;
    color: #FFFFFF !important;

    .el-tag__close {
      color: #FFFFFF !important;
      &:hover {
        background-color: transparent !important;
        color: #F9A825 !important;
      }
    }
  }

  ::v-deep(.el-input__wrapper) {
    background-color: #424242 !important;
    box-shadow: 0 0 0 1px #555 inset !important;
    .el-input__inner {
      color: #FFFFFF !important;
      &::placeholder {
        color: #A2A0A0 !important;
      }
    }
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
    color: #f9a825;
  }
}
.manage-chapter-back-to-list {
  cursor: pointer;
  &:hover { 
    color: #f9a825;
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
        text-align: center;
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
        text-align: center;
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
.manage-chapter-create-box {
  position: relative;
  display: flex;
}
.update-book-btn {
	position: absolute;
	right: 24px;
	width: 120px;
	height: 32px;
	background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
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
.create-chapter-box {
  position: absolute;
  right: 0;
  top: 5px;
  cursor: pointer;
  &:hover { 
    color: #f9a825;
  }
}
.update-chapter-btn, .delete-chapter-btn, .publish-chapter-btn {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  cursor: pointer;
  &:hover { 
    color: #f9a825;
  }
}
</style>

<style lang="scss">
// 精准匹配 Element Plus 2.11.1 的下拉框选择器
.create-book-select-dropdown {
  background-color: #424242 !important;
  border: 1px solid #555 !important;
  box-shadow: none !important;

  .el-popper__arrow {
    display: none !important;
  }

  // 下拉列表容器
  .el-select-dropdown__list {
    background-color: #424242 !important;
    
    // 下拉选项项
    .el-select-dropdown__item {
      background-color: #424242 !important;
      color: #FFFFFF !important; /* 未选中文字：浅灰色 */
      position: relative;

      // 悬浮样式
      &.hover,
      &:hover {
        background-color: #674b36 !important;
        color: #FFFFFF !important;
      }

      // 选中状态
      &.selected {
        color: #F9A825 !important; /* 已选文字：橙色 */
        background-color: transparent !important;
      }

      // 选中+悬浮
      &.selected.hover,
      &.selected:hover {
        color: #f9a825 !important;
        background-color: #525252 !important;
      }

      // 核心：覆盖选中对勾图标（最高优先级）
      &.selected .el-icon-check {
        color: #F9A825 !important; /* 图标文字色 */
        fill: #F9A825 !important;   /* 图标填充色 */
        stroke: #F9A825 !important; /* 图标描边色 */
        font-weight: bold !important;
      }

      // 兼容不同 Element Plus 版本的图标类名
      &.selected .el-icon {
        color: #F9A825 !important;
        fill: #F9A825 !important;
        stroke: #F9A825 !important;
      }

      // 强制覆盖内联样式（如果有）
      &.selected [class^="el-icon-"],
      &.selected [class*=" el-icon-"] {
        color: #F9A825 !important;
        fill: #F9A825 !important;
        stroke: #F9A825 !important;
      }
    }
  }

  // 额外：覆盖多选标签内的对勾（如果需要）
  .el-select__tags .el-tag__close+.el-icon-check {
    color: #F9A825 !important;
    fill: #F9A825 !important;
  }
}

// 兜底：全局覆盖下拉多选的对勾图标（防止局部样式未生效）
:root {
  --el-color-primary: #F9A825 !important; // 直接修改 Element 主色调为橙色
  --el-color-primary-light-3: #f9b958 !important;
  --el-color-primary-light-5: #fbc87a !important;
  --el-color-primary-light-7: #fcd89d !important;
  --el-color-primary-light-8: #fde3ae !important;
  --el-color-primary-light-9: #fef3d1 !important;
}

.custom-delete-dialog {
  // 确认框整体背景
  background-color: #424242 !important;
  border: 1px solid #555 !important;
  border-radius: 4px !important;

  // 标题栏
  .el-message-box__header {
    border-bottom: 1px solid #555 !important;
    padding: 15px 20px !important;

    .el-message-box__title {
      color: #FFFFFF !important; // 标题白色
    }

    .el-message-box__close {
      color: #A2A0A0 !important; // 关闭按钮浅灰
      &:hover {
        color: #F9A825 !important; // 悬停橙色
      }
    }
  }

  // 内容区域
  .el-message-box__content {
    padding: 20px !important;
    color: #FFFFFF !important; // 内容文字白色

    .el-message-box__status {
      color: #F9A825 !important; // 提示图标橙色
    }
  }

  // 按钮区域
  .el-message-box__btns {
    padding: 10px 20px 15px !important;
    border-top: 1px solid #555 !important;

    // 「我再想想」取消按钮
    .el-button {
      background-color: #646261 !important;
      border-radius: 24px;
      color: #FFFFFF !important;
      border: none;
      &:hover {
        background-color: #666 !important;
        border-color: #777 !important;
      }
    }

    // 「确认完结」主要按钮
    .el-button--primary {
      background-color: #F9A825 !important; // 主题橙色
      border: 1px solid #F9A825 !important;
      color: #FFFFFF !important;
      border-radius: 24px;
      &:hover {
        background-color: #e69500 !important; // 悬停深橙
      }
    }
  }
}

// 可选：仅修改 finish-book-btn 按钮本身的样式（如果需要）
.finish-book-btn {
  background-color: #F9A825 !important;
  border-color: #F9A825 !important;
  color: #FFFFFF !important;

  &:hover {
    background-color: #e69500 !important;
    border-color: #e69500 !important;
  }
}

//花瓣特效
</style>