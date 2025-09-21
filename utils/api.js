import { useCookie } from "#app"
const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://localhost:8082/simurg_reader_web/api'
export const API_ENDPOINTS = {
  /** 首页相关接口开始 */
  BANNERS: `${API_BASE_URL}/banner/role`,
  TAG_BOOKS: `${API_BASE_URL}/book/list_by_tag`,
  RECOMMEND_BOOKS: `${API_BASE_URL}/recommend/books`,
  RANKING_BOOKS: `${API_BASE_URL}/ranking/books`,
  RECENT_UPDATE_BOOKS: `${API_BASE_URL}/book/recent-update`,
  CATEGORIES: `${API_BASE_URL}/book/categories/list/all`,

  /** 首页相关接口结束*/

  /** 书架相关接口开始 */
  BOOK_DETAIL: `${API_BASE_URL}/book/detail`,
  BOOK_CHAPTER_DETAIL: `${API_BASE_URL}/book/chapter/detail`,
  FILE_UPLOAD: `${API_BASE_URL}/file/upload`,
  USER_INFO: `${API_BASE_URL}/oauth/user/info`,
  LIST_FAVORITE_BOOKS: `${API_BASE_URL}/oauth/favorite/list`,
  
  /** 书架相关接口结束 */

  /** 成为作者接口开始 */
  BECOME_AUTHOR: `${API_BASE_URL}/oauth/user/become/author`,
  /** 成为作者接口结束 */



  // 认证相关
  AUTH_GOOGLE: `${API_BASE_URL}/auth/1`,
}

// 获取存储在cookie中的accessToken
function getAccessToken() {
  console.log("accessToken", document.cookie)
  if (process.client) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null;
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
    window.location.href = '/login'
  }
}

// 刷新token
async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(API_ENDPOINTS.AUTH_REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // 更新cookie中的token
    if (process.client) {
      const expires = new Date()
      expires.setDate(expires.getDate() + 7) // 7天过期
      
      document.cookie = `accessToken=${data.data.accessToken}; expires=${expires.toUTCString()}; path=/`
      document.cookie = `refreshToken=${data.data.refreshToken}; expires=${expires.toUTCString()}; path=/`
    }

    return data.data
  } catch (error) {
    console.error('Token refresh failed:', error)
    // 刷新失败，清除认证信息并跳转到登录页
    clearAuthInfo()
    redirectToLogin()
    throw error
  }
}

// 获取存储在cookie中的refreshToken
function getRefreshToken() {
  if (process.client) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null
}

// 需要认证的请求
export async function apiAuthRequest(endpoint, options = {}) {
  // 获取accessToken
  const accessToken = getAccessToken()
  
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
  
  // 合并选项
  const mergedOptions = {
    ...defaultOptions,
    ...options
  }
  
  try {
    // 发起请求
    let response = await fetch(endpoint, mergedOptions)
    
    // 如果是401错误，尝试刷新token
    if (response.status === 401) {
      try {
        // 尝试刷新token
        await refreshAccessToken()
        
        // 刷新成功后重新发起请求
        const newAccessToken = getAccessToken()
        if (newAccessToken) {
          mergedOptions.headers.Authorization = `${newAccessToken}`
        }
        
        response = await fetch(endpoint, mergedOptions)
      } catch (refreshError) {
        // 刷新失败，清除认证信息并跳转到登录页
        clearAuthInfo()
        redirectToLogin()
        throw refreshError
      }
    }
    
    if (!response.code === 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 通用的fetch请求函数（不需要认证和登录）
export async function apiRequest(endpoint, options = {}) {
  try {
    // 获取存储在cookie中的accessToken
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.code === 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
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

