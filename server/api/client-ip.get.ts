export default defineEventHandler(async (event) => {
  try {
    // 服务器端请求，没有跨域问题
    const response = await fetch('https://api.ipify.org?format=text', {
      signal: AbortSignal.timeout(3000) // 超时 3 秒，防止阻塞
    });
    const ip = await response.text();
    return { ip: ip.trim() || '127.0.0.1' };
  } catch (e) {
    return { ip: '127.0.0.1' };
  }
});