/**
 * 安全轻量的 Markdown 与富文本转换器（零第三方依赖，防 XSS，适配移动端与暗夜主题）
 * 支持：代码块（含语言与复制）、行内代码、段落、列表（有序与无序）、标题、加粗、斜体、删除线、引用、链接、以及 <Steps>/<Step> 步进流程卡片
 */
export function renderMarkdown(rawText: string): string {
  if (!rawText) return "";

  // 1. 提取并保护多行代码块 ```lang ... ```
  const codeBlocks: string[] = [];
  let text = rawText.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    const cleanLang = (lang || "code").toLowerCase();
    const encoded = encodeURIComponent(code.trim());
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    codeBlocks.push(
      `<div class="simu-code-card">
        <div class="code-card-header">
          <span class="code-lang-tag">${cleanLang}</span>
          <button type="button" class="simu-code-copy-btn" data-code="${encoded}">复制</button>
        </div>
        <pre class="code-pre"><code>${escapedCode.trim()}</code></pre>
      </div>`
    );
    return `@@CODEBLOCK${idx}@@`;
  });

  // 2. 提取并保护行内代码 `code`
  const inlineCodes: string[] = [];
  text = text.replace(/`([^`\n]+)`/g, (_, inline) => {
    const idx = inlineCodes.length;
    const escapedInline = inline
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    inlineCodes.push(`<code class="simu-inline-code">${escapedInline}</code>`);
    return `@@INLINECODE${idx}@@`;
  });

  // 3. 先清理残留的 <Steps> 和 </Steps> 包装容器标签
  text = text.replace(/<\/?Steps>/gi, "");

  // 4. 兼容并提取自定义伪标签 <Step ...>...</Step>
  const stepCards: string[] = [];
  text = text.replace(
    /<Step\b(?:\s+subtitle="([^"]*)")?(?:\s+title="([^"]*)")?[^>]*>([\s\S]*?)<\/Step>/gi,
    (_, subtitle, title, innerContent) => {
      const idx = stepCards.length + 1;
      const sub = subtitle ? subtitle.trim() : `第 ${idx} 步`;
      const tit = title ? title.trim() : "";
      // 对 innerContent 进行基础清理
      const parsedInner = innerContent.trim()
        .replace(/\*([^\*\n]+)\*/g, '<em class="simu-em">$1</em>')
        .replace(/\*\*([^\*\n]+)\*\*/g, '<strong>$1</strong>');

      stepCards.push(
        `<div class="simu-step-card">
          <div class="step-card-header">
            <span class="step-num-badge">${idx}</span>
            <div class="step-card-titles">
              <span class="step-subtitle">${sub}</span>
              ${tit ? `<h5 class="step-title">${tit}</h5>` : ""}
            </div>
          </div>
          <div class="step-card-body">${parsedInner}</div>
        </div>`
      );
      return `\n\n@@STEPCARD${stepCards.length - 1}@@\n\n`;
    }
  );

  // 5. 清理其他孤立或未解析的 XML 伪标签（例如 <Card>, </Card> 等），避免在页面裸露
  text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9_-]*(?:\s+[^>]*)?>/g, "");

  // 5. 基础 HTML 实体转义（安全防御，防 XSS）
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // 6. 标题解析
  text = text.replace(/^#### (.*$)/gim, '<h4 class="simu-h4">$1</h4>');
  text = text.replace(/^### (.*$)/gim, '<h3 class="simu-h3">$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2 class="simu-h2">$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h1 class="simu-h1">$1</h1>');

  // 7. 分隔线 --- 或 ***
  text = text.replace(/^(\-{3,}|\*{3,})$/gim, '<hr class="simu-divider" />');

  // 8. 引用块 > quote
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="simu-quote">$1</blockquote>');

  // 9. 粗体与斜体
  // 粗斜体 ***text*** 或 ___text___
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // 粗体 **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
  // 斜体 *text* 或 _text_（支持汉字、标点与英文，如 *验证方式：...*）
  text = text.replace(/\*([^\*\n]+)\*/g, '<em class="simu-em">$1</em>');
  text = text.replace(/_([^_\n]+)_/g, '<em class="simu-em">$1</em>');
  // 删除线 ~~text~~
  text = text.replace(/~~(.*?)~~/g, '<del class="simu-del">$1</del>');

  // 10. 安全链接 [text](url)
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s\)\"]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="simu-link">$1</a>'
  );

  // 11. 列表解析：有序列表 (1. item) 与无序列表 (- item 或 * item)
  const lines = text.split("\n");
  const processedLines: string[] = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[\*\-]\s+(.*)$/);
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (ulMatch) {
      if (inOl) {
        processedLines.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        processedLines.push('<ul class="simu-ul">');
        inUl = true;
      }
      processedLines.push(`<li class="simu-li">${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (inUl) {
        processedLines.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        processedLines.push('<ol class="simu-ol">');
        inOl = true;
      }
      processedLines.push(`<li class="simu-li">${olMatch[2]}</li>`);
    } else {
      if (inUl) {
        processedLines.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        processedLines.push("</ol>");
        inOl = false;
      }
      processedLines.push(line);
    }
  }
  if (inUl) processedLines.push("</ul>");
  if (inOl) processedLines.push("</ol>");

  text = processedLines.join("\n");

  // 12. 段落与换行整理
  text = text.replace(/\n{2,}/g, '<div class="simu-p-break"></div>');
  text = text.replace(/(<\/h[1-4]>|<\/div>|<\/ul>|<\/ol>|<\/blockquote>|<hr[^>]*>)\n/g, "$1");
  text = text.replace(/\n(<h[1-4]|<div|<ul|<ol|<blockquote|<hr)/g, "$1");
  text = text.replace(/\n/g, "<br/>");

  // 13. 最后精准还原 step cards、inline code、code blocks
  text = text.replace(/@@STEPCARD(\d+)@@/g, (_, idx) => {
    return stepCards[parseInt(idx, 10)] || "";
  });
  text = text.replace(/@@INLINECODE(\d+)@@/g, (_, idx) => {
    return inlineCodes[parseInt(idx, 10)] || "";
  });
  text = text.replace(/@@CODEBLOCK(\d+)@@/g, (_, idx) => {
    return codeBlocks[parseInt(idx, 10)] || "";
  });

  return text;
}
