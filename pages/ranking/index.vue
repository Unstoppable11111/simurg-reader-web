<template>
  <div class="ranking-page">
    <Header />
    <div class="ranking-container">
      <!-- 面包屑导航 -->
      <nav class="ranking-breadcrumb" aria-label="面包屑导航">
        <NuxtLink to="/" class="breadcrumb-link">首页</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">排行榜</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current active-sub">{{ currentRanking }}</span>
      </nav>

      <div class="ranking-main-layout">
        <div class="ranking-box">
          <div class="ranking-nav-box">
            <div class="ranking-nav-list">
              <div 
                v-for="item in rankingNavItems" 
                :key="item.id"
                class="ranking-nav-item"
                :class="{ 'active': item.active }"
                @click="selectRanking(item)">
                  <SvgIcon :name="item.active ? item.iconActivePath : item.iconPath" :class="item.active ? item.iconActivePath : item.iconPath" color=""/>
                  <div style="margin-left: 10px;" :class="{ 'active-text': item.active }">{{ item.name }}</div>
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
            <div class="ranking-book-list" v-reveal>
              <div 
                v-for="(book, index) in rankingBooks" 
                :key="book.bookId || index"
                @click="gotoBookDetail(book.bookId)"
                class="ranking-book-item motion-card">
                <div class="cover-wrapper">
                  <span class="rank-badge" :class="index < 3 ? `rank-${index + 1}` : 'rank-other'">
                    {{ index + 1 }}
                  </span>
                  <img class="book-img" :src="book.coverImageUrl" :alt="book.title || '封面'" loading="lazy">
                </div>
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
    <Footer />
  </div>
</template>

<script setup>
  import Header from "@/components/layout/Header.vue";
  import Footer from "@/components/layout/Footer.vue";
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
    router.push(`/book/${bookId}`)
  }
</script>

<style lang="scss" scoped>
  .ranking-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .ranking-container {
    max-width: 1200px;
    width: calc(100% - 32px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding-top: 96px;
    padding-bottom: 60px;
    flex: 1;
  }
  .ranking-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #7c7e82;
    margin-bottom: 24px;
    .breadcrumb-link {
      color: #b0b1b3;
      text-decoration: none;
      transition: color 0.15s ease;
      &:hover {
        color: #e59344;
      }
    }
    .breadcrumb-separator {
      color: rgba(255, 255, 255, 0.2);
    }
    .breadcrumb-current {
      color: #7c7e82;
      &.active-sub {
        color: #e59344;
        font-weight: 500;
      }
    }
  }
  .ranking-main-layout {
    display: flex;
    width: 100%;
  }
  .ranking-box {
    width: 200px;
    margin-right: 38px;
    margin-left: 0;
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
    height: 58px;
    text-align: center;
    line-height: 72px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
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
    font-weight: 600;
  }
  .ranking-hot, .ranking-new, 
  .ranking-hot-active, .ranking-new-active,
  .ranking-selling, .ranking-selling-active,
  .ranking-finish, .ranking-finish-active,
  .ranking-god, .ranking-god-active,
  .ranking-search, .ranking-search-active {
    width: 22px;
    height: 22px;
    color: transparent;
  }
  .ranking-hot, .ranking-hot-active {
    width: 20px;
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
    background: var(--bg-surface-1, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
    border-radius: 20px;
    cursor: pointer;
    overflow: hidden;

    &:hover {
      border-color: var(--brand-primary, #e59344);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);

      .book-img {
        transform: scale(1.03);
      }
    }
  }
  .cover-wrapper {
    position: relative;
    overflow: hidden;
    margin: 24px 35px 0 35px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
  }
  .rank-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);

    &.rank-1 {
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      color: #000000;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
    }

    &.rank-2 {
      background: linear-gradient(135deg, #e0e0e0 0%, #9e9e9e 100%);
      color: #000000;
      box-shadow: 0 4px 12px rgba(200, 200, 200, 0.4);
    }

    &.rank-3 {
      background: linear-gradient(135deg, #e6a875 0%, #b8652e 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
    }

    &.rank-other {
      background: rgba(0, 0, 0, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e0e0e0;
    }
  }
  .book-img {
    width: 240px;
    height: 320px;
    border-radius: 10px;
    object-fit: cover;
    transition: transform var(--duration-medium, 300ms) var(--ease-out-smooth, cubic-bezier(0.16, 1, 0.3, 1));
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
    background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(13px);
    color: #fff;
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

  @media (max-width: 768px) {
    .ranking-container {
      width: 100%;
      flex-direction: column;
      padding: 90px 16px 20px;
    }
    .ranking-main-layout {
      flex-direction: column;
    }
    .ranking-box {
      width: 100%;
      margin: 0 0 16px 0;
    }
    .ranking-nav-list {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
    }
    .ranking-nav-item {
      width: calc(50% - 4px);
      height: 44px;
      line-height: 44px;
      border-radius: 10px;
    }
    .ranking-title-box {
      width: 100%;
      height: auto;
    }
    .ranking-title {
      padding-left: 0;
      line-height: 40px;
    }
    .ranking-book-list {
      gap: 12px;
      justify-content: space-between;
    }
    .ranking-book-item {
      width: calc(50% - 6px);
      height: auto;
      border-radius: 16px;
    }
    .book-img {
      width: 100%;
      height: 200px;
      margin: 16px 0 0 0;
    }
    .book-info {
      width: 100%;
      height: auto;
      margin-top: -24px;
    }
  }

  @media (max-width: 480px) {
    .ranking-book-item {
      width: 100%;
    }
    .book-img {
      height: 220px;
    }
  }
</style>
