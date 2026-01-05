// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ENDPOINTS } from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loginMethod: null as 'google' | 'facebook' | 'account' | null,
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    redirectPath: '/',
    isAuthor: false,
  }),
  getters: {
    userName: (state) => state.user?.username || '未登录'
  },
  actions: {
    // 账号密码登录
    async loginByAccount(account: string, password: string) {
      try {
        console.log("账号登录请求参数：", account, password)
        const response = await $fetch(API_ENDPOINTS.AUTH_BY_ACCOUNT, {
          method: 'POST',
          body: { account, password }
        })
        console.log("账号登录成功:", response);
        if (response.code === 200) {
          this.handleLoginSuccess(response.data.thirdPartyUserInfo, response.data.tokenInfo.accessToken, response.data.tokenInfo.refreshToken, 'account')
          // 登录成功后获取用户信息
          const userInfoResult = await apiRequest(API_ENDPOINTS.USER_INFO);
          console.log("获取登录成功的用户信息：", userInfoResult);
          this.isAuthor = userInfoResult.data.roles.includes('2');
          localStorage.setItem('isAuthor', this.isAuthor.toString());
        }
        return response
      } catch (error) {
        
      }
    },

    // Google登录
    async loginByGoogle(code: string, state: string) {
      try {
        const url = `${API_ENDPOINTS.CALLBACK_GOOGLE}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
        const response = await $fetch(url, {
          method: 'GET',
          // body: { code, state }
        })
        
        if (response.code === 200) {
          this.handleLoginSuccess(
            response.data.thirdPartyUserInfo, 
            response.data.tokenInfo.accessToken, 
            response.data.tokenInfo.refreshToken,
            'google'
          )
          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Google登录失败:', error)
        throw error
      }
    },

    // Facebook登录（类似Google登录）
    async loginByFacebook(accessToken: string) {
      try {
        const response = await $fetch(API_ENDPOINTS.AUTH_FACEBOOK, {
          method: 'POST',
          body: { accessToken }
        })
        
        if (response.code === 200) {
          this.handleLoginSuccess(
            response.data.user, 
            response.data.accessToken, 
            response.data.refreshToken,
            'facebook'
          )
          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Facebook登录失败:', error)
        throw error
      }
    },
    async logout () {
      try {
        const authorization = localStorage.getItem('auth_token')
        const logoutReq = {
          Authorization: authorization
        }
        const response = await apiRequest(API_ENDPOINTS.LOGOUT, {
          method: 'POST'
        })
        console.log("登出成功:", response);
        if (response.code === 200) {
          this.handleLogoutSuccess(null, '', '')
          return response
        } else {
          throw new Error(response.message || '登出失败')
        }
      } catch (error) {
      }
    },

    // 登录成功统一处理
    handleLoginSuccess(user: User, accessToken: string, refreshToken: string, method: 'google' | 'facebook' | 'account') {
      this.user = user
      this.accessToken = accessToken
      this.loginMethod = method
      this.isLoggedIn = true
      this.refreshToken = refreshToken;
      
      // 持久化存储到 localStorage
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('auth_token', accessToken)
      localStorage.setItem('auth_method', method)
      localStorage.setItem('auth_refreshToken', refreshToken)
    },
    updateAccessToken(newToken: string) {
      this.accessToken = newToken;
      localStorage.setItem('auth_token', newToken)
    },

    // 登出
    handleLogoutSuccess(user: User | null, accessToken: string, refreshToken: string) {
      this.user = null
      this.accessToken = ''
      this.loginMethod = null
      this.isLoggedIn = false
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refreshToken');
      localStorage.removeItem('auth_method')
    },

    // 初始化：从本地存储恢复状态
    initFromLocalStorage() {
      try {
        const userStr = localStorage.getItem('auth_user')
        const token = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('auth_refreshToken');
        const method = localStorage.getItem('auth_method') as 'google' | 'facebook' | 'account' | null
        const isAuthor = localStorage.getItem('isAuthor') === 'true';
        
        // 兼容处理：确保所有必需的数据都存在且有效
        if (userStr && token && method) {
          // 兼容处理：安全地解析用户数据
          try {
            const parsedUser = JSON.parse(userStr)
            if (parsedUser && typeof parsedUser === 'object') {
              this.user = parsedUser
              this.accessToken = token
              this.refreshToken = refreshToken;
              this.loginMethod = method
              this.isLoggedIn = true
              this.isAuthor = isAuthor;
            }
          } catch (parseError) {
            console.warn('解析用户数据失败:', parseError)
            // 清理无效数据
            this.clearLocalStorage()
          }
        }
      } catch (error) {
        console.error('从localStorage初始化认证状态失败:', error)
        this.clearLocalStorage()
      }
    },

    // 添加清理localStorage的方法
    clearLocalStorage() {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refreshToken');
      localStorage.removeItem('auth_method')
    }
  }
})



interface User {
  id: string
  username: string
  avatar: string
}