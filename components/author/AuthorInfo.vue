<!-- /components/author/AuthorInfo.vue -->
<template>
	<div class="author-info-container">
		<div class="author-info-header-box">
			<div class="author-info-header-title">个人信息</div>
			<button class="cancle">取消</button>
			<button class="save" @click="saveUserInfo">保存</button>
		</div>

		<div class="author-info-content-box"> 
			<el-form>
				<!-- 头像 -->
				<el-form-item class="author-avatar-label" label="头像" prop="authorAvatar"> 
				<img :src="authorAvatarUrl" class="author-avatar-img" />
				<el-upload
					class="author-img-upload"
					:action="API_ENDPOINTS.FILE_UPLOAD"
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
				<!-- 真实姓名 -->
				<el-form-item class="real-name-item" label="真实姓名" prop="realName"> 
					<el-input 
						type="text" class="real-name-input" 
						v-model="authorInfo.realName" 
						placeholder="请输入真实姓名" maxlength="10"
						show-word-limit/>
				</el-form-item>

				<!-- 身份证号 -->
				<el-form-item class="idcard-item" label="身份证号" prop="idcard"> 
					<el-input 
						type="text" class="idcard-input" 
						v-model="authorInfo.idcard" 
						placeholder="请输入身份证号" maxlength="18"
						show-word-limit/>
				</el-form-item>
				<!-- 地址 -->
				<el-form-item class="address-item" label="地址" prop="address"> 
					<el-input class="address-input" 
						v-model="authorInfo.address" placeholder="请输入地址" maxlength="10"
						show-word-limit/>
				</el-form-item>
				<!-- 国家 -->
				<el-form-item class="country-item" label="国家" prop="country"> 
					<el-input class="country-input" 
						v-model="authorInfo.country" placeholder="请输入国家" maxlength="10"
						show-word-limit/>
				</el-form-item>
				<div class="author-contact-title">联系方式</div>
				<!-- 邮箱 -->
				<el-form-item class="author-email-item" label="邮箱号" prop="email"> 
					<el-input type="text" class="author-email-input" v-model="authorInfo.email" placeholder="请输入邮箱号"/>
				</el-form-item>
				
				<!-- 邮箱 -->
				<el-form-item class="mobile-item" label="电话" prop="mobile"> 
					<el-input type="text" class="mobile-input" v-model="authorInfo.mobile" placeholder="请输入手机号"/>
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
	import type { UploadProps } from 'element-plus';
	const authorInfo = ref({});
	const authorAvatarUrl = ref(null);

	const initAuthroInfo = async () => { 
		const getAuthorInfoUrl = `${API_ENDPOINTS.AUTHO_INFO}`;
		const authorInfoResult = await apiRequest(getAuthorInfoUrl, {
			method: 'GET'
		});
		if (authorInfoResult.code === 200) {
			authorInfo.value = authorInfoResult.data;
			console.log("作者信息：{}", authorInfo.value);
			authorAvatarUrl.value = authorInfo.value.pictureUrl
		}
		
	}
	// 保存用户信息
	const saveUserInfo = async () => { 
		if (!validateAuthorInfo()) {
			return;
		}
		try {
			const updateUserInfoReq = {
				penName: authorInfo.value.penName,
				briefIntroduction: authorInfo.value.briefIntroduction,
				country: "tr"
			}
			console.log('更新用户信息', updateUserInfoReq);
			const updateUserInfoResult = await apiRequest(API_ENDPOINTS.UPDATE_AUTHOR_INFO, {
				method: 'POST',
				body: JSON.stringify(updateUserInfoReq)
			});
			console.log("更新用户信息", updateUserInfoResult);
			if (updateUserInfoResult.code === 200) {
				ElMessage.success('更新信息成功！');
				await initAuthroInfo();
			} else {
				ElMessage.error('更新信息失败！');
			}
		} catch (error) {
			console.error('保存用户信息失败：', error);
			ElMessage.error('保存失败，请稍后重试！');
		}
	}
	// 验证用户信息
	const validateAuthorInfo = () => { 
		// 数据校验
		if (!authorInfo.value.penName?.trim()) {
			ElMessage.warning('请输入笔名');
			return false;
		}
		
		if (!authorInfo.value.briefIntroduction?.trim()) {
			ElMessage.warning('请输入作家简介');
			return false;
		}
		
		if (!authorInfo.value.email?.trim()) {
			ElMessage.warning('请输入邮箱号');
			return false;
		}
		
		if (authorInfo.value.email?.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(authorInfo.value.email.trim())) {
				ElMessage.warning('请输入正确的邮箱格式');
				return false;
			}
		}
		return true;
	}
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

	onMounted(() => { 
		initAuthroInfo();
	})
</script>

<style scoped lang="scss">
	.author-info-container {
		width: 1016px;
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
		background: linear-gradient( 90deg, #F9A825 0%, #F9A825 100%);
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
	.pen-name-item, .real-name-item, .idcard-item, .address-item, .country-item { 
		margin-top: 28px;

		/* 如果是单行输入框 (type="text")，类名稍有不同，通用写法如下 */
		::v-deep(.el-input__count-inner) {
			background: transparent !important;
		}
	}
	.pen-name-input, 
	.author-desc-input,
	.real-name-input, 
	.idcard-input, 
	.address-input,
	.country-input,
	.author-email-input,
	.mobile-input {
		width: 842px;
		height: 44px;
		border-radius: 6px;
		margin-left: 70px;

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
	.author-desc-input, .real-name-input, .idcard-input {
		margin-left: 42px;
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
		margin-left: 56px;
	}
	.author-id {
		margin-left: 68px;
	}

	@media (max-width: 768px) {
		.author-info-container {
			width: 100%;
			padding: 16px;
		}
		.author-info-header-box {
			position: static;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			margin-bottom: 16px;
		}
		.author-info-header-title {
			position: static;
			margin-right: auto;
		}
		.cancle,
		.save {
			position: static;
			width: auto;
			height: 32px;
			padding: 0 14px;
		}
		.author-info-content-box {
			margin: 0;
		}
		.author-avatar-label,
		.pen-name-item,
		.author-email-item,
		.author-account-item {
			align-items: flex-start;
		}
		.author-avatar-img {
			margin-left: 0;
		}
		.upload-img-btn {
			margin-left: 0;
			margin-top: 8px;
		}
		.pen-name-input, 
		.author-desc-input,
		.real-name-input, 
		.idcard-input, 
		.address-input,
		.country-input,
		.author-email-input,
		.mobile-input {
			width: 100%;
			margin-left: 0;
		}
		.author-desc-input, .real-name-input, .idcard-input {
			margin-left: 0;
		}
		.author-email-input {
			margin-left: 0;
		}
		.author-id {
			margin-left: 0;
		}
		.author-contact-title,
		.author-account-title {
			margin-top: 24px;
		}
	}
	
</style>
