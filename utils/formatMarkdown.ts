/**
 * 安全轻量的 Markdown 转换器（零第三方依赖，防 XSS）
 * 支持代码块、行内代码、段落、列表、加粗、斜体与引用
 */
export function renderMarkdown(rawText: string): string {
  if (!rawText) return "";

  // 1. 基础 HTML 实体转义，防止 XSS 注入
  let escaped = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // 2. 提取并保护代码块 ```code```
  const codeBlocks: string[] = [];
  escaped = escaped.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(
      `<pre class="simu-code-block"><div class="code-lang">${lang || "code"}</div><code>${code.trim()}</code></pre>`
    );
    return `__CODE_BLOCK_${index}__`;
  });

  // 3. 行内代码 `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="simu-inline-code">$1</code>');

  // 4. 标题 # H1 ~ H4
  escaped = escaped.replace(/^### (.*$)/gim, '<h3 class="simu-h3">$1</h3>');
  escaped = escaped.replace(/^## (.*$)/gim, '<h2 class="simu-h2">$1</h2>');
  escaped = escaped.replace(/^# (.*$)/gim, '<h1 class="simu-h1">$1</h1>');

  // 5. 粗体 **bold**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 6. 引用块 > quote
  escaped = escaped.replace(/^\> (.*$)/gim, '<blockquote class="simu-quote">$1</blockquote>');

  // 7. 无序列表 * item 或 - item
  escaped = escaped.replace(/^[\*\-] (.*$)/gim, '<li class="simu-li">$1</li>');

  // 8. 还原代码块
  escaped = escaped.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
    return codeBlocks[parseInt(idx, 10)] || "";
  });

  // 9. 换行转换为 <br/>（普通段落换行）
  escaped = escaped.replace(/\n\n/g, '<div class="simu-paragraph-gap"></div>');
  escaped = escaped.replace(/\n/g, "<br/>");

  return escaped;
}
