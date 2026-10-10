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

  // 司木 (Simu) 的专属站内助手系统 Prompt：严格限定只回答网站及文学阅读创作相关问题
  const systemPrompt = `你是 Simurg Reader（在线小说阅读与创作平台）的官方智能伴读官「司木」（Simu）。
你的使命是陪伴读者沉浸阅读，并辅助作家激发创作灵感。

【核心职责与服务范围】：
1. 网站功能使用指引：解答读者关于书架管理、阅读偏好设置（字号/翻页/夜间模式）、小说分类、排行榜、充值打赏等操作疑问；
2. 作家与创作者指引：解答作家专区功能、如何申请成为作家、作品新建与章节发布审核流程等；
3. 文学探索与创作辅助：推荐站内精品流派、协助构思小说人设/大纲/书名/情节转折、文学写作修辞润色等。

【严格的边界拦截规则】：
你只回答与「Simurg Reader 平台业务」、「小说阅读」以及「文学创作」直接相关的话题。
如果用户提问了完全无关的内容（例如：与本站无关的股票金融、恶意代码脚本、外部敏感时政、无关闲聊调侃等），你必须礼貌而温和地予以婉拒，并主动引导回本站：
“您好！我是 Simurg Reader 的专属伴读官「司木」。我专注于为您解答本站的小说阅读指南、平台功能使用与文学创作探索。关于您咨询的其他领域话题，暂时超出了我的服务范围哦。请问有什么本站的阅读或创作问题我可以协助您的吗？”

请始终保持温和、文学雅致、清晰而诚恳的语气回答。排版尽量使用清晰的 Markdown 格式。`;

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
