<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3>关于</h3>
        <ul>
          <li><NuxtLink to="/about-us">关于我们</NuxtLink></li>
          <li><NuxtLink to="/contact-us">联系我们</NuxtLink></li>
          <li><NuxtLink to="/resources">资源</NuxtLink></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>支持</h3>
        <ul>
          <li><NuxtLink to="/help">帮助</NuxtLink></li>
          <li><NuxtLink to="/feedback">反馈</NuxtLink></li>
          <li><NuxtLink to="/copyright-complaint">版权投诉</NuxtLink></li>
          <li><NuxtLink to="/partners">合作伙伴</NuxtLink></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>合法的</h3>
        <ul>
          <li><NuxtLink to="/terms-of-use">使用条款</NuxtLink></li>
          <li><NuxtLink to="/privacy-policy">隐私政策</NuxtLink></li>
          <li><NuxtLink to="/settings">设置</NuxtLink></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>保持联系</h3>
        <ul>
          <li><NuxtLink to="/contact-info">**********</NuxtLink></li>
          <li><NuxtLink to="https://facebook.com" target="_blank">Facebook</NuxtLink></li>
          <li><NuxtLink to="https://instagram.com" target="_blank">Instagram</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      版权归塔塔所有
    </div>
  </footer>
</template>

<script setup>
// 无需额外引入，Nuxt 会自动提供 NuxtLink
</script>

<style scoped>
.site-footer {
  /* background: linear-gradient(to bottom, #2a2a38, #3a2f4d); */
  color: #fff;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  width: 1360px;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.footer-column {
  margin-bottom: 20px;
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin-bottom: 10px;
}

.footer-column ul li a,
.footer-column ul li NuxtLink {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;
}

.footer-column ul li a:hover,
.footer-column ul li NuxtLink:hover {
  color: #fff;
}

.copyright {
  text-align: center;
  margin-top: 30px;
  color: #bbb;
  font-size: 14px;
}
</style>
