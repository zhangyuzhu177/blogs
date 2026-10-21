<script setup lang="ts">
import type { AgentAction, IAgentMessage, IAgentReference, IAgentToolResult, IArticle } from 'types'
import { MdPreview } from 'md-editor-v3'

import 'md-editor-v3/lib/preview.css'
import { useAgentStream } from './useAgentStream'
import aiAssistantIcon from '~/assets/icons/ai.svg'

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
const assistantContentClass = 'max-w-full min-w-0 w-full text-14px text-grey-9 leading-[1.8] [overflow-wrap:anywhere] dark:text-white'
const userContentClass = 'max-w-[90%] min-w-0 rounded bg-primary-4 px-3 py-2 text-14px text-grey-9 leading-[1.8] [overflow-wrap:anywhere] dark:bg-primary-1/20 dark:text-white'

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

  if (existedIndex === -1) {
    toolEvents.push(event)
  }
  else {
    toolEvents[existedIndex] = {
      ...toolEvents[existedIndex],
      ...event,
    }
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
      class="isolate"
      :class="[
        isAgentDark && 'dark',
        embedded
          ? 'pointer-events-auto relative z-1 h-full w-full'
          : 'pointer-events-none fixed bottom-[150px] right-6 z-[2147483000] lt-sm:bottom-3 lt-sm:right-3',
      ]"
    >
      <Transition
        :enter-active-class="embedded ? 'transition-opacity duration-200' : 'transition duration-200 ease-out'"
        :enter-from-class="embedded ? 'opacity-0' : 'opacity-0 translate-y-2 scale-95'"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        :leave-active-class="embedded ? 'transition-opacity duration-200' : 'transition duration-200 ease-in'"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        :leave-to-class="embedded ? 'opacity-0' : 'opacity-0 translate-y-2 scale-95'"
      >
        <div
          v-if="open"
          class="pointer-events-auto flex flex-col overflow-hidden border border-grey-3 rounded-4 border-solid bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/95 dark:shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
          :class="embedded
            ? 'relative z-1 h-[min(560px,calc(100vh-104px))] min-h-[430px] w-full'
            : 'fixed bottom-6 right-6 z-[2147483001] h-[min(650px,calc(100vh-112px))] w-[min(430px,calc(100vw-32px))] lt-sm:bottom-3 lt-sm:right-3 lt-sm:h-[min(560px,calc(100vh-96px))] lt-sm:w-[calc(100vw-32px)]'"
        >
          <header class="min-h-17 flex items-center justify-between border-b border-grey-3 border-solid bg-gradient-to-b px-4 py-3.5 dark:border-white/10 from-white to-transparent dark:from-[#111827]">
            <div class="flex items-center gap-2.5">
              <div class="rounded-2.5 bg-primary-4 flex-center size-10 shrink-0 dark:bg-primary-1/15">
                <img class="h-7 w-7 object-contain" :src="aiAssistantIcon" alt="">
              </div>
              <div class="min-w-0">
                <div class="text-15px text-grey-9 font-650 leading-5 dark:text-white">
                  AI 助手
                </div>
                <div class="max-w-[230px] truncate text-11px text-grey-5 leading-[17px] lt-sm:max-w-[180px]">
                  您的智能博客助手，随时为您解答
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                class="flex-center size-7 cursor-pointer border-none rounded-full bg-transparent text-grey-5 transition duration-200 dark:hover:bg-white/10 hover:bg-grey-2 dark:hover:text-white hover:text-grey-9"
                type="button"
                aria-label="重置对话"
                @click="resetConversation"
              >
                <div i-mingcute:refresh-2-line />
              </button>
              <button
                class="flex-center size-7 cursor-pointer border-none rounded-full bg-transparent text-grey-5 transition duration-200 dark:hover:bg-white/10 hover:bg-grey-2 dark:hover:text-white hover:text-grey-9"
                type="button"
                aria-label="关闭 AI 助手"
                @click="closeDialog"
              >
                <div i-mingcute:close-line />
              </button>
            </div>
          </header>

          <div ref="bodyRef" class="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white px-4 pb-3.5 pt-4.5 dark:bg-[#111827]">
            <div class="grid min-w-0 gap-5">
              <div class="min-w-0 flex items-start justify-start gap-2.5">
                <div :class="assistantContentClass">
                  <p class="m-0">
                    👋 你好！我是你的 AI 助手
                  </p>
                  <p class="m-0 mt-1 text-grey-5">
                    可以帮你解释文章内容、技术问题，或推荐相关灵感。
                  </p>
                </div>
              </div>

              <div
                v-for="message in messages"
                :key="message.id"
                class="min-w-0 flex items-start gap-2.5"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div :class="message.role === 'user' ? userContentClass : assistantContentClass">
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
                    class="block whitespace-pre-wrap break-words"
                    v-text="message.content"
                  />
                  <span v-else class="text-grey-5">思考中...</span>

                  <div
                    v-if="message.toolEvents?.length"
                    class="grid mt-3.5 gap-1.5"
                  >
                    <div
                      v-for="toolEvent in message.toolEvents"
                      :key="toolEvent.toolCallId"
                      class="flex items-start gap-2 border border-grey-3 rounded px-3 py-3 text-xs dark:border-white/10"
                      :class="toolEvent.status === 'done' ? 'text-primary-1' : 'text-grey-5'"
                    >
                      <div
                        v-if="toolEvent.status === 'running'"
                        i-mingcute:loading-line
                        class="mt-0.5 size-3.5 shrink-0 animate-spin"
                      />
                      <div
                        v-else
                        i-mingcute:check-circle-line
                        class="mt-0.5 size-3.5 shrink-0"
                      />
                      <span class="min-w-0 [overflow-wrap:anywhere]" v-text="toolEvent.displayText" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="restoring"
                class="min-w-0 flex items-start justify-start gap-2.5"
              >
                <div :class="assistantContentClass">
                  <span class="text-grey-5">正在恢复对话...</span>
                </div>
              </div>

              <div
                v-if="lastAssistantMessage?.references?.length"
                class="max-w-full min-w-0 flex flex-col overflow-hidden border border-grey-3 rounded-2.5 bg-grey-2/80 px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
              >
                <div class="mb-2 flex items-center justify-between gap-2.5 text-xs text-grey-5">
                  <span>引用来源</span>
                  <span class="text-11px">RAG 检索</span>
                </div>
                <div class="max-h-[clamp(126px,28vh,206px)] min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 -mr-1 lt-sm:max-h-[132px]">
                  <a
                    v-for="reference in lastAssistantMessage.references"
                    :key="`${reference.sourceType}-${reference.sourceId}`"
                    :href="reference.url || undefined"
                    class="group block max-w-full min-w-0 overflow-hidden border-t border-grey-3 py-1.75 text-13px text-primary-1 leading-[19px] no-underline first:border-t-0 dark:border-white/10"
                  >
                    <div class="min-w-0 flex items-center justify-between gap-2.5">
                      <span class="min-w-0 flex-1 truncate group-hover:underline" v-text="reference.title" />
                      <small
                        v-if="formatReferenceScore(reference.score)"
                        class="shrink-0 text-11px text-grey-5"
                        v-text="formatReferenceScore(reference.score)"
                      />
                    </div>
                    <p
                      v-if="reference.snippet"
                      class="line-clamp-1 m-0 mt-1 text-xs text-grey-5 [overflow-wrap:anywhere]"
                      v-text="reference.snippet"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form class="border-t border-grey-3 border-solid bg-gradient-to-b px-3.5 pb-3.5 pt-3 dark:border-white/10 from-transparent to-white dark:to-[#111827]" @submit.prevent="send()">
            <div class="mb-2.5 flex flex-wrap gap-2">
              <button
                v-for="item in quickActions"
                :key="item.action"
                class="inline-flex h-7 min-w-17 cursor-pointer items-center justify-center border border-grey-3 rounded-full bg-white/80 px-3 text-xs text-grey-5 transition duration-200 dark:border-white/10 dark:bg-white/5 hover:border-primary-1/30 hover:bg-primary-4 hover:text-primary-1 dark:hover:bg-primary-1/20 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                :disabled="loading"
                @click="sendQuickAction(item.action, item.prompt)"
              >
                <span v-text="item.label" />
              </button>
            </div>
            <div class="h-10.5 flex items-center gap-2 border border-grey-4 rounded-3 bg-white/90 pl-3.5 pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] transition duration-200 dark:border-white/15 focus-within:border-primary-1/40 dark:bg-[#0f172a]/70">
              <input
                v-model="input"
                class="h-full min-w-0 flex-1 border-none bg-transparent text-xs text-grey-9 outline-none dark:text-white placeholder:text-grey-5"
                :disabled="loading"
                placeholder="输入问题，Enter 发送"
              >
              <button
                class="flex-center size-7.5 cursor-pointer border-none rounded-full transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                :disabled="loading || !input.trim()"
              >
                <div v-if="loading" i-mingcute:loading-line class="animate-spin" />
                <div v-else i-mingcute:send-plane-line />
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <button
        v-if="!open && !embedded"
        class="pointer-events-auto relative z-[2147483001] w-11 flex flex-col cursor-pointer items-center justify-center gap-1 border border-grey-3 rounded-full bg-white p-2 text-grey-8 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition duration-200 dark:border-white/10 dark:bg-grey-9 dark:text-white hover:shadow-[0_14px_34px_rgba(24,121,221,0.22)] hover:-translate-y-0.5"
        type="button"
        aria-label="打开 AI 助手"
        @click="toggleOpen"
      >
        <img class="h-6.5 w-6.5 object-contain" :src="aiAssistantIcon" alt="">
        <span class="flex flex-col items-center gap-0.75 text-12px font-500 leading-none">
          <span>AI</span>
          <span>助</span>
          <span>手</span>
        </span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.article-agent__markdown {
  --md-color: inherit;
  --md-bk-color: transparent;
  --md-border-color: transparent;

  width: 100%;
  min-width: 0;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  background: transparent;

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }

  :deep(.md-editor-preview) {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    word-break: break-word;
  }

  :deep(.md-editor-preview > :first-child) {
    margin-top: 0;
  }

  :deep(.md-editor-preview > :last-child) {
    margin-bottom: 0;
  }

  :deep(.md-editor-preview p) {
    margin: 0 0 12px;
    line-height: inherit;
  }

  :deep(.md-editor-preview h1),
  :deep(.md-editor-preview h2),
  :deep(.md-editor-preview h3),
  :deep(.md-editor-preview h4),
  :deep(.md-editor-preview h5),
  :deep(.md-editor-preview h6) {
    margin: 18px 0 10px;
    color: inherit;
    font-size: inherit;
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
</style>
