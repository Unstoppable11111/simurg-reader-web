const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://localhost:8082/simurg_reader_web/api'
export const API_ENDPOINTS = {
  /** 首页相关接口开始 */
  BANNERS: `${API_BASE_URL}/banner/role`,
  TAG_BOOKS: `${API_BASE_URL}/book/list_by_tag`,
  RECOMMEND_BOOKS: `${API_BASE_URL}/recommend/books`,
  RANKING_BOOKS: `${API_BASE_URL}/ranking/books`,
  RECENT_UPDATE_BOOKS: `${API_BASE_URL}/book/recent-update`,
  CATEGORIES: `${API_BASE_URL}/category/list`,

  /** 首页相关接口结束*/

  /** 书架相关接口开始 */
  BOOK_DETAIL: `${API_BASE_URL}/book/detail`,
  BOOK_CHAPTER_DETAIL: `${API_BASE_URL}/book/chapter/detail`,
  FILE_UPLOAD: `${API_BASE_URL}/file/upload`,
  /** 书架相关接口结束 */

  /** 成为作者接口开始 */
  BECOME_AUTHOR: `${API_BASE_URL}/oauth/user/become/author`,
  /** 成为作者接口结束 */



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

export async function apiFileRequest(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
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