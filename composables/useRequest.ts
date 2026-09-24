/**
 * 统一网络请求 Composables (基于 Nuxt 官方 $fetch / ofetch 拦截器体系)
 * 具备功能：
 * 1. 同构支持 (SSR 服务端与客户端平滑运行)
 * 2. 自动注入 Authorization 与 RefreshToken
 * 3. 自动同步响应头中的 X-New-Access-Token
 * 4. 统一 401 / 2008 Token 失效拦截
 * 5. 与 useAsyncData 完美契合，消除 SSR 客户端二次重复请求
 */

import { getApiBaseUrl } from '@/utils/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
  requireAuth?: boolean
}

export const useRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const config = useRuntimeConfig()
  const base = config.public?.apiBase || getApiBaseUrl()

  // 处理完整 URL 或相对路径
  const requestUrl = endpoint.startsWith('http') ? endpoint : `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  // 客户端注入 Token
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    const refreshToken = localStorage.getItem('auth_refreshToken')
    if (token) {
      headers.Authorization = token
    }
    if (refreshToken) {
      headers.RefreshToken = refreshToken
    }
  }

  try {
    return await $fetch<T>(requestUrl, {
      method: options.method || 'GET',
      headers,
      params: options.params,
      body: options.body,
      onResponse({ response }) {
        // 自动更新 Token
        if (process.client && response.headers?.get('X-New-Access-Token')) {
          const newToken = response.headers.get('X-New-Access-Token')
          if (newToken) {
            localStorage.setItem('auth_token', newToken)
          }
        }
      },
      onResponseError({ response }) {
        // 统一鉴权失败拦截
        if (process.client && (response.status === 401 || (response._data as any)?.code === 2008)) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          window.location.href = '/login'
        }
      }
    })
  } catch (error: any) {
    // 业务错误友好日志，不抛出致命 unhandled 异常给页面
    console.error(`[API Error] [${options.method || 'GET'}] ${requestUrl}:`, error.message || error)
    throw error
  }
}
