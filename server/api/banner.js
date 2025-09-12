// 服务器端API路由示例
// 实际项目中应从数据库或其他数据源获取数据
export default defineEventHandler(async (event) => {
  // 模拟数据库查询延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 模拟轮播图数据
  const banners = [
    {
      id: 1,
      imageUrl: 'http://www.tireba.com/simurg-reader/images/banner1.png',
      altText: '夏季新书推荐',
      link: '/books/summer-collection',
      newTab: false,
      caption: {
        title: '夏季新书推荐',
        description: '探索这个夏天最热门的畅销书'
      }
    },
    {
      id: 2,
      imageUrl: 'http://www.tireba.com/simurg-reader/images/banner2.png',
      altText: '会员专享折扣',
      link: '/membership/offers',
      newTab: false,
      caption: {
        title: '会员专享 7折优惠',
        description: '限时活动，立即加入会员享福利'
      }
    },
    {
      id: 3,
      imageUrl: 'http://www.tireba.com/simurg-reader/images/banner3.png',
      altText: '年度文学奖获奖作品',
      link: '/awards/2023',
      newTab: false,
      caption: {
        title: '2023年度文学奖获奖作品',
        description: '见证文学界的荣耀时刻'
      }
    }
  ]
  
  // 返回标准格式的响应
  return {
    code: 200,
    message: 'success',
    data: banners
  }
})
