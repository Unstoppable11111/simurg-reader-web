import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning_content?: string;
  error?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

const STORAGE_THREADS_KEY = "simu_reader_chat_threads";
const STORAGE_GUEST_COUNT_KEY = "simu_guest_chat_count";
export const GUEST_MAX_QUOTA = 5;

export const useChatStore = defineStore("simuChat", () => {
  const authStore = useAuthStore();

  const threads = ref<Thread[]>([]);
  const currentId = ref<string>("");
  const loading = ref(false);
  const guestCount = ref(0);
  const isWidgetOpen = ref(false);
  const initialized = ref(false);

  // 是否已登录
  const isLoggedIn = computed(() => !!authStore.isLoggedIn);

  // 未登录用户的剩余提问额度
  const remainingGuestQuota = computed(() => {
    if (isLoggedIn.value) return Infinity;
    return Math.max(0, GUEST_MAX_QUOTA - guestCount.value);
  });

  // 是否具备提问资格
  const canSend = computed(() => {
    if (isLoggedIn.value) return true;
    return remainingGuestQuota.value > 0;
  });

  // 当前激活的会话消息列表
  const currentMessages = computed(() => {
    const thread = threads.value.find((t) => t.id === currentId.value);
    return thread ? thread.messages : [];
  });

  // 初始化历史记录与额度（客户端）
  function init() {
    if (typeof window === "undefined" || initialized.value) return;

    // 1. 读取未登录提问额度
    try {
      const storedCount = localStorage.getItem(STORAGE_GUEST_COUNT_KEY);
      guestCount.value = storedCount ? parseInt(storedCount, 10) || 0 : 0;
    } catch {
      guestCount.value = 0;
    }

    // 2. 读取本地历史会话
    try {
      const rawThreads = localStorage.getItem(STORAGE_THREADS_KEY);
      if (rawThreads) {
        const parsed = JSON.parse(rawThreads);
        if (Array.isArray(parsed) && parsed.length) {
          threads.value = parsed;
          currentId.value = parsed[0].id;
          initialized.value = true;
          return;
        }
      }
    } catch {}

    // 默认创建新会话
    createNewThread();
    initialized.value = true;
  }

  // 持久化存储到本地 localStorage
  function persist() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_THREADS_KEY, JSON.stringify(threads.value.slice(0, 10)));
      localStorage.setItem(STORAGE_GUEST_COUNT_KEY, guestCount.value.toString());

      // 【预留云端同步扩展点】：如果用户已登录，可在后续无缝开启接口同步
      // if (isLoggedIn.value) syncToServer();
    } catch (e) {
      console.warn("对话记忆保存失败", e);
    }
  }

  // 预留的云端数据库同步函数（后续开箱即用）
  async function syncToServer() {
    // 待后续数据库就绪后直接接入：
    // await $fetch('/api/chat/sync', { method: 'POST', body: { threads: threads.value } })
  }

  // 新建会话
  function createNewThread() {
    const id = "th_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    threads.value.unshift({
      id,
      title: "新对话",
      messages: [],
    });
    if (threads.value.length > 10) threads.value.pop();
    currentId.value = id;
    persist();
  }

  // 切换会话
  function selectThread(id: string) {
    if (loading.value) return;
    currentId.value = id;
  }

  // 删除单条会话
  function deleteThread(id: string) {
    if (loading.value) return;
    threads.value = threads.value.filter((t) => t.id !== id);
    if (!threads.value.length) {
      createNewThread();
    } else if (currentId.value === id) {
      currentId.value = threads.value[0].id;
    }
    persist();
  }

  // 清空所有记录
  function clearAll() {
    if (loading.value) return;
    threads.value = [];
    createNewThread();
  }

  let abortController: AbortController | null = null;

  // 停止生成
  function stopGeneration() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      loading.value = false;
    }
  }

  // 发送消息
  async function sendMessage(userText: string) {
    const text = userText.trim();
    if (!text || loading.value) return;

    // 检查未登录额度
    if (!canSend.value) {
      return false;
    }

    const thread = threads.value.find((t) => t.id === currentId.value);
    if (!thread) return;

    // 第一次提问时，以问题前 20 字为会话标题
    if (thread.messages.length === 0) {
      thread.title = text.slice(0, 20);
    }

    // 用户消息推入
    thread.messages.push({ role: "user", content: text });

    // 助手等待占位气泡
    const assistantIndex = thread.messages.push({ role: "assistant", content: "" }) - 1;

    // 若为未登录用户，累计消耗 1 次额度并持久化
    if (!isLoggedIn.value) {
      guestCount.value += 1;
      persist();
    }

    loading.value = true;
    abortController = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: thread.messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("服务响应异常，请稍后重试");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta;
            if (delta?.content) {
              thread.messages[assistantIndex].content += delta.content;
            }
            if (delta?.reasoning_content) {
              thread.messages[assistantIndex].reasoning_content =
                (thread.messages[assistantIndex].reasoning_content || "") + delta.reasoning_content;
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        thread.messages[assistantIndex].error = true;
        thread.messages[assistantIndex].content =
          (thread.messages[assistantIndex].content ? thread.messages[assistantIndex].content + "\n\n" : "") +
          "【司木提示】：连接暂时中断，请重试或检查网络状态。";
      } else {
        if (!thread.messages[assistantIndex].content) {
          thread.messages[assistantIndex].content = "已停止生成。";
        }
      }
    } finally {
      loading.value = false;
      abortController = null;
      persist();
    }

    return true;
  }

  return {
    threads,
    currentId,
    currentMessages,
    loading,
    isLoggedIn,
    guestCount,
    remainingGuestQuota,
    canSend,
    isWidgetOpen,
    init,
    createNewThread,
    selectThread,
    deleteThread,
    clearAll,
    sendMessage,
    stopGeneration,
  };
});
