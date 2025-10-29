<template>
  <div class="author-page">
    <Header :margin-left="'244px'"/>
    <div class="author-container">
      <div class="author-box">
        <img class="author-img" src="http://www.tata2025.xyz/uploads/2025/10/21/2566ebd9-91e1-4d0c-b239-9d2e89b325de.png" alt="">
        <!-- 作者信息简介开始 -->
        <div class="author-info">
          <div class="author-pen-name-box">
            <span class="author-name">田拽拽</span>
            <div class="author-tag">作家</div>
          </div>
          <span class="author-sign">用心写出不一样的东西</span>
        </div>
        <!-- 作者信息简介结束 -->

        <!-- 作者创作信息详情开始 -->
        <div class="author-detail-info">
          <div class="author-detail-item">
            <label class="author-detail-item-label">创作天数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">421</span>
              <span class="author-detail-item-unit">天</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">作品总数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">2</span>
              <span class="author-detail-item-unit">本</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">累计字数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">885020</span>
              <span class="author-detail-item-unit">字</span>
            </div>
          </div>
          
          <div class="author-detail-item">
            <label class="author-detail-item-label">粉丝数</label>
            <div class="author-detail-item-value-box">
              <span class="author-detail-item-value">20020</span>
              <span class="author-detail-item-unit">人</span>
            </div>
          </div>
        </div>
        <!-- 作者创作信息详情结束 -->

      </div>

      <!-- 作品列表开始 -->
    </div>

    

    <div class="author-all-book-title">
      全部作品（2）
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";

</script>

<style lang="scss" scoped>
  .author-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .author-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 226px;
    // background: linear-gradient( 270deg, #FE5C54 0%, #F1951E 100%);
    background-color: #432b1c;
    margin-top: 84px;
  }
  .author-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 1200px;
  }
  .author-img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
  }
  .author-info {
    width: 120px;
    height: 54px;
    margin-left: 18px;
  }
  .author-pen-name-box {
    display: flex;
    align-items: center;
  }
  .author-name {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
  .author-tag {
    width: 44px;
    height: 17px;
    background: linear-gradient( 180deg, #FFD50D 0%, #ED5B00 100%);
    border-radius: 2px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #FFFFFF;
    line-height: 14px;
    text-align: center;
    font-style: normal;
    margin-left: 12px;
  }
  .author-sign {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-top: 12px;
  }
  .author-detail-info {
    position: absolute;
    right: 0;
    display: flex;
    gap: 68px;
    width: 438px;
    height: 50px;
  }
  .author-detail-item-label {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #A2A0A0;
    line-height: 17px;
    text-align: center;
    font-style: normal;
  }
  .author-detail-item-value {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: center;
    font-style: normal;
  }
  .author-detail-item-unit {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 10px;
    color: #A2A0A0;
    line-height: 14px;
    text-align: left;
    font-style: normal;
  }
  .author-all-book-title {
    width: 1200px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
</style>