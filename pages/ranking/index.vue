<template>
  <div class="ranking-page">
    <Header :margin-left="'360px'" />
    <div class="ranking-container">
      <div class="ranking-box">
        <div class="ranking-nav-box">
          <div class="ranking-nav-list">
            <div 
              v-for="item in rankingNavItems" 
              :key="item.id"
              class="ranking-nav-item"
              :class="{ 'active': item.active }"
              @click="selectRanking(item)">
                <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ranking-content-box">
        <div class="ranking-title-box">
          <div class="ranking-title">
              {{ currentRanking }}
          </div>
        </div>
        <!-- <div class="ranking-desc-box">
          <div class="ranking-desc-text">基于昨日书籍热度排行</div>
          <div 
            class="ranking-day"
            :class="{ 'active-type': rankingType === '日榜' }"
            @click="selectRankingType('日榜')">
            日榜
          </div>
          <div 
            class="ranking-month"
            :class="{ 'active-type': rankingType === '月榜' }"
            @click="selectRankingType('月榜')">
            月榜
          </div>
        </div> -->
        <div class="ranking-book-box">
          <div class="ranking-book-list">
            <div 
              v-for="book in rankingBooks" 
              :key="book.bookId"
              @click="gotoBookDetail(book.bookId)"
              class="ranking-book-item">
              <img class="book-img" :src="book.coverImageUrl" :alt="book.title">
              <div class="book-info">
                <div class="book-title">{{ book.title }}</div>
                <div class="book-author">{{ book.penName }}</div>
                <div class="book-desc">{{ book.description }}</div>
                <div class="book-status">
                    {{ formatSerialStatus(book.serialStatus) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  
  // 榜单导航项数据
  const rankingNavItems = ref([
    { id: 1, name: '热门榜', code: '1', active: true },
    { id: 2, name: '新书榜', code: '2', active: false },
    { id: 3, name: '畅销榜', code: '3', active: false },
    { id: 4, name: '完结榜', code: '4', active: false },
    { id: 5, name: '大神榜', code: '5', active: false },
    { id: 6, name: '热搜榜', code: '6', active: false }
  ]);
  
  // 当前选中的榜单
  const currentRanking = ref('热门榜');
  const currentRankingCode = ref('1');
  
  const router = useRouter()
  // 榜单类型（日榜、月榜）
  const rankingType = ref('日榜');
  
  // 模拟书籍数据
  const rankingBooks = ref([]);

  
  const fetchRankingData = async (rankingCode) => {
    try {
      // 默认查询大热榜数据
      const rankingBookListReq = {
        rankingType: currentRankingCode.value,
        rankingSize: 10
      }
      console.log("请求参数：{}", rankingBookListReq);
      const rankingBookResult = await apiRequest(API_ENDPOINTS.RANKING_BOOKS, {
        method: 'POST',
        body: JSON.stringify(rankingBookListReq)
      });
      console.log("rankingCode书籍榜单", rankingCode, rankingBookResult);
      if (rankingBookResult.code === 200) {
        rankingBooks.value = rankingBookResult.data;
      }
    } catch (error) {
    }
  }

  onMounted(() => {
    fetchRankingData(currentRankingCode.value);
  });
  
  // 选择榜单
  const selectRanking = async (item) => {
    // 更新导航项的激活状态
    rankingNavItems.value.forEach(navItem => {
      navItem.active = navItem.id === item.id;
    });
    
    // 更新当前榜单名称
    currentRanking.value = item.name;
    currentRankingCode.value = item.code;
    
    // 这里可以添加请求对应榜单数据的逻辑
    console.log(`切换到${item.name}`);
    await fetchRankingData(currentRankingCode.value);
    
  };
  
  // 选择榜单类型
  const selectRankingType = (type) => {
    rankingType.value = type;
    // 这里可以添加请求对应榜单类型数据的逻辑
    console.log(`切换到${type}`);
  };

  // 点击书籍跳转到详情页
  const gotoBookDetail = (bookId) => {
    console.log('点击了书籍，ID:', bookId)
    // 使用路由跳转到书籍详情页
    router.push(`/book/${bookId}`)
  }
</script>

<style lang="scss" scoped>
  .ranking-page {
    display: flex;
    flex-direction: column;
  }
  .ranking-container {
    width: 1200px;
    display: flex;
    padding-top: 122px;
  }
  .ranking-box {
    width: 200px;
    margin-right: 38px;
    margin-left: 360px;
  }
  .ranking-nav-list {
    display: flex;
    flex-direction: column;
  }
  .ranking-nav-item {
    width: 180px;
    height: 82px;
    text-align: center;
    line-height: 82px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #A2A0A0;
    text-align: center;
    font-style: normal;
    background-color: #424242;
    cursor: pointer;
  }
  .ranking-nav-item:first-child.active, .ranking-nav-item:first-child:hover{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ranking-nav-item:last-child.active, .ranking-nav-item:last-child:hover{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  
  .ranking-nav-item:hover {
    color: #FFFFFF;
  }
  .active {
    background: rgba(249,110,8,0.65);
    color: #FFFFFF;
  }
  
  .ranking-title-box {
    width: 982px;
    height: 78px;
    background: linear-gradient( 270deg, #FE5C54 0%, #F1951E 100%);
    border-radius: 10px 10px 0px 0px;
  }
  .ranking-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 24px;
    color: #FFFFFF;
    line-height: 33px;
    text-align: left;
    font-style: normal;
    color: #fff;
    line-height: 78px;
    padding-left: 34px;
  }
  .ranking-desc-box {
    position: relative;;
    display: flex;
    width: 1122px;
    height: 50px;
    background: #2F2437;
  }
  .ranking-desc-text {
    width: 160px;
    height: 22px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #828282;
    line-height: 50px;
    text-align: left;
    font-style: normal;
    padding-left: 34px;
  }
  .ranking-day, .ranking-month {
    position: absolute;
    top: 12.5px;
    width: 36px;
    height: 25px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #828282;
    line-height: 25px;
    text-align: left;
    font-style: normal;
    cursor: pointer;
  }
  .ranking-day {
    right: 118px;
  }
  .ranking-month {
    right: 32px;
  }
  .active-type {
    font-weight: 600 !important;
    color: #D8D8D8 !important;
  }
  .ranking-book-box {
    // margin-top: 34px;
  }
  .ranking-book-item {
    display: flex;
    padding: 34px;
    // border-radius: 10px;
    margin-bottom: 20px;
    // &:hover {
    //   /* 只改变容器背景，不影响子元素 */
    //   background: linear-gradient(270deg, #FE5C54 0%, #F1951E 100%);
    //   opacity: 0.4;
    // }
  }
  .ranking-book-item:hover {
    background: linear-gradient(270deg, #FE5C54 0%, #F1951E 100%);
    opacity: 0.4;
  }
  .book-info {
    display: flex;
    flex-direction: column;
    padding-left: 16px;
  }
  .book-img {
    width: 156px;
    height: 208px;
    border-radius: 10px;
    z-index: 2;
  }
  .ranking-book-item:hover {
    .book-info {
      opacity: 1 !important;
      filter: none;
    }
  }
  .book-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #FFFFFF;
    line-height: 28px;
    margin-bottom: 10px;
    &:hover {
      color: #EA7D2B;
      cursor: pointer;
    }
  }
  .book-author {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #B2B2B2;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #828282;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .book-status {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #B2B2B2;
    line-height: 20px;
  }
</style>