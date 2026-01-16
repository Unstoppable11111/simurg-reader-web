<!-- pages/help-center.vue -->
<template>
  <Header :margin-left="'360px'"/>
  <div class="help-center-page">
    <!-- 新增：大标题区域 -->
    <div class="page-title-container">
      <h1 class="page-main-title">帮助中心</h1>
      <p class="page-sub-title">解决你在使用过程中遇到的各类问题</p>
    </div>
    
    <div class="container">
      <!-- 左侧边栏菜单（帮助中心子分类） -->
      <div class="sidebar">
        <div 
          class="menu-item" 
          :class="{ active: activeSubMenu === 'account' }"
          @click="switchSubMenu('account')"
        >
          账户相关
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeSubMenu === 'reading' }"
          @click="switchSubMenu('reading')"
        >
          阅读设置
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeSubMenu === 'recharge' }"
          @click="switchSubMenu('recharge')"
        >
          充值消费
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeSubMenu === 'author' }"
          @click="switchSubMenu('author')"
        >
          作者相关
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeSubMenu === 'technical' }"
          @click="switchSubMenu('technical')"
        >
          技术支持
        </div>
      </div>

      <!-- 右侧主要内容 -->
      <div class="main-content">
        <!-- 账户相关 -->
        <div v-if="activeSubMenu === 'account'" class="content-section">
          <h2>账户相关</h2>
          <div class="content-wrapper">
            <div class="faq-item">
              <h3>如何注册账户？</h3>
              <p>
                点击网站右上角的"注册"按钮，填写手机号/邮箱、验证码和密码即可完成注册。
                注册后您可以享受个性化推荐、书架收藏、阅读记录同步等专属功能。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>忘记密码怎么办？</h3>
              <p>
                在登录页面点击"忘记密码"，输入注册时的手机号/邮箱，获取验证码后即可重置密码。
                若未收到验证码，请检查垃圾邮件箱或联系客服核实账户信息。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何绑定/更换手机号？</h3>
              <p>
                登录后进入"个人中心-账户安全"，点击"绑定手机号"或"更换手机号"，
                验证原手机号后输入新手机号和验证码即可完成操作。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>账户被冻结/封禁怎么办？</h3>
              <p>
                账户冻结通常是因为违反平台规则导致，您可以通过客服邮箱 support@simurgreader.com 
                提交申诉，说明情况并提供账户信息，我们会在1-3个工作日内审核并回复。
              </p>
            </div>
          </div>
        </div>

        <!-- 阅读设置 -->
        <div v-else-if="activeSubMenu === 'reading'" class="content-section">
          <h2>阅读设置</h2>
          <div class="content-wrapper">
            <div class="faq-item">
              <h3>如何调整字体大小和样式？</h3>
              <p>
                在阅读界面点击屏幕中央呼出菜单，选择"字体设置"，可调整字体大小、字体样式（宋体/黑体/楷体等）、
                行间距和字间距，满足不同阅读习惯。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何切换阅读背景？</h3>
              <p>
                阅读菜单中选择"背景设置"，提供护眼绿、夜间黑、羊皮纸等多种背景色可选，
                也可自定义背景亮度和对比度。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何设置翻页方式？</h3>
              <p>
                支持左右滑动、点击翻页、滚轮翻页三种方式，在"阅读设置"中可切换默认翻页方式，
                也可开启/关闭翻页动画效果。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何添加书签和笔记？</h3>
              <p>
                长按阅读界面任意位置，可添加书签；选中文字后可添加笔记、标注或分享，
                所有书签和笔记均可在"我的-阅读笔记"中查看和管理。
              </p>
            </div>
          </div>
        </div>

        <!-- 充值消费 -->
        <div v-else-if="activeSubMenu === 'recharge'" class="content-section">
          <h2>充值消费</h2>
          <div class="content-wrapper">
            <div class="faq-item">
              <h3>支持哪些充值方式？</h3>
              <p>
                支持微信支付、支付宝、银行卡、苹果内购等多种充值方式，
                充值金额实时到账，1元=100阅读币，无手续费。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>阅读币的使用规则？</h3>
              <p>
                阅读币可用于购买付费章节、整本小说或解锁VIP内容，不同书籍的收费标准不同，
                章节价格会在阅读前明确标注，消费后不可退款。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何查看充值和消费记录？</h3>
              <p>
                进入"个人中心-我的钱包"，可查看所有充值记录、消费明细和剩余阅读币，
                支持导出近6个月的消费账单。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>充值未到账怎么办？</h3>
              <p>
                若充值成功但阅读币未到账，请保留支付凭证（订单号/截图），联系客服邮箱 support@simurgreader.com，
                我们会核实并在24小时内补到账。
              </p>
            </div>
          </div>
        </div>

        <!-- 作者相关 -->
        <div v-else-if="activeSubMenu === 'author'" class="content-section">
          <h2>作者相关</h2>
          <div class="content-wrapper">
            <div class="faq-item">
              <h3>如何成为签约作者？</h3>
              <p>
                进入"作者中心"提交入驻申请，填写个人信息并上传至少3万字的作品正文，
                审核团队会在7个工作日内评估作品质量，通过后即可签约。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>作者如何发布章节？</h3>
              <p>
                签约成功后，在"作者后台-作品管理"中创建作品，填写作品信息和简介，
                即可分章节发布内容，发布前可预览排版效果。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>稿费结算规则？</h3>
              <p>
                稿费按月结算，结算周期为每月1-5日，结算上月收益，支持银行卡/支付宝提现，
                具体分成比例和结算规则详见《作者签约协议》。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>作品违规被下架怎么办？</h3>
              <p>
                作品下架会通过作者后台消息通知具体原因，您可根据整改要求修改内容后提交复审，
                复审通过后即可恢复上架。
              </p>
            </div>
          </div>
        </div>

        <!-- 技术支持 -->
        <div v-else-if="activeSubMenu === 'technical'" class="content-section">
          <h2>技术支持</h2>
          <div class="content-wrapper">
            <div class="faq-item">
              <h3>网页端无法登录怎么办？</h3>
              <p>
                请检查网络连接，清除浏览器缓存和Cookie，或更换浏览器（推荐Chrome/Edge最新版）。
                若仍无法登录，尝试使用手机验证码登录或联系技术支持。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>阅读时出现乱码/排版错误？</h3>
              <p>
                刷新页面或重新进入阅读界面，若问题持续，可在阅读菜单中选择"重新加载章节"，
                或反馈给客服说明具体书籍和章节号。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>APP闪退/卡顿如何解决？</h3>
              <p>
                建议更新APP到最新版本，清理手机缓存，关闭后台多余应用。
                若仍有问题，可通过APP内"我的-意见反馈"提交设备型号和问题描述。
              </p>
            </div>
            
            <div class="faq-item">
              <h3>如何联系技术支持？</h3>
              <p>
                技术问题可发送邮件至 tech@simurgreader.com，注明问题描述、设备信息和截图，
                我们会在24小时内回复解决方案。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue';
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 响应式状态，跟踪当前激活的子菜单
const activeSubMenu = ref('account')

// 切换子菜单的方法
const switchSubMenu = (subMenu) => {
  activeSubMenu.value = subMenu
  // 更新URL查询参数，支持刷新页面保留状态
  router.replace({ query: { sub: subMenu } })
}

// 组件挂载时读取URL参数
onMounted(() => {
  const sub = route.query.sub
  if (sub && ['account', 'reading', 'recharge', 'author', 'technical'].includes(sub)) {
    activeSubMenu.value = sub
  }
})

// 监听路由参数变化
watch(() => route.query.sub, (newSub) => {
  if (newSub && ['account', 'reading', 'recharge', 'author', 'technical'].includes(newSub)) {
    activeSubMenu.value = newSub
  }
})
</script>

<style lang="scss" scoped>
.help-center-page {
  display: flex;
  flex-direction: column; /* 改为纵向排列，容纳顶部标题 */
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 120px);
  background-color: #1a1a1a;
  color: #ffffff;
}

// 新增：大标题样式
.page-title-container {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
}

.page-main-title {
  font-size: 36px;
  font-weight: 700;
  color: #f96e08;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f9a825 0%, #f96e08 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.page-sub-title {
  font-size: 18px;
  color: #bbb;
  letter-spacing: 1px;
}

.container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: #2d2d2d;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  /* 移除原margin-top，标题已占间距 */
}

.sidebar {
  width: 220px;
  background: #3a3a3a;
  padding: 20px 0;
}

.menu-item {
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: rgba(249, 110, 8, 0.1);
    color: #f96e08;
  }

  &.active {
    background: rgba(249, 110, 8, 0.2);
    color: #f96e08;
    border-left: 4px solid #f96e08;
  }
}

.main-content {
  flex: 1;
  padding: 30px 40px;
  background: #2d2d2d;
}

.content-section {
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #f96e08;
    padding-bottom: 12px;
    border-bottom: 1px solid #444;
  }
}

.content-wrapper {
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0 12px;
    color: #f9a825;
  }

  p {
    font-size: 15px;
    line-height: 1.7;
    color: #ccc;
    margin-bottom: 16px;
  }
}

.faq-item {
  margin-bottom: 28px;
  
  h3 {
    font-size: 17px;
    color: #f9a825;
    margin-bottom: 10px;
  }
  
  p {
    margin: 0;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .page-main-title {
    font-size: 28px;
  }
  
  .page-sub-title {
    font-size: 16px;
  }
  
  .container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 10px 0;
  }
  
  .menu-item {
    display: inline-block;
    padding: 12px 16px;
    font-size: 14px;
    border-left: none;
    border-bottom: 3px solid transparent;
    
    &.active {
      border-left: none;
      border-bottom: 3px solid #f96e08;
    }
  }
  
  .main-content {
    padding: 20px;
  }
}
</style>