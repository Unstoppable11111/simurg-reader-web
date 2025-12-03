<!-- /components/author/AuthorInfo.vue -->
<template>
	<div class="author-info-container">
		<div class="author-info-header-box">
			<div class="author-info-header-title">个人信息</div>
			<button class="cancle">取消</button>
			<button class="save">保存</button>
		</div>

		<div class="author-info-content-box"> 
			<el-form>
				<!-- 头像 -->
				<el-form-item class="author-avatar-label" label="头像" prop="authorAvatar"> 
				<img :src="authorAvatarUrl" class="author-avatar-img" />
				<el-upload
					class="author-img-upload"
					action="http://localhost:8082/api/file/upload"
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				>
					<template #trigger>
						<el-button class="upload-img-btn">上传头像</el-button>
					</template>
				</el-upload>
				</el-form-item>

				<!-- 笔名 -->
				<el-form-item class="pen-name-item" label="笔名" prop="penName"> 
					<el-input class="pen-name-input" 
						v-model="authorInfo.penName" placeholder="请输入笔名" maxlength="10"
						show-word-limit/>
				</el-form-item>

				<!-- 作家简介 -->
				<el-form-item class="author-desc-item" label="作家简介" prop="briefIntroduction"> 
					<el-input 
						type="text" class="author-desc-input" 
						v-model="authorInfo.briefIntroduction" 
						placeholder="请输入作家简介" maxlength="30"
						show-word-limit/>
				</el-form-item>

				<div class="author-contact-title">联系方式</div>
				<!-- 邮箱 -->
				<el-form-item class="author-email-item" label="邮箱号" prop="email"> 
					<el-input type="text" class="author-email-input" v-model="authorInfo.email" placeholder="请输入邮箱号"/>
				</el-form-item>

				<div class="author-account-title">账号信息</div>
				<!-- 账号信息 -->
				<el-form-item class="author-account-item" label="作者QID" prop="authorId"> 
					<span class="author-id">{{ authorInfo.userId }}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useAuth } from '@/composables/useAuth';
	import type { UploadProps } from 'element-plus';
	const {isLoggedIn, isAuthor, userId} = useAuth();
	const authorInfo = ref(null);
	const authorAvatarUrl = ref(null);

	const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}${userId.value}`;
	const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
		method: 'GET'
	});
	authorInfo.value = authorInfoResult.data;
	authorAvatarUrl.value = authorInfo.value.pictureUrl
	console.log("作者信息：{}", authorInfo.value);
	// 头像上传成功处理
	const handleAvatarSuccess: UploadProps['onSuccess'] = (
		response,
		uploadFile
	) => {
		console.log('handleAvatarSuccess', uploadFile)
		console.log('response', response)
		authorAvatarUrl.value = response.data
	}

	const allowImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
	const allowExts = ['jpg', 'jpeg', 'png', 'gif'];
	// 头像上传前校验
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

</script>

<style scoped lang="scss">
	.author-info-container {
		width: 1016px;
		height: 730px;
		background: #424242;
		border-radius: 6px;
	}
	.author-info-header-box {
		position: relative;
		display: flex;
	}
	.author-info-header-title {
		position: absolute;
    top: 35px;
    left: 24px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 14px;
		color: #FFFFFF;
		line-height: 20px;
		text-align: left;
		font-style: normal;
	}
	.cancle {
		position: absolute;
		top: 24px;
		right: 176px;
		width: 120px;
		height: 32px;
		background: #646261;
		border-radius: 24px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 14px;
		color: #FFFFFF;
		line-height: 20px;
		text-align: center;
		font-style: normal;
	}
	.save {
		position: absolute;
		top: 24px;
		right: 24px;
		background: linear-gradient( 90deg, #FF9B51 0%, #ED5B00 100%);
		border-radius: 24px;
		width: 120px;
		height: 32px;
		background: #FFC107;
		border-radius: 24px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 14px;
		color: #FFFFFF;
		text-align: center;
	}
	.author-info-content-box {
		margin-top: 104px;
		margin-left: 24px;
	}
	.author-avatar-label, .pen-name-item, .author-email-item, .author-account-item {
		display: flex;
		align-items: center;
	}
	.author-avatar-img {
		width: 78px;
		height: 78px;
		background: #D8D8D8;
		border-radius: 50%;
		margin-left: 98px;
	}
	.upload-img-btn {
		width: 96px;
		height: 38px;
		background: rgba(237,91,0,0.18);
		border-radius: 22px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 14px;
		color: #F96E08;
		line-height: 20px;
		text-align: center;
		font-style: normal;
		border: none;
		margin-left: 20px;
	}
	.pen-name-item { 
		margin-top: 28px;

		/* 如果是单行输入框 (type="text")，类名稍有不同，通用写法如下 */
		::v-deep(.el-input__count-inner) {
			background: transparent !important;
		}
	}
	.pen-name-input, .author-desc-input, .author-email-input {
		width: 842px;
		height: 44px;
		border-radius: 6px;
		margin-left: 93px;

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
	.author-desc-item {
		margin-top: 28px;

		/* 如果是单行输入框 (type="text")，类名稍有不同，通用写法如下 */
		::v-deep(.el-input__count-inner) {
			background: transparent !important;
		}
	}
	.author-desc-input {
		margin-left: 64px;
	}
	.author-contact-title, .author-account-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 14px;
		color: #FFFFFF;
		line-height: 20px;
		text-align: left;
		font-style: normal;
		margin-top: 50px;
	}
	.author-email-item, .author-account-item {
		margin-top: 38px;
	}
	.author-email-input {
		margin-left: 78px;
	}
	.author-id {
		margin-left: 68px;
	}
	
</style>