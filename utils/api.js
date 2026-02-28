import axios from 'axios'
/**
 * 开发、测试、生产
 */
const API_BASE_URL = "http://localhost:8082/api"
// const API_BASE_URL = "http://www.sr-web-test.tata.org.cn:8082/api";

// const API_BASE_URL = config.public.API_BASE_URL
// const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://8.129.12.50:8082/simurg_reader_web/api'
export const API_ENDPOINTS = {
  /** 首页相关接口开始 */
  BANNERS: `${API_BASE_URL}/banner/role`,
  TAG_BOOKS: `${API_BASE_URL}/book/list_by_tag`,
  RECOMMEND_BOOKS: `${API_BASE_URL}/recommend/books`,
  RANKING_BOOKS: `${API_BASE_URL}/ranking/books`,
  RECENT_UPDATE_BOOKS: `${API_BASE_URL}/book/recent-update`,
  CATEGORIES: `${API_BASE_URL}/book/categories/list/all`,
  BOOK_SEARCH_BY_KEYWORDS: `${API_BASE_URL}/book/search`,

  /** 首页相关接口结束*/

  /** 用户相关接口开始 */
  CHECK_FOLLOW: `${API_BASE_URL}/oauth/user/follow/check/`,
  LIST_FOLLOW: `${API_BASE_URL}/oauth/user/follow/list`,
  LIST_FANS: `${API_BASE_URL}/oauth/user/follow/fans`,
  FOLLOW: `${API_BASE_URL}/oauth/user/follow/operation_by_type`,
  USER_READING_HISTORY: `${API_BASE_URL}/oauth/reading-record/list`,
  /** 用户相关接口结束 */

  /** 书籍相关接口开始 */
  CREATE_BOOK: `${API_BASE_URL}/author/oauth/create_book`,
  UPDATE_BOOK: `${API_BASE_URL}/author/oauth/update_book`,
  DELETE_BOOK: `${API_BASE_URL}/author/oauth/delete_book`,
  LIST_ALL_BOOS_BY_AUTHOR: `${API_BASE_URL}/author/oauth/all_book`,
  LIST_PUBLISHED_BOOKS: `${API_BASE_URL}/book/list/published_book/author/`,
  
  /** 书籍相关接口结束 */

  /** 书籍评论相关接口开始 */
  LIST_COMMENTS: `${API_BASE_URL}/comment/list_with_paragraph`,
  ADD_COMMENT: `${API_BASE_URL}/comment/oauth/add`,

  /** 书籍评论相关接口结束 */

  /** 书籍分类相关接口开始 */
  LIST_ALL_BOOK_CATEGORY: `${API_BASE_URL}/book/categories/list/all`,
  LIST_BOOK_BY_CATEGORY: `${API_BASE_URL}/books/categories/books_by_category`,
  LIST_LIBRARY_BOOKS: `${API_BASE_URL}/book/categories/library/book_list`,
  /** 书籍分类相关接口结束 */

  /** 书籍章节相关接口开始 */
  CREATE_CHAPTER: `${API_BASE_URL}/author/create_chapter`,
  UPDATE_CHAPTER: `${API_BASE_URL}/author/update_chapter`,
  DELETE_CHAPTER: `${API_BASE_URL}/author/delete_chapter`,
  PUBLISH_CHAPTER: `${API_BASE_URL}/author/publish_chapter`,
  LIST_PUBLISHED_CHAPTERS: `${API_BASE_URL}/chapters/published/Chapters/list`,
  GET_CHAPTER_DETAIL: `${API_BASE_URL}/chapters/chapter/detail`,
  GET_NEXT_CHAPTER_NUM: `${API_BASE_URL}/author/next_chapter_num/`,
  LIST_ALL_CHAPTERS: `${API_BASE_URL}/author/oauth/list_by_book`,
  /** 书籍章节相关接口结束 */

  /** 书架相关接口开始 */
  BOOK_DETAIL: `${API_BASE_URL}/book/detail`,
  LIST_ALL_CHAPTER: `${API_BASE_URL}/chapters/published/Chapters/list`,
  BOOK_CHAPTER_DETAIL: `${API_BASE_URL}/book/chapter/detail`,
  FILE_UPLOAD: `${API_BASE_URL}/file/upload`,
  USER_INFO: `${API_BASE_URL}/oauth/user/info`,
  LIST_FAVORITE_BOOKS: `${API_BASE_URL}/oauth/favorite/list`,
  ADD_BOOKS_TO_FAVORITE: `${API_BASE_URL}/oauth/favorite/add`,
  DELETE_BOOKS_FROM_FAVORITE: `${API_BASE_URL}/oauth/favorite/cancel`,

  CHAPTER_DETAIL: `${API_BASE_URL}/chapters/chapter/detail`,
  /** 书架相关接口结束 */

  /** 成为作者接口开始 */
  BECOME_AUTHOR: `${API_BASE_URL}/oauth/user/become/author`,
  AUTHO_INFO: `${API_BASE_URL}/author/oauth/info/`,
  AUTHO_INFO_BY_ID: `${API_BASE_URL}/author/info`,
  UPDATE_AUTHOR_INFO: `${API_BASE_URL}/author/oauth/update_info`,
  /** 成为作者接口结束 */

  // 认证相关
  AUTH_GOOGLE: `${API_BASE_URL}/auth/1`,
  CALLBACK_GOOGLE: `${API_BASE_URL}/auth/callback`,
  AUTH_FACEBOOK: `${API_BASE_URL}/auth/2`,
  AUTH_BY_ACCOUNT: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,

  // 公共接口
  LIST_DICT: `${API_BASE_URL}/common/dictionary/list`,
}

// 清除认证信息
function clearAuthInfo() {
  if (process.client) {
    // 清除cookie
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  }
}

// 跳转到登录页
function redirectToLogin() {
  if (process.client) {
    const currentPath = window.location.pathname + window.location.search
    localStorage.setItem('redirectAfterLogin', currentPath)
    window.location.href = '/login'
  }
}

function getAccessToken() {
  if (process.client) {
    return localStorage.getItem('auth_token')
  }
  return null;
}

function getRefreshToken() {
  if (process.client) {
    return localStorage.getItem('auth_refreshToken')
  }
  return null;
}

// 通用的fetch请求函数（不需要认证和登录）
export async function apiRequest(endpoint, options = {}) {
  try {
    // 获取accessToken
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    // 设置默认选项
    const defaultOptions = {
      headers: {
      'Content-Type': 'application/json',
      ...options.headers
      }
    }
    
    // 如果存在accessToken，则添加到Authorization头部
    
    if (accessToken) {
       defaultOptions.headers.Authorization = `${accessToken}`
    }
    if (refreshToken) {
      defaultOptions.headers.RefreshToken = `${refreshToken}`
    }
    
    // 合并选项
    const mergedOptions = {
      ...defaultOptions,
      ...options
    }
    const response = await fetch(endpoint, mergedOptions);
    console.log("响应参数",response);
    if (response.code === 2008 || response.status === 401) {
      window.location.href = '/login'
    }
    if (!response.code === 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // TODO: 如果返回的参数请求头有accessToken，需要替换
    if (response.headers.get('X-New-Access-Token')) {
      console.log("返回的请求头参数有新的accessToken，", response.headers.get('X-New-Access-Token'));
      localStorage.setItem('auth_token', response.headers.get('accessToken'))
    }
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 文件上传专用请求函数（需要认证登录）
export async function apiFileAuthRequest(endpoint, options = {}) {
  try {
    // 获取accessToken
    const accessToken = getAccessToken()
    
    // 设置默认选项
    const defaultOptions = {
      ...options
    }
    
    // 如果存在accessToken，则添加到Authorization头部
    if (accessToken) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `${accessToken}`
      }
    }
    
    // 合并选项
    const mergedOptions = {
      ...defaultOptions,
      ...options
    }
    
    let response = await fetch(endpoint, mergedOptions)
    
    // 如果是401错误，尝试刷新token
    if (response.status === 401) {
      try {
        // 尝试刷新token
        await refreshAccessToken()
        
        // 刷新成功后重新发起请求
        const newAccessToken = getAccessToken()
        if (newAccessToken) {
          mergedOptions.headers = {
            ...mergedOptions.headers,
            Authorization: `${newAccessToken}`
          }
        }
        
        response = await fetch(endpoint, mergedOptions)
      } catch (refreshError) {
        // 刷新失败，清除认证信息并跳转到登录页
        clearAuthInfo()
        redirectToLogin()
        throw refreshError
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API file request failed:', error)
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

