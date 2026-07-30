<script setup lang="ts">
import type { AgentAction, IAgentMessage, IAgentReference, IAgentToolResult } from 'types'
import type { IArticle } from 'types'
import { MdPreview } from 'md-editor-v3'


import 'md-editor-v3/lib/preview.css'
import aiAssistantIcon from '~/assets/icons/ai.svg'
import { useAgentStream } from './useAgentStream'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  references?: IAgentReference[]
  toolEvents?: AgentToolUiEvent[]
  loading?: boolean
}

interface AgentToolUiEvent extends IAgentToolResult {
  status: 'running' | 'done'
}

const props = withDefaults(defineProps<{
  article?: IArticle
  /** 是否作为桌面端右侧抽屉常驻展示 */
  embedded?: boolean
}>(), {
  embedded: false,
})

const isAgentDark = useDark({
  selector: 'html',
  attribute: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const { visitorId } = useVisitor()
const { stream, abort } = useAgentStream()

const open = ref(false)
const input = ref('')
const loading = ref(false)
const restoring = ref(false)
const conversationId = ref<string>()
const messages = ref<ChatMessage[]>([])
const bodyRef = ref<HTMLElement>()
let restoreRequestId = 0
const clearedConversationKeyPrefix = 'article-agent-cleared-conversation'

const quickActions: Array<{
  label: string
  action: AgentAction
  prompt: string
}> = [
  {
    label: '总结文章',
    action: 'summarize',
    prompt: '请总结当前文章的核心观点，并列出 3 个要点。',
  },
  {
    label: '相关阅读',
    action: 'related',
    prompt: '请根据当前文章，从站内内容里推荐可以继续阅读的方向。',
  },
  {
    label: '解释概念',
    action: 'explain-code',
    prompt: '请解释当前文章里涉及的代码或技术思路，如果没有代码，就解释主要实现思路。',
  },
]

const lastAssistantMessage = computed(() =>
  [...messages.value].reverse().find(message => message.role === 'assistant'),
)

const previewTheme = computed(() => (isAgentDark.value ? 'dark' : 'light'))

function mdHeadingId(_text: string, level: number, index: number) {
  return `agent-h-${level}-${index}`
}

function formatReferenceScore(score?: number) {
  if (typeof score !== 'number')
    return ''

  return `${Math.max(0, Math.min(100, Math.round(score * 100)))}%`
}

function sanitizeAgentMarkdown(html: string) {
  if (typeof document === 'undefined') {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+="[^"]*"/gi, '')
      .replace(/\son\w+='[^']*'/gi, '')
      .replace(/\s(?:href|src)=["']javascript:[^"']*["']/gi, '')
  }

  const doc = document.implementation.createHTMLDocument('')
  doc.body.innerHTML = html
  doc.body.querySelectorAll('script, style, iframe, object, embed, link, meta')
    .forEach(node => node.remove())
  doc.body.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()

      if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:')))
        node.removeAttribute(attr.name)
    })
  })

  return doc.body.innerHTML
}

function createMessageId(message: Pick<ChatMessage, 'role'>, fallback = Date.now()) {
  return `${fallback}-${message.role}-${Math.random().toString(36).slice(2, 8)}`
}

function scrollToBottom() {
  nextTick(() => {
    const el = bodyRef.value
    if (el)
      el.scrollTop = el.scrollHeight
  })
}

function patchMessage(messageId: string, patch: Partial<ChatMessage>) {
  const index = messages.value.findIndex(message => message.id === messageId)

  if (index === -1)
    return

  messages.value[index] = {
    ...messages.value[index],
    ...patch,
  }
}

function appendMessageContent(messageId: string, content: string) {
  const index = messages.value.findIndex(message => message.id === messageId)

  if (index === -1)
    return

  messages.value[index] = {
    ...messages.value[index],
    content: `${messages.value[index].content}${content}`,
  }
}

function upsertToolEvent(messageId: string, event: AgentToolUiEvent) {
  const index = messages.value.findIndex(message => message.id === messageId)

  if (index === -1)
    return

  const toolEvents = [...(messages.value[index].toolEvents || [])]
  const existedIndex = toolEvents.findIndex(item => item.toolCallId === event.toolCallId)

  if (existedIndex === -1)
    toolEvents.push(event)
  else
    toolEvents[existedIndex] = {
      ...toolEvents[existedIndex],
      ...event,
    }

  messages.value[index] = {
    ...messages.value[index],
    toolEvents,
  }
}

function getConversationStorageKey(articleId = props.article?.id, currentVisitorId = visitorId.value) {
  if (!articleId || !currentVisitorId)
    return ''

  return `${clearedConversationKeyPrefix}:${currentVisitorId}:article:${articleId}`
}

function getClearedConversationId(articleId = props.article?.id, currentVisitorId = visitorId.value) {
  const key = getConversationStorageKey(articleId, currentVisitorId)

  if (!key || typeof localStorage === 'undefined')
    return ''

  return localStorage.getItem(key) || ''
}

function setClearedConversationId(conversationIdToClear: string, articleId = props.article?.id, currentVisitorId = visitorId.value) {
  const key = getConversationStorageKey(articleId, currentVisitorId)

  if (!key || !conversationIdToClear || typeof localStorage === 'undefined')
    return

  localStorage.setItem(key, conversationIdToClear)
}

function removeClearedConversationId(articleId = props.article?.id, currentVisitorId = visitorId.value) {
  const key = getConversationStorageKey(articleId, currentVisitorId)

  if (!key || typeof localStorage === 'undefined')
    return

  localStorage.removeItem(key)
}

async function getCurrentArticleConversationId(articleId = props.article?.id, currentVisitorId = visitorId.value) {
  if (conversationId.value)
    return conversationId.value

  if (!articleId || !currentVisitorId)
    return ''

  const conversations = await getAgentConversationsApi({
    visitorId: currentVisitorId,
    sourceType: 'article',
    sourceId: articleId,
  })

  return conversations?.[0]?.id || ''
}

function normalizeHistoryMessage(message: IAgentMessage): ChatMessage | undefined {
  if (message.role !== 'user' && message.role !== 'assistant')
    return

  return {
    id: message.id || createMessageId({ role: message.role }, new Date(message.createdAt).getTime()),
    role: message.role,
    content: message.content,
    references: message.metadata?.references as IAgentReference[] | undefined,
    toolEvents: (message.metadata?.toolEvents as IAgentToolResult[] | undefined)?.map(item => ({
      ...item,
      status: 'done',
    })),
  }
}

async function restoreConversation() {
  const articleId = props.article?.id
  const currentVisitorId = visitorId.value
  const requestId = ++restoreRequestId

  if (!articleId || !currentVisitorId || loading.value)
    return

  restoring.value = true

  try {
    const conversations = await getAgentConversationsApi({
      visitorId: currentVisitorId,
      sourceType: 'article',
      sourceId: articleId,
    })

    if (requestId !== restoreRequestId)
      return

    const clearedConversationId = getClearedConversationId(articleId, currentVisitorId)
    const conversation = clearedConversationId ? undefined : conversations?.[0]

    if (!conversation) {
      conversationId.value = undefined
      messages.value = []
      return
    }

    const history = await getAgentMessagesApi(conversation.id, currentVisitorId)

    if (requestId !== restoreRequestId)
      return

    conversationId.value = conversation.id
    messages.value = (history || [])
      .map(normalizeHistoryMessage)
      .filter(Boolean) as ChatMessage[]
    scrollToBottom()
  }
  catch (error) {
    console.error(error)
  }
  finally {
    if (requestId === restoreRequestId)
      restoring.value = false
  }
}

/**
 * 打开或关闭问答框。
 * 这个入口挂在文章正文区域右下角，因此它只服务当前文章阅读场景。
 */
function toggleOpen() {
  open.value = !open.value
}

/**
 * 发送快捷动作或用户输入。
 * 每次请求都会创建一条用户消息和一条 assistant 占位消息，流式返回时逐步拼接内容。
 */
async function send(message?: string, action: AgentAction = 'chat') {
  const content = (message ?? input.value).trim()
  if (!content || loading.value || !props.article?.id || !visitorId.value)
    return

  open.value = true
  input.value = ''
  loading.value = true

  const userMessage: ChatMessage = {
    id: `${Date.now()}-user`,
    role: 'user',
    content,
  }

  const assistantMessage: ChatMessage = {
    id: `${Date.now()}-assistant`,
    role: 'assistant',
    content: '',
    loading: true,
    references: [],
    toolEvents: [],
  }

  messages.value.push(userMessage, assistantMessage)

  try {
    await stream({
      conversationId: conversationId.value,
      visitorId: visitorId.value,
      message: content,
      sourceType: 'article',
      sourceId: props.article.id,
      action,
    }, (event) => {
      if (event.type === 'conversation') {
        conversationId.value = event.conversationId
        removeClearedConversationId(props.article?.id, visitorId.value)
        scrollToBottom()
        return
      }

      if (event.type === 'delta') {
        appendMessageContent(assistantMessage.id, event.content)
        scrollToBottom()
        return
      }

      if (event.type === 'tool_start') {
        upsertToolEvent(assistantMessage.id, {
          toolCallId: event.toolCallId,
          toolName: event.toolName,
          displayText: event.displayText,
          resultCount: 0,
          status: 'running',
        })
        scrollToBottom()
        return
      }

      if (event.type === 'tool_result') {
        upsertToolEvent(assistantMessage.id, {
          ...event.result,
          status: 'done',
        })
        scrollToBottom()
        return
      }

      if (event.type === 'references') {
        patchMessage(assistantMessage.id, {
          references: event.references,
        })
        return
      }

      if (event.type === 'error') {
        patchMessage(assistantMessage.id, {
          content: event.message,
          loading: false,
        })
        scrollToBottom()
        return
      }

      if (event.type === 'done') {
        patchMessage(assistantMessage.id, {
          loading: false,
        })
        scrollToBottom()
      }
    })
  }
  catch (error: any) {
    if (error?.name !== 'AbortError') {
      patchMessage(assistantMessage.id, {
        content: 'AI 助手暂时不可用，请稍后重试。',
        loading: false,
      })
    }
  }
  finally {
    loading.value = false
    patchMessage(assistantMessage.id, {
      loading: false,
    })
  }
}

function sendQuickAction(action: AgentAction, prompt: string) {
  send(prompt, action)
}

function closeDialog() {
  open.value = false
  if (loading.value) {
    abort()
    loading.value = false
  }
}

async function resetConversation() {
  restoreRequestId++

  if (loading.value) {
    abort()
    loading.value = false
  }

  const articleId = props.article?.id
  const currentVisitorId = visitorId.value
  const archivedConversationId = conversationId.value
  input.value = ''
  conversationId.value = undefined
  messages.value = []

  try {
    const conversationIdToArchive = archivedConversationId || await getCurrentArticleConversationId(articleId, currentVisitorId)

    if (!conversationIdToArchive || !currentVisitorId)
      return

    setClearedConversationId(conversationIdToArchive, articleId, currentVisitorId)
    await archiveAgentConversationApi(conversationIdToArchive, currentVisitorId)
  }
  catch (error) {
    console.error(error)
  }
}

watch(
  () => props.embedded,
  (embedded) => {
    if (embedded)
      open.value = true
  },
)

watch(open, (isOpen) => {
  if (isOpen)
    scrollToBottom()
})

watch(
  [() => props.article?.id, visitorId],
  ([articleId, currentVisitorId]) => {
    if (articleId && currentVisitorId)
      restoreConversation()
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(abort)
</script>

<template>
  <Teleport to="body" :disabled="embedded">
    <div
      v-if="article"
      class="article-agent"
      :class="{
        'article-agent--embedded': embedded,
        'article-agent--dark': isAgentDark,
      }"
    >
      <Transition name="agent-pop">
        <div v-if="open" class="article-agent__dialog">
          <header class="article-agent__header">
            <div class="article-agent__ident">
              <img class="article-agent__icon" :src="aiAssistantIcon" alt="">
              <div>
                <div class="article-agent__title">
                  AI 助手
                </div>
                <div class="article-agent__subtitle">
                  您的智能博客助手，随时为您解答
                </div>
              </div>
            </div>
            <div class="article-agent__tools">
              <button type="button" aria-label="重置对话" @click="resetConversation">
                <div i-mingcute:refresh-2-line />
              </button>
              <button type="button" aria-label="关闭 AI 助手" @click="closeDialog">
                <div i-mingcute:close-line />
              </button>
            </div>
          </header>

          <div ref="bodyRef" class="article-agent__body">
            <div class="article-agent__thread">
              <div class="article-agent__message article-agent__message--assistant">
                <div class="article-agent__bubble">
                  <p>👋 你好！我是你的 AI 助手</p>
                  <p>可以帮你解释文章内容、技术问题，或推荐相关灵感。</p>
                </div>
              </div>

              <div
                v-for="message in messages"
                :key="message.id"
                class="article-agent__message"
                :class="`article-agent__message--${message.role}`"
              >
                <div class="article-agent__bubble">
                  <MdPreview
                    v-if="message.content && !message.loading"
                    class="article-agent__markdown"
                    :model-value="message.content"
                    :editor-id="`agent-message-${message.id}`"
                    :md-heading-id="mdHeadingId"
                    :theme="previewTheme"
                    :sanitize="sanitizeAgentMarkdown"
                    preview-theme="default"
                  />
                  <span
                    v-else-if="message.content"
                    class="article-agent__streaming-text"
                    v-text="message.content"
                  />
                  <span v-else class="article-agent__typing">思考中...</span>

                  <div
                    v-if="message.toolEvents?.length"
                    class="article-agent__tool-events"
                  >
                    <div
                      v-for="toolEvent in message.toolEvents"
                      :key="toolEvent.toolCallId"
                      class="article-agent__tool-event"
                      :class="`article-agent__tool-event--${toolEvent.status}`"
                    >
                      <div
                        v-if="toolEvent.status === 'running'"
                        i-mingcute:loading-line
                        class="article-agent__tool-icon article-agent__loading"
                      />
                      <div
                        v-else
                        i-mingcute:check-circle-line
                        class="article-agent__tool-icon"
                      />
                      <span v-text="toolEvent.displayText" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="restoring"
                class="article-agent__message article-agent__message--assistant"
              >
                <div class="article-agent__bubble">
                  <span class="article-agent__typing">正在恢复对话...</span>
                </div>
              </div>

              <div
                v-if="lastAssistantMessage?.references?.length"
                class="article-agent__references"
              >
                <div class="article-agent__reference-title">
                  <span>引用来源</span>
                  <span>RAG 检索</span>
                </div>
                <div class="article-agent__reference-list">
                  <a
                    v-for="reference in lastAssistantMessage.references"
                    :key="`${reference.sourceType}-${reference.sourceId}`"
                    :href="reference.url || undefined"
                    class="article-agent__reference"
                  >
                    <div class="article-agent__reference-head">
                      <span v-text="reference.title" />
                      <small
                        v-if="formatReferenceScore(reference.score)"
                        v-text="formatReferenceScore(reference.score)"
                      />
                    </div>
                    <p
                      v-if="reference.snippet"
                      v-text="reference.snippet"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form class="article-agent__input" @submit.prevent="send()">
            <div class="article-agent__actions">
              <button
                v-for="item in quickActions"
                :key="item.action"
                type="button"
                @click="sendQuickAction(item.action, item.prompt)"
              >
                <span v-text="item.label" />
              </button>
            </div>
            <div class="article-agent__input-row">
              <input
                v-model="input"
                :disabled="loading"
                placeholder="输入问题，Enter 发送"
              >
              <button type="submit" :disabled="loading || !input.trim()">
                <div v-if="loading" i-mingcute:loading-line class="article-agent__loading" />
                <div v-else i-mingcute:send-plane-line />
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <button
        v-if="!open && !embedded"
        class="
          pointer-events-auto border rounded-full relative z-[2147483001]
          flex gap-0.5 p-2 flex-col items-center justify-center
          w-10 cursor-pointer
          transition duration-200
        "
        type="button"
        aria-label="打开 AI 助手"
        @click="toggleOpen"
      >
        <img class="w-6.5 h-6.5 object-contain" :src="aiAssistantIcon" alt="">
        <div class="flex flex-col">
          <span>AI</span>
          <span>助</span>
          <span>手</span>
        </div>
      </button>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.article-agent {
  --agent-bg: rgba(255, 255, 255, 0.98);
  --agent-bg-strong: #ffffff;
  --agent-border: rgba(226, 232, 240, 0.9);
  --agent-border-strong: rgba(203, 213, 225, 0.88);
  --agent-text: #111827;
  --agent-muted: #8a94a6;
  --agent-soft: rgba(248, 250, 252, 0.78);
  --agent-bubble: rgba(255, 255, 255, 0.88);
  --agent-bubble-border: rgba(226, 232, 240, 0.86);
  --agent-user-bubble: #e9f3ff;
  --agent-user-text: #1d5fae;
  --agent-user-border: rgba(98, 157, 231, 0.24);
  --agent-action-bg: rgba(255, 255, 255, 0.76);
  --agent-action-hover: rgba(232, 243, 255, 0.92);
  --agent-input-bg: rgba(255, 255, 255, 0.9);
  --agent-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
  --agent-card-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);

  position: fixed;
  right: 24px;
  bottom: 150px;
  z-index: 2147483000;
  isolation: isolate;
  pointer-events: none;
}

.article-agent--dark,
:global(html[theme="dark"]) .article-agent,
:global(html.dark) .article-agent,
:global(.dark) .article-agent {
  --agent-bg: rgba(17, 24, 39, 0.98);
  --agent-bg-strong: #111827;
  --agent-border: rgba(148, 163, 184, 0.18);
  --agent-border-strong: rgba(148, 163, 184, 0.28);
  --agent-text: #f8fafc;
  --agent-muted: rgba(226, 232, 240, 0.56);
  --agent-soft: rgba(15, 23, 42, 0.46);
  --agent-bubble: rgba(30, 41, 59, 0.72);
  --agent-bubble-border: rgba(148, 163, 184, 0.18);
  --agent-user-bubble: rgba(37, 99, 154, 0.46);
  --agent-user-text: #dbeafe;
  --agent-user-border: rgba(125, 211, 252, 0.16);
  --agent-action-bg: rgba(15, 23, 42, 0.46);
  --agent-action-hover: rgba(30, 64, 112, 0.48);
  --agent-input-bg: rgba(15, 23, 42, 0.72);
  --agent-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
  --agent-card-shadow: 0 12px 34px rgba(0, 0, 0, 0.2);
}

.article-agent__entry,
.article-agent__dialog,
.article-agent__collapsed {
  pointer-events: auto;
}

.article-agent--embedded {
  position: relative;
  right: auto;
  bottom: auto;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.article-agent__entry {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.article-agent__button {
  position: relative;
  z-index: 1;
  width: 34px;
  height: 34px;
  border: 1px solid var(--agent-border);
  border-radius: 50%;
  color: var(--primary-1);
  background: var(--agent-bg-strong);
  box-shadow: var(--agent-card-shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(24, 121, 221, 0.22);
  }
}

.article-agent__button-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.article-agent__label {
  height: 36px;
  margin-left: -48px;
  padding: 0 18px 0 52px;
  border: 1px solid var(--agent-border);
  border-radius: 999px;
  color: var(--primary-1);
  background: var(--agent-bg-strong);
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--agent-card-shadow);
  cursor: pointer;
}

.article-agent__trigger-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--agent-text);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.article-agent__dialog {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2147483001;
  display: flex;
  flex-direction: column;
  width: min(430px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  height: min(560px, calc(100vh - 112px));
  overflow: hidden;
  border: 1px solid var(--agent-border);
  border-radius: 12px;
  background: var(--agent-bg);
  box-shadow: var(--agent-shadow);
  backdrop-filter: blur(20px) saturate(1.35);
  -webkit-backdrop-filter: blur(20px) saturate(1.35);
}

.article-agent--embedded .article-agent__dialog {
  position: relative;
  right: auto;
  bottom: auto;
  z-index: 1;
  width: 100%;
  height: min(560px, calc(100vh - 104px));
  min-height: 430px;
}

.article-agent__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--agent-border);
  background: linear-gradient(180deg, var(--agent-bg-strong), rgba(255, 255, 255, 0));
}

.article-agent--dark .article-agent__header,
:global(html[theme="dark"]) .article-agent__header,
:global(html.dark) .article-agent__header,
:global(.dark) .article-agent__header {
  background: linear-gradient(180deg, var(--agent-bg-strong), rgba(17, 24, 39, 0));
}

.article-agent__ident {
  display: flex;
  align-items: center;
  gap: 10px;
}

.article-agent__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.article-agent__title {
  color: var(--agent-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 20px;
}

.article-agent__subtitle {
  max-width: 230px;
  overflow: hidden;
  color: var(--agent-muted);
  font-size: 11px;
  line-height: 17px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-agent__tools {
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    color: var(--agent-muted);
    background: transparent;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;

    &:hover {
      color: var(--agent-text);
      background: var(--agent-soft);
    }
  }
}

.article-agent__body {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 18px 16px 14px;
  overflow-x: hidden;
  overflow-y: auto;
  background:
    radial-gradient(circle at 12% 10%, rgba(96, 165, 250, 0.08), transparent 26%),
    radial-gradient(circle at 88% 6%, rgba(168, 85, 247, 0.07), transparent 24%),
    var(--agent-bg);
}

.article-agent__thread {
  display: grid;
  min-width: 0;
  gap: 16px;
}

.article-agent__message {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &--user {
    justify-content: flex-end;

    .article-agent__bubble {
      color: var(--agent-user-text);
      border-color: var(--agent-user-border);
      border-radius: 12px 12px 4px 12px;
      background: var(--agent-user-bubble);
      box-shadow: none;
    }
  }

  &--assistant {
    justify-content: flex-start;

    .article-agent__bubble {
      color: var(--agent-text);
      border-color: var(--agent-bubble-border);
      border-radius: 12px 12px 12px 4px;
      background: var(--agent-bubble);
    }
  }
}

.article-agent__bubble {
  min-width: 0;
  max-width: min(78%, 300px);
  padding: 11px 13px;
  border: 1px solid transparent;
  font-size: 13px;
  line-height: 1.65;
  overflow: hidden;
  box-shadow: var(--agent-card-shadow);

  p {
    margin: 0;

    + p {
      margin-top: 4px;
    }
  }
}

.article-agent__markdown {
  --md-color: var(--agent-text);
  --md-bk-color: transparent;
  --md-border-color: transparent;

  width: 100%;
  min-width: 0;
  color: inherit;
  background: transparent;

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }

  :deep(.md-editor-preview) {
    color: inherit;
    font-size: 13px;
    line-height: 1.65;
    word-break: break-word;
  }

  :deep(.md-editor-preview > :first-child) {
    margin-top: 0;
  }

  :deep(.md-editor-preview > :last-child) {
    margin-bottom: 0;
  }

  :deep(.md-editor-preview p) {
    margin: 0 0 8px;
    line-height: 1.65;
  }

  :deep(.md-editor-preview h1),
  :deep(.md-editor-preview h2),
  :deep(.md-editor-preview h3),
  :deep(.md-editor-preview h4),
  :deep(.md-editor-preview h5),
  :deep(.md-editor-preview h6) {
    margin: 10px 0 6px;
    color: inherit;
    font-size: 13px;
    line-height: 1.55;
  }

  :deep(.md-editor-preview ul),
  :deep(.md-editor-preview ol) {
    margin: 6px 0;
    padding-left: 18px;
  }

  :deep(.md-editor-preview li) {
    margin: 3px 0;
  }

  :deep(.md-editor-preview code) {
    white-space: break-spaces;
  }

  :deep(.md-editor-code) {
    max-width: 100%;
    margin: 8px 0;
    overflow: hidden;
  }

  :deep(.md-editor-code pre code) {
    padding: 10px;
    font-size: 12px;
    white-space: pre;
  }
}

.article-agent__streaming-text {
  display: block;
  color: inherit;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.article-agent__typing {
  color: var(--agent-muted);
}

.article-agent__tool-events {
  display: grid;
  gap: 6px;
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid var(--agent-border);
}

.article-agent__tool-event {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: var(--agent-muted);
  font-size: 12px;
  line-height: 18px;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.article-agent__tool-event--done {
  color: var(--primary-1);
}

.article-agent__tool-icon {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
}

.article-agent__references {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  padding: 10px 12px;
  overflow: hidden;
  border: 1px solid var(--agent-border);
  border-radius: 10px;
  background: var(--agent-soft);
}

.article-agent__reference-title {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  color: var(--agent-muted);
  font-size: 12px;

  span:last-child {
    font-size: 11px;
  }
}

.article-agent__reference-list {
  min-width: 0;
  max-height: clamp(126px, 28vh, 206px);
  margin-right: -4px;
  padding-right: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.article-agent__reference {
  display: block;
  min-width: 0;
  max-width: 100%;
  padding: 7px 0;
  overflow: hidden;
  color: var(--primary-1);
  font-size: 13px;
  line-height: 19px;
  text-decoration: none;

  + .article-agent__reference {
    border-top: 1px solid var(--agent-border);
  }

  &:hover {
    .article-agent__reference-head span {
      text-decoration: underline;
    }
  }

  p {
    display: -webkit-box;
    margin: 4px 0 0;
    overflow: hidden;
    color: var(--agent-muted);
    font-size: 12px;
    line-height: 17px;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
}

.article-agent__reference-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  gap: 10px;

  span {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--primary-1);
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    flex: 0 0 auto;
    color: var(--agent-muted);
    font-size: 11px;
  }
}

.article-agent__input {
  padding: 12px 14px 14px;
  border-top: 1px solid var(--agent-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--agent-bg-strong));
}

.article-agent--dark .article-agent__input,
:global(html[theme="dark"]) .article-agent__input,
:global(html.dark) .article-agent__input,
:global(.dark) .article-agent__input {
  background: linear-gradient(180deg, rgba(17, 24, 39, 0), var(--agent-bg-strong));
}

.article-agent__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 68px;
    height: 28px;
    padding: 0 12px;
    border: 1px solid var(--agent-border);
    border-radius: 999px;
    color: var(--agent-muted);
    background: var(--agent-action-bg);
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;

    &:hover {
      color: var(--primary-1);
      border-color: rgba(37, 99, 235, 0.26);
      background: var(--agent-action-hover);
    }
  }
}

.article-agent__input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 6px 0 14px;
  border: 1px solid var(--agent-border-strong);
  border-radius: 12px;
  background: var(--agent-input-bg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42);
  transition: border-color 0.2s, box-shadow 0.2s;

  input {
    min-width: 0;
    flex: 1;
    height: 100%;
    padding: 0;
    border: none;
    color: var(--agent-text);
    background: transparent;
    font-size: 12px;
    outline: none;

    &::placeholder {
      color: var(--agent-muted);
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.article-agent__loading {
  animation: agent-spin 0.9s linear infinite;
}

.article-agent__collapsed {
  position: relative;
  z-index: 2147483001;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 14px;
    border: 1px solid var(--agent-border);
    border-radius: 999px;
    color: var(--primary-1);
    background: var(--agent-bg-strong);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--agent-card-shadow);
  }
}

.agent-pop-enter-active,
.agent-pop-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}

.agent-pop-enter-from,
.agent-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.article-agent--embedded .agent-pop-enter-active,
.article-agent--embedded .agent-pop-leave-active {
  transition: opacity 0.16s;
}

.article-agent--embedded .agent-pop-enter-from,
.article-agent--embedded .agent-pop-leave-to {
  transform: none;
}

@keyframes agent-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .article-agent {
    right: 12px;
    bottom: 12px;
  }

  .article-agent__dialog {
    right: 12px;
    bottom: 12px;
    width: calc(100vw - 32px);
    height: min(560px, calc(100vh - 96px));
  }

  .article-agent__subtitle {
    max-width: 180px;
  }

  .article-agent__bubble {
    max-width: 82%;
  }

  .article-agent__reference-list {
    max-height: 132px;
  }
}
</style>
