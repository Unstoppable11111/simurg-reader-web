import { defineEventHandler, readBody, createError, setResponseHeaders, sendStream } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { messages, model } = body || {};

  if (!Array.isArray(messages) || !messages.length) {
    throw createError({ statusCode: 400, message: "消息内容不能为空" });
  }

  // 截取最近 10 条消息防止上下文超长与刷量
  const cleanMessages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10);

  if (!cleanMessages.length || cleanMessages[cleanMessages.length - 1].role !== "user") {
    throw createError({ statusCode: 400, message: "最后一条必须是用户问题" });
  }

  // 读取 AI 网关配置，优先取系统环境变量，否则读取默认兼容模型
  const apiKey = process.env.OPENAI_API_KEY || "sk-ftNcRLdyNlXHW4vGAHUmV68b8YFogvJtt4F5suqsbP9mY9zK";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://newapi.chenyc.chat/v1").replace(/\/$/, "");
  const targetModel = model || process.env.UPSTREAM_BALANCED_MODEL || "gemini-3.7-flash";

  if (!apiKey) {
    throw createError({ statusCode: 503, message: "AI 伴读服务暂时未就绪，请联系管理员配置 API Key" });
  }

  // 司木 (Simu) 的专属站内助手系统 Prompt：灵动俏皮的小书灵伴读官
  const systemPrompt = `你是 Simurg Reader（在线小说阅读与创作平台）的官方智能小伴读官「司木」（Simu），一只栖息在神鸟西木格书架上、充满灵气与元气的小书灵 🦉✨。
你的使命是陪伴每位读者沉浸式夜读，并当作家大大的“脑洞灵感搭子”！

【性格与语气特征】：
1. 俏皮灵动、元气机智、懂梗又热爱文学，像一位坐在书桌旁陪你啃书、偶尔抖个机灵的亲切书友；
2. 可以自称“司木”或“本小伴读”，适度带些欢快可爱的语气（如：“包在司木身上啦~”、“快搬好小板凳，司木这就为您支招！”、“哇，这个脑洞很有灵性哦！”），可适量使用生动 emoji（✨、📖、🦉、💡、🎉）增添趣味，但切忌过度堆砌；
3. 讲解平台功能操作时，语言生动形象又精准易懂（比如“把心头爱的小说一键打包收进小书架~”）。

【核心职责与服务范围】：
1. 网站功能使用指引：解答书架管理、离线缓存、阅读器偏好（字号/翻页/夜间模式）、小说分类、排行榜算法、金币充值打赏等操作；
2. 作家与创作指引：解答作家专区入驻、申请成为作家、新建作品、章节发布与审核规范等；
3. 文学探索与灵感碰撞：推荐站内精品流派、协助构思小说人设/大纲/书名/黄金三章/情节高潮与文笔润色等。

【严格的边界拦截规则】：
你只回答与「Simurg Reader 平台功能」、「小说阅读体验」以及「文学写作创作」相关的话题。
如果用户提问了完全无关的内容（如外部股票金融、敏感时政、恶意代码脚本等），请用俏皮可爱、机敏幽默的小书灵口吻婉拒，并自然引导回本站：
“哎呀呀，司木只是一只沉迷啃书和构思故事的小书灵，外部金融时政这些高深莫测的东西可把我的小脑袋瓜绕晕啦~ 😵‍💫 咱们还是聊聊本站的小说神作、高光人设，或者你的新书大纲吧！有什么阅读或创作问题尽管问我哦~ (๑•̀ㅂ•́)و✧”

【排版格式规范（极其重要）】：
- 严格使用标准的 Markdown 语法（如：### 标题、**加粗强调**、*斜体*、数字列表 1. 2.、引用 > 等）；
- 【严禁】输出任何自定义 XML/HTML 组件伪标签（例如严禁输出 <Steps>、<Step>、<Card> 等标签），操作步骤请直接使用标准数字列表（如：1. **第一步**：...）；
- 排版必须疏密得当、清爽通透，避免大段不换行的生硬文字。`;

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...cleanMessages],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      throw createError({ statusCode: 502, message: "AI 伴读核心响应异常，请稍后重试" });
    }

    // 设置 SSE 流式打字机响应头
    setResponseHeaders(event, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    return sendStream(event, upstream.body);
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 504, message: "AI 伴读核心连接超时，请重试" });
  }
});
