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
                <SvgIcon :name="item.active ? item.iconActivePath : item.iconPath" :class="item.active ? item.iconActivePath : item.iconPath" size="34" color=""/>
                <div style="margin-left: 10px;">{{ item.name }}</div>
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
  import SvgIcon from "@/components/SvgIcon.vue";
  import { formatTimestamp, formatSerialStatus } from '@/utils/dataFormatter';
  
  // 榜单导航项数据
  const rankingNavItems = ref([
    { id: 1, name: '热门榜', code: '1', active: true, iconPath: 'ranking-hot', iconActivePath: 'ranking-hot-active', },
    { id: 2, name: '新书榜', code: '2', active: false, iconPath: 'ranking-new', iconActivePath: 'ranking-new-active', },
    { id: 3, name: '畅销榜', code: '3', active: false, iconPath: 'ranking-selling', iconActivePath: 'ranking-selling-active', },
    { id: 4, name: '完结榜', code: '4', active: false, iconPath: 'ranking-finish', iconActivePath: 'ranking-finish-active', },
    { id: 5, name: '大神榜', code: '5', active: false, iconPath: 'ranking-god', iconActivePath: 'ranking-god-active', },
    { id: 6, name: '热搜榜', code: '6', active: false, iconPath: 'ranking-search', iconActivePath: 'ranking-search-active', }
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    background: linear-gradient(90deg, #F9A825 0%, #ED5B00 100%);
    color: #FFFFFF;
  }
  .ranking-hot, .ranking-new, 
  .ranking-hot-active, .ranking-new-active {
    color: transparent;
  }
  
  .ranking-title-box {
    width: 982px;
    height: 78px;
    // background: linear-gradient( 270deg, #FE5C54 0%, #F1951E 100%);
    // border-radius: 10px 10px 0px 0px;
  }
  .ranking-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
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
  .ranking-book-list {
    display: flex;
    flex-wrap: wrap;
    gap: 26px;
  }
  .ranking-book-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 310px;
    height: 480px;
    background: rgba(255,255,255,0.2);
    box-shadow: inset 0px 0px 8px 0px #FFFFFF;
    border-radius: 30px;
  }
  .ranking-book-item:hover {
    background: linear-gradient(270deg, #783535 0%, #734C1F 100%);
    // opacity: 0.4;
  }
  .book-info {
    display: flex;
    flex-direction: column;
    width: 310px;
    height: 182px;
    background: #FFFFFF;
    border-radius: 16px;
    margin-top: -50px;
    z-index: 2;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.15));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #fff;
  }
  .book-img {
    width: 240px;
    height: 320px;
    border-radius: 10px;
    z-index: 2;
    margin: 28px 35px 0 35px;
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
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    margin: 16px 14px 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-author {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #B2B2B2;
    line-height: 20px;
    margin: 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #B2B2B2;
    line-height: 20px;
    /** 超出3行显示省略号 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 14px;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
  .book-status {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #B2B2B2;
    line-height: 18px;
    margin: 20px 0 0 14px;
    &:hover {
      color: #F9A825;
      cursor: pointer;
    }
  }
</style>