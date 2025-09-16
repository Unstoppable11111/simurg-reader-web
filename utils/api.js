const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://localhost:8082/simurg_reader_web/api'
export const API_ENDPOINTS = {
  /** 首页相关接口开始 */
  // 首页轮播图接口
  BANNERS: `${API_BASE_URL}/banner/role`,

  // 首页排行榜接口
  RANKING_BOOKS: `${API_BASE_URL}/ranking/books`,


  /** 首页相关接口结束*/

  // 书籍详情接口
  BOOK_DETAIL: `${API_BASE_URL}/book/detail`,

  // 书籍章节详情信息
  BOOK_CHAPTER_DETAIL: `${API_BASE_URL}/book/chapter/detail`,


  // 认证相关
  AUTH_GOOGLE: `${API_BASE_URL}/auth/1`,
}

// 通用的fetch请求函数
export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}