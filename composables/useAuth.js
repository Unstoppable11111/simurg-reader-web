import { useCookie } from '#app'

export const useAuth = () => {
  // 统一管理认证相关的cookies
  const userCookie = useCookie('user')
  const accessTokenCookie = useCookie('accessToken')
  const refreshTokenCookie = useCookie('refreshToken')
  const accessTokenExpireCookie = useCookie('accessTokenExpire')
  const refreshTokenExpireCookie = useCookie('refreshTokenExpire')
  
  // 判断是否已登录且token未过期
  const isLoggedIn = computed(() => {
    console.log(userCookie);
    // 检查必要cookie是否存在
    if (!accessTokenCookie.value || !userCookie.value) {
      console.log(111111111111111);
      return false
    }
    
    // 检查accessToken是否过期
    const token = accessTokenCookie.value.trim();
    console.log("token:",token)
    if (token === 'Bearer' || token.length < 10) {
      console.log(2222222222);
      return false;
    }
    console.log(accessTokenExpireCookie.value)
    if (accessTokenExpireCookie.value) {
      const expireTime = new Date(accessTokenExpireCookie.value).getTime()
      const currentTime = new Date().getTime()
      // 如果已过期，返回 false
      if (currentTime > expireTime) {
        console.log(33333333333333)
        return false
      }
    }
    
    return true
  })
  
  // 设置认证信息到cookies
  const setAuthCookies = (authData) => {
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7, // 7天过期
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    }
    
    // 设置用户信息
    userCookie.value = authData.user || {}
    
    // 设置访问令牌
    accessTokenCookie.value = authData.accessToken
    refreshTokenCookie.value = authData.refreshToken
    
    // 设置过期时间
    accessTokenExpireCookie.value = authData.accessTokenExpire
    refreshTokenExpireCookie.value = authData.refreshTokenExpire
  }
  
  // 清除认证信息
  const clearAuthCookies = () => {
    userCookie.value = null
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    accessTokenExpireCookie.value = null
    refreshTokenExpireCookie.value = null
  }
  
  // 用户信息相关计算属性
  const userAvatar = computed(() => {
    return userCookie.value?.avatar || 'http://www.tireba.com/simurg-reader/images/author1.png'
  })
  
  const userName = computed(() => {
    return userCookie.value?.username || userCookie.value?.name || '用户'
  })
  
  // 检查是否为作者
  const isAuthor = computed(() => {
    if (!isLoggedIn.value) return false
    return userCookie.value?.role === 'author' || userCookie.value?.isAuthor
  })
  
  return {
    // 状态
    isLoggedIn,
    isAuthor,
    userAvatar,
    userName,
    
    // 数据
    userCookie,
    accessTokenCookie,
    refreshTokenCookie,
    accessTokenExpireCookie,
    refreshTokenExpireCookie,
    
    // 方法
    setAuthCookies,
    clearAuthCookies
  }
}