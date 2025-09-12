// server/api/google/callback.post.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code } = body

  if (!code) {
    return { success: false, message: '缺少授权码' }
  }

  try {
    // 1. 配置 Google 客户端信息
    const clientId = '1090225270146-i3gn7876tjfqmgantqjn3jikh0l6rf1d.apps.googleusercontent.com'
    const clientSecret = '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'
    const redirectUri = 'http://localhost:3000/login/callback' // 与前端一致

    // 2. 用授权码换取访问令牌（调用 Google Token 端点）
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const { access_token, id_token } = await tokenResponse.json()
    if (!access_token || !id_token) {
      throw new Error('获取令牌失败')
    }

    // 3. 用访问令牌获取用户信息
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const userInfo = await userInfoResponse.json()

    // 4. 后端处理：验证用户、生成自定义 Token 等（根据业务需求）
    // 示例：返回用户信息和自定义 Token
    return {
      success: true,
      user: {
        id: userInfo.sub, // Google 用户唯一 ID
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture
      },
      token: '后端生成的 JWT 或 Session Token' // 用于后续身份验证
    }
  } catch (error) {
    console.error('Google 登录后端处理失败：', error)
    return { success: false, message: '服务器处理失败' }
  }
})