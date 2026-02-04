<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3 class="column-title">关于</h3>
        <div class="column-links">
          <NuxtLink to="/footer-common?section=about">关于我们</NuxtLink>
          <NuxtLink to="/footer-common?section=contact">联系我们</NuxtLink>
          <NuxtLink to="/footer-common?section=resources">资源</NuxtLink>
        </div>
      </div>

      <div class="footer-column">
        <h3 class="column-title">支持</h3>
        <div class="column-links">
          <NuxtLink to="/help">帮助</NuxtLink>
          <NuxtLink to="/feedback">反馈</NuxtLink>
          <NuxtLink to="/copyright-complaint">版权投诉</NuxtLink>
          <NuxtLink to="/partners">合作伙伴</NuxtLink>
        </div>
      </div>

      <div class="footer-column">
        <h3 class="column-title">合法的</h3>
        <div class="column-links">
          <NuxtLink to="/footer-common?section=terms">使用条款</NuxtLink>
          <NuxtLink to="/footer-common?section=privacy">隐私政策</NuxtLink>
          <NuxtLink to="/settings">设置</NuxtLink>
        </div>
      </div>

      <div class="footer-column">
        <h3 class="column-title">保持联系</h3>
        <div class="column-links">
          <NuxtLink to="/contact-info" class="contact-text">**********</NuxtLink>
          <NuxtLink to="https://facebook.com" target="_blank">Facebook</NuxtLink>
          <NuxtLink to="https://instagram.com" target="_blank">Instagram</NuxtLink>
        </div>
      </div>

      <div class="footer-brand-section">
        <h2 class="brand-name">SIMURG READER PTY. LTD.</h2>
        <div class="brand-info">
          <p>info@simurg-reader.com</p>
          <p>TEL: +86 (xxx) xxxx xxxx</p>
          <p class="copyright-text">Copyright © {{ new Date().getFullYear() }} www.simurg-reader-test.tata.org.cn All rights reserved</p>
          <p class="icp-text">粤ICP备2025480951号-1</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #000; /* 纯黑背景 */
  color: #fff;
  padding: 60px 40px;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 全部左对齐 */
}

.footer-column {
  flex: 1;
  min-width: 200px;
  margin-bottom: 40px;
}

.column-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff; /* 标题纯白 */
  margin-bottom: 25px;
  letter-spacing: 0.5px;
}

.column-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.column-links a {
  color: #888888; /* 淡白色（浅灰） */
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.column-links a:hover {
  color: #ffffff;
}

.footer-brand-section {
  width: 100%;
  margin-top: 20px;
  padding-top: 40px;
  border-top: 1px solid #1a1a1a; /* 极暗的分割线 */
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-info p {
  font-size: 13px;
  color: #555555; /* 最淡的文字用于备案号和次要信息 */
  margin: 0;
}

.brand-info .copyright-text {
  margin-top: 10px;
}

/* --- 移动端适配：竖向排列 --- */
@media screen and (max-width: 768px) {
  .site-footer {
    padding: 50px 24px;
  }

  .footer-container {
    flex-direction: column;
  }

  .footer-column {
    width: 100%;
    margin-bottom: 45px;
  }

  .column-title {
    font-size: 20px; /* 移动端标题稍大一点 */
    margin-bottom: 20px;
  }

  .column-links a {
    font-size: 16px; /* 方便点击 */
    padding: 4px 0;
  }

  .brand-name {
    font-size: 18px;
  }
}
</style>