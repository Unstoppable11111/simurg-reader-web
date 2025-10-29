<template>
  <div class="book-cate-container">
    <Header :margin-left="'244px'"/>
    <div class="book-cate-box">
      <!-- Breadcrumb navigation -->
      <div class="breadcrumb">
        <NuxtLink to="/" class="to-simurg-reader-index">首页</NuxtLink> > 
        <span class="book-cate-span">分类</span>
      </div>
      <div class="book-cate-content"> 
        <div class="book-cate-content-box">
          <div class="book-cate-content-title">
            类型
            <div class="book-cate-content-title-shadow"></div>
          </div>
          <div class="book-cate-item-box">
            <div class="without-div"><span class="without-limit">不限</span></div>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">现代甜宠</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">现代甜宠</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">古言风情</span>
            <span class="book-cate-item">现代甜宠</span>
            <span class="book-cate-item">古言风情</span>
          </div>
        </div>

        <div class="book-cate-content-box">
          <div class="book-cate-content-title">
            状态
            <div class="book-cate-content-title-shadow"></div>
          </div>
          <div class="book-cate-item-box">
            <div class="without-div"><span class="without-limit">不限</span></div>
            <span class="book-cate-item">完结</span>
            <span class="book-cate-item">连载</span>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
</script>

<style lang="scss" scoped>

  .book-cate-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .book-cate-box {
    width: 1200px;
    height: 292px;
    margin: 0 auto;
    padding-top: 80px;
  }
  .breadcrumb {
    color: #fff;
  }
  .to-simurg-reader-index {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
  .book-cate-span {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #CECECE;
    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
  .book-cate-content {
    margin-top: 24px;
  }
  .book-cate-content-box {
    display: flex;
  }
  .book-cate-content-title {
    display: flex;
    flex-direction: column;
    width: 58px;
    height: 30px;
    color: #fff;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  .book-cate-content-title-shadow {
    width: 45px;
    height: 19px;
    background: rgba(246,78,5,0.6);
    filter: blur(5px);
  }
  .book-cate-item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // gap: 24px;
  }
  .without-div {
    width: 58px;
    height: 30px;
    background: rgba(249,110,8,0.3);
    border-radius: 15px;
    text-align: center;
    margin-left: 30px;
  }
  .without-limit {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #F96E08;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    // background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
    /* 渐变背景，这里用红→橙示例，可自定义颜色、方向 */
    background: linear-gradient(0deg, #FF9B51 0%, #ED5B00 100%);
    /* 关键：让背景裁剪成文字形状 */
    -webkit-background-clip: text; 
    /* 文字填充色设透明，让渐变背景透出来 */
    -webkit-text-fill-color: transparent; 
    /* 兼容其他浏览器 */
    background-clip: text; 
    text-fill-color: transparent; 
  }
  .book-cate-item {
    width: 90px;
    height: 30px;
    border-radius: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 30px;
    text-align: center;
    font-style: normal;
    margin-left: 24px;
    margin-bottom: 29px;
  }
</style>